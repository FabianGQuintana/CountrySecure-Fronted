// Prueba de humo del flujo de sesión (login, refresh, expiración, logout) contra la app y la API reales.
//
// Uso (con la API y el front levantados, p. ej. `npm run build && npm start`):
//   SMOKE_PASSWORD_ADMIN=... SMOKE_PASSWORD_RESIDENT=... SMOKE_PASSWORD_SECURITY=... node scripts/auth-smoke.mjs
//
// Variables opcionales: WEB_URL (def. http://localhost:3000), API_URL (def. API_HOST de .env),
// SMOKE_EMAIL_<ROL> (def. los usuarios demo del seed).
import { readFileSync } from "node:fs";
import { encode, decode } from "next-auth/jwt";

// ---- Configuración ----
function loadEnv() {
  try {
    return Object.fromEntries(
      readFileSync(new URL("../.env", import.meta.url), "utf8")
        .split(/\r?\n/)
        .filter((l) => l && !l.startsWith("#") && l.includes("="))
        .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
    );
  } catch {
    return {};
  }
}
const env = { ...loadEnv(), ...process.env };
const WEB = (env.WEB_URL || "http://localhost:3000").replace(/\/$/, "");
const API = (env.API_URL || env.API_HOST || "http://localhost:5021").replace(/\/$/, "");
const SECRET = env.AUTH_SECRET || env.JWT_SECRET;
const COOKIE = "next-auth.session-token";

const ROLES = {
  Admin: { email: env.SMOKE_EMAIL_ADMIN || "admin@countrysecure.local", password: env.SMOKE_PASSWORD_ADMIN, pages: ["/admin", "/admin/users/residentes", "/admin/amenities", "/admin/orders", "/admin/lotes"] },
  Resident: { email: env.SMOKE_EMAIL_RESIDENT || "residente@countrysecure.local", password: env.SMOKE_PASSWORD_RESIDENT, pages: ["/resident/dashboard", "/resident/profile", "/resident/reservations", "/resident/requests", "/resident/amenities"] },
  Security: { email: env.SMOKE_EMAIL_SECURITY || "seguridad@countrysecure.local", password: env.SMOKE_PASSWORD_SECURITY, pages: ["/security/visit", "/security/logs", "/security/permissions", "/security/services", "/security/family-visits"] },
};

// ---- Utilidades ----
let failures = 0;
const check = (ok, label, extra = "") => {
  console.log(`${ok ? "  ✓" : "  ✗"} ${label}${extra ? `  (${extra})` : ""}`);
  if (!ok) failures++;
};

class Jar {
  cookies = new Map();
  header() {
    return [...this.cookies].map(([k, v]) => `${k}=${v}`).join("; ");
  }
  absorb(res) {
    for (const line of res.headers.getSetCookie?.() ?? []) {
      const [pair, ...attrs] = line.split(";");
      const i = pair.indexOf("=");
      const name = pair.slice(0, i).trim();
      const value = pair.slice(i + 1).trim();
      const maxAge0 = attrs.some((a) => /^\s*max-age=0/i.test(a));
      if (!value || maxAge0) this.cookies.delete(name);
      else this.cookies.set(name, value);
    }
  }
}

async function get(jar, path, { follow = false } = {}) {
  let url = WEB + path;
  const hops = [];
  for (let i = 0; i < 12; i++) {
    const res = await fetch(url, { redirect: "manual", headers: { cookie: jar.header() }, signal: AbortSignal.timeout(60000) });
    jar.absorb(res);
    const loc = res.headers.get("location");
    hops.push({ status: res.status, path: new URL(url).pathname + new URL(url).search, location: loc });
    if (!follow || !loc) return { res, hops };
    url = new URL(loc, url).toString();
  }
  return { res: null, hops, looped: true };
}

async function apiLogin(role) {
  const { email, password } = ROLES[role];
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`Login API ${role}: ${res.status}`);
  return res.json();
}

// Login real a través de NextAuth (credentials)
async function webLogin(role) {
  const jar = new Jar();
  const csrfRes = await fetch(`${WEB}/api/auth/csrf`);
  jar.absorb(csrfRes);
  const { csrfToken } = await csrfRes.json();
  const { email, password } = ROLES[role];
  const res = await fetch(`${WEB}/api/auth/callback/credentials`, {
    method: "POST",
    redirect: "manual",
    headers: { "Content-Type": "application/x-www-form-urlencoded", cookie: jar.header() },
    body: new URLSearchParams({ csrfToken, email, password, json: "true" }),
  });
  jar.absorb(res);
  return jar;
}

// Cookie de sesión "sintética" con un access token vencido pero refresh token real
async function expiredJar(role, { refreshToken } = {}) {
  const login = await apiLogin(role);
  const token = await encode({
    secret: SECRET,
    maxAge: 7 * 24 * 3600,
    token: {
      id: login.userId, email: login.email, name: login.name, role: login.role,
      accessToken: login.accessToken,
      refreshToken: refreshToken ?? login.refreshToken,
      accessTokenExpires: Date.now() - 60_000,
    },
  });
  const jar = new Jar();
  jar.cookies.set(COOKIE, token);
  return { jar, login };
}

const isLoginRedirect = (hop) => hop.status === 307 && hop.location?.includes("/login");

