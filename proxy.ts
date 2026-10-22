import { NextResponse, type NextRequest } from "next/server";
import { encode, getToken, type JWT } from "next-auth/jwt";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  parseExpiration,
} from "@/lib/authOptions";
import { LOGIN_PATH, ROLE_PREFIX, homeForRole, isRole, safeCallbackUrl } from "@/lib/routes";

/**
 * Proxy (antes "middleware"): ÚNICO dueño del ciclo de vida de la sesión.
 *
 *  1. Protege /admin, /resident y /security según el rol.
 *  2. Solo en esas rutas renueva el access token cuando está por vencer y GUARDA el token nuevo
 *     en la cookie (solo acá se pueden escribir cookies de forma confiable).
 *  3. Si la renovación falla (refresh token inválido, timeout o API caída), borra las cookies de
 *     sesión y manda a /login una sola vez, sin bucles ni cookies viejas.
 *  4. /login nunca renueva: con sesión vigente lleva a la home del rol; si la sesión está vencida
 *     o el login llegó con `reason`, borra las cookies y muestra el formulario.
 *  5. /api/auth/* (NextAuth) y las rutas públicas quedan fuera del matcher.
 */

const SECRET = process.env.AUTH_SECRET || process.env.JWT_SECRET;

// Se renueva un minuto antes de que venza
const REFRESH_MARGIN_MS = 60 * 1000;
const REFRESH_TIMEOUT_MS = 4000;

type RefreshResult =
  | { ok: true; token: JWT }
  | { ok: false; reason: "invalid" | "unavailable" };

async function refreshTokens(token: JWT): Promise<RefreshResult> {
  if (!token.refreshToken || !token.accessToken) return { ok: false, reason: "invalid" };

  try {
    const response = await fetch(`${process.env.API_HOST}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
    });

    // 400/401/404: el refresh token no sirve (vencido, revocado, usuario inexistente) -> hay que re-loguear
    if (response.status >= 400 && response.status < 500) return { ok: false, reason: "invalid" };
    if (!response.ok) return { ok: false, reason: "unavailable" };

    const data = await response.json();
    return {
      ok: true,
      token: {
        ...token,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpires: parseExpiration(data.expiration),
        error: undefined,
      },
    };
  } catch (error) {
    // Timeout o API caída
    console.warn("[proxy] No se pudo renovar el access token:", error instanceof Error ? error.message : error);
    return { ok: false, reason: "unavailable" };
  }
}

function isExpired(token: JWT, marginMs = 0) {
  return !token.accessTokenExpires || Date.now() >= token.accessTokenExpires - marginMs;
}

function secureCookies() {
  return process.env.NODE_ENV === "production";
}

/** Borra la cookie de sesión (y sus variantes troceadas `.0`, `.1`, … o `__Secure-`) que haya mandado el navegador. */
function clearSession(request: NextRequest, response: NextResponse) {
  const names = new Set([SESSION_COOKIE_NAME]);
  for (const { name } of request.cookies.getAll()) {
    if (name.startsWith(SESSION_COOKIE_NAME) || name.startsWith(`__Secure-${SESSION_COOKIE_NAME}`)) names.add(name);
  }
  for (const name of names) {
    response.cookies.set(name, "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: secureCookies() || name.startsWith("__Secure-"),
      maxAge: 0,
    });
  }
  return response;
}

function redirectToLogin(request: NextRequest, reason?: string, callbackPath?: string) {
  const url = new URL(LOGIN_PATH, request.url);
  if (callbackPath) url.searchParams.set("callbackUrl", callbackPath);
  if (reason) url.searchParams.set("reason", reason);
  return clearSession(request, NextResponse.redirect(url));
}

function setSessionCookie(response: NextResponse, encoded: string) {
  response.cookies.set(SESSION_COOKIE_NAME, encoded, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: secureCookies(),
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}

/** Reenvía la request con la cookie nueva (para que los Server Components vean el token renovado). */
function nextWithToken(request: NextRequest, encoded: string) {
  const cookies = request.cookies.getAll().filter((c) => c.name !== SESSION_COOKIE_NAME);
  const cookieHeader = [...cookies.map((c) => `${c.name}=${c.value}`), `${SESSION_COOKIE_NAME}=${encoded}`].join("; ");

  const headers = new Headers(request.headers);
  headers.set("cookie", cookieHeader);

  return setSessionCookie(NextResponse.next({ request: { headers } }), encoded);
}

function handleLogin(request: NextRequest, token: JWT | null) {
  const hasSessionCookie = request.cookies.getAll().some((c) => c.name.startsWith(SESSION_COOKIE_NAME));

  // Llegó redirigido por una sesión rechazada (p. ej. 401 de la API): se descarta lo que haya
  // en vez de rebotar a la home del rol con la misma cookie (evita el bucle login <-> panel).
  if (request.nextUrl.searchParams.has("reason")) {
    return hasSessionCookie ? clearSession(request, NextResponse.next()) : NextResponse.next();
  }

  if (token && isRole(token.role) && !token.error && !isExpired(token)) {
    const target = safeCallbackUrl(request.nextUrl.searchParams.get("callbackUrl"), token.role);
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Sin sesión, o vencida/corrupta: se muestra el login sin cookies viejas
  return hasSessionCookie ? clearSession(request, NextResponse.next()) : NextResponse.next();
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  let token = await getToken({ req: request, secret: SECRET, cookieName: SESSION_COOKIE_NAME });

  if (pathname === LOGIN_PATH) return handleLogin(request, token);

  // --- Rutas protegidas por rol ---
  const callbackPath = `${pathname}${search}`;
  if (!token || token.error || !isRole(token.role)) {
    return redirectToLogin(request, token ? "expired" : undefined, callbackPath);
  }

  const requiredRole = (Object.keys(ROLE_PREFIX) as (keyof typeof ROLE_PREFIX)[]).find(
    (role) => pathname === ROLE_PREFIX[role] || pathname.startsWith(`${ROLE_PREFIX[role]}/`)
  );

  if (requiredRole && token.role !== requiredRole) {
    return NextResponse.redirect(new URL(homeForRole(token.role), request.url));
  }

  if (!isExpired(token, REFRESH_MARGIN_MS)) return NextResponse.next();

  // --- Renovación ---
  const result = await refreshTokens(token);
  if (result.ok) {
    token = result.token;
    const encoded = await encode({ token, secret: SECRET!, maxAge: SESSION_MAX_AGE_SECONDS });
    return nextWithToken(request, encoded);
  }

  // API caída pero el access token todavía sirve (estamos dentro del margen): se sigue sin renovar
  if (result.reason === "unavailable" && !isExpired(token)) return NextResponse.next();

  // Sesión irrecuperable: se borran las cookies y se manda a /login una sola vez
  return redirectToLogin(request, result.reason === "invalid" ? "expired" : "unavailable", callbackPath);
}

export const config = {
  // Sin /api/auth ni rutas públicas: solo el login y los paneles por rol
  matcher: ["/login", "/admin/:path*", "/resident/:path*", "/security/:path*"],
};