// ---- Escenarios ----
async function main() {
  for (const [role, cfg] of Object.entries(ROLES)) {
    if (!cfg.password) throw new Error(`Falta SMOKE_PASSWORD_${role.toUpperCase()}`);
  }
  if (!SECRET) throw new Error("No se encontró JWT_SECRET / AUTH_SECRET");
  console.log(`Front: ${WEB}  API: ${API}\n`);

  console.log("1) Login real y navegación entre 5 páginas, por rol");
  for (const role of Object.keys(ROLES)) {
    const jar = await webLogin(role);
    check(jar.cookies.has(COOKIE), `${role}: cookie de sesión creada`);
    const statuses = [];
    for (const page of ROLES[role].pages) statuses.push((await get(jar, page)).res.status);
    check(statuses.every((s) => s === 200), `${role}: 5 páginas devuelven 200`, statuses.join(","));
  }

  console.log("\n2) Access token vencido + refresh token válido: la sesión se renueva y persiste");
  {
    const { jar } = await expiredJar("Security");
    const statuses = [];
    let renewedOnFirst = false;
    for (const [i, page] of ROLES.Security.pages.entries()) {
      const before = jar.cookies.get(COOKIE);
      const { res } = await get(jar, page);
      statuses.push(res.status);
      if (i === 0) renewedOnFirst = jar.cookies.get(COOKIE) !== before;
    }
    check(statuses.every((s) => s === 200), "5 navegaciones seguidas devuelven 200", statuses.join(","));
    check(renewedOnFirst, "la primera respuesta entrega la cookie renovada (Set-Cookie)");
    const decoded = await decode({ token: jar.cookies.get(COOKIE), secret: SECRET });
    check(decoded?.accessTokenExpires > Date.now() + 3600_000, "el access token guardado está vigente");
  }

  console.log("\n3) Requests simultáneas con el mismo refresh token (ventana de gracia)");
  {
    const { jar } = await expiredJar("Resident");
    const results = await Promise.all(
      ROLES.Resident.pages.map(async (p) => {
        const clone = new Jar();
        clone.cookies = new Map(jar.cookies);
        return (await get(clone, p)).res.status;
      })
    );
    check(results.every((s) => s === 200), "5 requests en paralelo con la misma cookie vencida", results.join(","));
  }

  console.log("\n4) Refresh token revocado/vencido: una sola redirección a /login, sin bucle");
  {
    const { jar } = await expiredJar("Security", { refreshToken: "token-que-no-existe" });
    const { hops, looped } = await get(jar, "/security/visit", { follow: true });
    const redirects = hops.filter((h) => h.status >= 300 && h.status < 400).length;
    check(!looped, "la navegación termina (sin bucle)", `${hops.length} requests`);
    check(redirects === 1, "exactamente 1 redirección", hops.map((h) => `${h.status} ${h.path}`).join(" → "));
    check(hops.at(-1)?.path.startsWith("/login") && hops.at(-1)?.status === 200, "termina en /login con 200");
    check(hops[0].location?.includes("reason=expired"), "el login recibe reason=expired");
    check(!jar.cookies.has(COOKIE), "la cookie de sesión fue borrada");
  }

  console.log("\n5) 'Atrás': la landing con sesión activa NO redirige");
  {
    const jar = await webLogin("Security");
    const { res } = await get(jar, "/");
    check(res.status === 200, "GET / devuelve 200 (sin redirección automática)", String(res.status));
    const html = await res.text();
    check(html.includes("Ir a mi panel"), "muestra el acceso 'Ir a mi panel'");
    const login = await get(jar, "/login");
    check(login.res.status === 307 && login.res.headers.get("location")?.includes("/security"), "GET /login con sesión va al panel del rol (1 salto)");
  }

  console.log("\n6) Rol incorrecto");
  {
    const jar = await webLogin("Resident");
    const { res } = await get(jar, "/admin");
    check(res.status === 307 && res.headers.get("location")?.includes("/resident/dashboard"), "un residente en /admin vuelve a su panel");
  }

  console.log("\n7) Logout revoca el refresh token en el backend");
  {
    const jar = await webLogin("Security");
    const session = await decode({ token: jar.cookies.get(COOKIE), secret: SECRET });
    const csrfRes = await fetch(`${WEB}/api/auth/csrf`, { headers: { cookie: jar.header() } });
    jar.absorb(csrfRes);
    const { csrfToken } = await csrfRes.json();
    const out = await fetch(`${WEB}/api/auth/signout`, {
      method: "POST",
      redirect: "manual",
      headers: { "Content-Type": "application/x-www-form-urlencoded", cookie: jar.header() },
      body: new URLSearchParams({ csrfToken, json: "true" }),
    });
    jar.absorb(out);
    await new Promise((r) => setTimeout(r, 500));
    const reuse = await fetch(`${API}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: session.accessToken, refreshToken: session.refreshToken }),
    });
    check(reuse.status === 401, "el refresh token revocado ya no sirve", String(reuse.status));
    const { res } = await get(jar, "/security/visit");
    check(res.status === 307 && res.headers.get("location")?.includes("/login"), "/security redirige a /login tras el logout");
  }

  console.log(failures ? `\n✗ ${failures} verificación(es) fallaron` : "\n✓ Todo OK");
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error("Error en la prueba:", e);
  process.exit(2);
});
