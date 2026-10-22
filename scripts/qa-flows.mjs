// QA end-to-end de los flujos de negocio de los tres roles, contra la API real.
//
// Uso (con la API levantada):
//   SMOKE_PASSWORD_ADMIN=... SMOKE_PASSWORD_RESIDENT=... SMOKE_PASSWORD_SECURITY=... node scripts/qa-flows.mjs
//
// Crea datos con el prefijo "QA" y los da de baja al terminar (baja lógica).
// Variables opcionales: API_URL (def. API_HOST de .env), SMOKE_EMAIL_<ROL>.
import { readFileSync } from "node:fs";

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
const API = (env.API_URL || env.API_HOST || "http://localhost:5021").replace(/\/$/, "");
const ACCOUNTS = {
  Admin: { email: env.SMOKE_EMAIL_ADMIN || "admin@countrysecure.local", password: env.SMOKE_PASSWORD_ADMIN },
  Resident: { email: env.SMOKE_EMAIL_RESIDENT || "residente@countrysecure.local", password: env.SMOKE_PASSWORD_RESIDENT },
  Security: { email: env.SMOKE_EMAIL_SECURITY || "seguridad@countrysecure.local", password: env.SMOKE_PASSWORD_SECURITY },
};

// ---- Utilidades ----
const results = [];
let section = "";
const check = (ok, label, extra = "") => {
  results.push({ section, ok, label, extra });
  console.log(`${ok ? "  ✓" : "  ✗"} ${label}${extra ? `  (${extra})` : ""}`);
};
const title = (t) => {
  section = t;
  console.log(`\n${t}`);
};
const cleanup = [];
const tag = `QA${Date.now().toString(36).slice(-5).toUpperCase()}`;
const uniqueDni = () => 40_000_000 + Math.floor(Math.random() * 9_000_000);
const hoursFromNow = (h) => new Date(Date.now() + h * 3600_000);

async function call(token, method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body !== undefined ? { "Content-Type": "application/json" } : {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15000),
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: res.status, ok: res.ok, data, message: data?.message ?? data?.detail ?? data?.title ?? "" };
}

async function login(role) {
  const r = await call(null, "POST", "/api/auth/login", ACCOUNTS[role]);
  if (!r.ok) throw new Error(`Login ${role}: ${r.status}`);
  return r.data;
}

const items = (data) => (Array.isArray(data) ? data : data?.items ?? []);

// ---- Flujos ----
async function admin(t) {
  title("ADMIN");
  const stats = await call(t, "GET", "/api/stats/admin");
  check(stats.ok, "métricas del panel", String(stats.status));

  // Usuarios
  const dni = uniqueDni();
  const email = `${tag.toLowerCase()}@qa.local`;
  const created = await call(t, "POST", "/api/auth/register", {
    name: "Qa", lastname: tag, dni, phone: "3794111111", email, password: "QaTest123", role: "Resident",
  });
  check(created.status === 201, "alta de residente", `${created.status} ${created.message}`);
  const userId = created.data?.userId;
  const dupe = await call(t, "POST", "/api/auth/register", {
    name: "Qa", lastname: tag, dni, phone: "3794111111", email, password: "QaTest123", role: "Resident",
  });
  check(dupe.status === 400, "rechaza email/DNI duplicado", `${dupe.status} ${dupe.message}`);
  if (userId) {
    const upd = await call(t, "PUT", `/api/users/${userId}`, { phone: "3794222222" });
    check(upd.ok && upd.data?.phone === "3794222222", "edición de usuario", String(upd.status));
    const del = await call(t, "DELETE", `/api/users/${userId}`);
    check(del.ok, "desactivar usuario", String(del.status));
    const loginInactive = await call(null, "POST", "/api/auth/login", { email, password: "QaTest123" });
    check(loginInactive.status === 401, "un usuario desactivado no puede loguearse", String(loginInactive.status));
    const res = await call(t, "POST", `/api/users/${userId}/restore`);
    check(res.ok, "reactivar usuario", String(res.status));
    cleanup.push(() => call(t, "DELETE", `/api/users/${userId}`));
  }

  // Lotes y propiedades
  const lot = await call(t, "POST", "/api/lots", { lotName: `Lote ${tag}`, blockName: "QA", lotState: "Available" });
  check(lot.status === 201 || lot.ok, "alta de lote", `${lot.status} ${lot.message}`);
  const lotId = lot.data?.id ?? lot.data?.lotId;
  if (lotId) {
    const prop = await call(t, "POST", "/api/properties", { street: `Calle ${tag}`, propertyNumber: 7, lotId });
    check(prop.ok, "alta de propiedad", `${prop.status} ${prop.message}`);
    const propId = prop.data?.id ?? prop.data?.propertyId;
    if (propId) {
      const assign = await call(t, "PUT", `/api/properties/${propId}`, { userId: userId ?? undefined, propertyStatus: "Occupied" });
      check(assign.ok, "asignar propiedad a residente", `${assign.status} ${assign.message}`);
      cleanup.push(() => call(t, "DELETE", `/api/properties/${propId}`));
    }
    cleanup.push(() => call(t, "DELETE", `/api/lots/${lotId}`));
  }

  // Amenities
  const amenity = await call(t, "POST", "/api/amenities", {
    amenityName: `Quincho ${tag}`, description: "Amenity de QA", schedules: "Lun a Dom 9 a 22", capacity: 1,
  });
  check(amenity.ok, "alta de amenity", `${amenity.status} ${amenity.message}`);
  const amenityId = amenity.data?.id;
  if (amenityId) {
    const upd = await call(t, "PUT", `/api/amenities/${amenityId}`, { capacity: 1, description: "Amenity de QA editado" });
    check(upd.ok, "edición de amenity", `${upd.status} ${upd.message}`);
    cleanup.push(() => call(t, "DELETE", `/api/amenities/${amenityId}`));
  }

  // Servicios
  const order = await call(t, "POST", "/api/orders", { supplierName: `Proveedor ${tag}`, description: "Servicio de QA", orderType: "Gardening" });
  check(order.ok, "alta de servicio", `${order.status} ${order.message}`);
  const orderId = order.data?.id;
  if (orderId) cleanup.push(() => call(t, "DELETE", `/api/orders/${orderId}`));

  // Reservas y solicitudes (lectura)
  const turns = await call(t, "GET", "/api/turns?pageSize=5");
  check(turns.ok, "listado de reservas de todos los residentes", String(turns.status));
  const requests = await call(t, "GET", "/api/requests?pageSize=5");
  check(requests.ok, "listado de solicitudes de residentes (API)", String(requests.status));

  return { amenityId, orderId };
}

async function resident(t, me, { amenityId, orderId }) {
  let requestId = null;
  title("RESIDENTE");
  const profile = await call(t, "GET", "/api/users/me");
  check(profile.ok, "ver mi perfil", String(profile.status));
  const props = await call(t, "GET", "/api/properties/me");
  check(props.ok && items(props.data).length > 0, "tiene propiedad asignada", `${props.status}, ${items(props.data).length}`);
  const phone = profile.data?.phone;
  const editMe = await call(t, "PUT", "/api/users/me", { phone: "3794000002" });
  check(editMe.ok, "editar mi perfil", `${editMe.status} ${editMe.message}`);
  if (phone) await call(t, "PUT", "/api/users/me", { phone });
  const badPwd = await call(t, "POST", "/api/auth/change-password", { currentPassword: "incorrecta", newPassword: "OtraClave123" });
  check(badPwd.status === 400, "cambio de contraseña rechaza la actual incorrecta", `${badPwd.status} ${badPwd.message}`);

  // Reservas de amenities
  if (amenityId) {
    const day = hoursFromNow(48);
    day.setMinutes(0, 0, 0);
    const start = new Date(day);
    const end = new Date(day.getTime() + 3600_000);
    const turn = await call(t, "POST", "/api/turns", { amenityId, startTime: start.toISOString(), endTime: end.toISOString() });
    check(turn.ok, "reservar amenity", `${turn.status} ${turn.message}`);
    const overlap = await call(t, "POST", "/api/turns", {
      amenityId, startTime: new Date(start.getTime() + 1800_000).toISOString(), endTime: new Date(end.getTime() + 1800_000).toISOString(),
    });
    check(overlap.status === 409, "rechaza reserva superpuesta", `${overlap.status} ${overlap.message}`);
    const past = await call(t, "POST", "/api/turns", { amenityId, startTime: hoursFromNow(-3).toISOString(), endTime: hoursFromNow(-2).toISOString() });
    check(past.status === 422 || past.status === 400, "rechaza reserva en el pasado", `${past.status} ${past.message}`);
    const inverted = await call(t, "POST", "/api/turns", { amenityId, startTime: end.toISOString(), endTime: start.toISOString() });
    check(inverted.status === 422 || inverted.status === 400, "rechaza fin anterior al inicio", `${inverted.status} ${inverted.message}`);
    const mine = await call(t, "GET", "/api/turns/me?pageSize=50");
    check(mine.ok && items(mine.data).some((x) => x.id === turn.data?.id), "la reserva aparece en Mis reservas", String(mine.status));
    if (turn.data?.id) {
      const cancel = await call(t, "DELETE", `/api/turns/${turn.data.id}`);
      check(cancel.ok, "cancelar reserva", `${cancel.status} ${cancel.message}`);
    }
  }

  // Solicitudes de servicio
  if (orderId) {
    const req = await call(t, "POST", "/api/requests", { orderId, details: `Pedido ${tag}`, location: "Patio" });
    check(req.ok, "crear solicitud de servicio", `${req.status} ${req.message}`);
    const mine = await call(t, "GET", "/api/requests/me?pageSize=50");
    check(mine.ok && items(mine.data).some((x) => x.id === req.data?.id), "la solicitud aparece en Mis solicitudes", String(mine.status));
    if (req.data?.id) {
      const cancel = await call(t, "DELETE", `/api/requests/${req.data.id}`);
      check(cancel.ok, "cancelar solicitud", `${cancel.status} ${cancel.message}`);
    }
    // Una segunda solicitud queda pendiente para que la resuelva la administración
    const pending = await call(t, "POST", "/api/requests", { orderId, details: `Pedido a resolver ${tag}`, location: "Frente" });
    const selfResolve = await call(t, "PUT", `/api/requests/${pending.data?.id}`, { status: "Completed" });
    check(selfResolve.status === 403, "el residente no puede marcar su solicitud como resuelta", `${selfResolve.status} ${selfResolve.message}`);
    requestId = pending.data?.id ?? null;
  }

  // Permiso de visita (flujo de referencia)
  const dni = uniqueDni();
  const visit = await call(t, "POST", "/api/visits", { nameVisit: "Visita", lastNameVisit: tag, dniVisit: dni });
  check(visit.ok, "registrar visitante", `${visit.status} ${visit.message}`);
  let permissionId = null;
  let passToken = null;
  if (visit.data?.visitId) {
    const perm = await call(t, "POST", "/api/entry-permissions", {
      permissionType: "Visit", description: "QA", validFrom: hoursFromNow(-0.1).toISOString(), validTo: hoursFromNow(4).toISOString(),
      visitId: visit.data.visitId, userId: me.userId, companionsCount: 1, vehicleType: "Car", vehiclePlate: "AB123CD", passType: "MultipleEntries",
    });
    check(perm.ok, "crear permiso de ingreso", `${perm.status} ${perm.message}`);
    permissionId = perm.data?.id;
    if (permissionId) {
      const pass = await call(t, "GET", `/api/entry-permissions/${permissionId}/pass`);
      check(pass.ok && !!pass.data?.token, "obtener pase con QR", String(pass.status));
      passToken = pass.data?.token;
      const pub = await call(null, "GET", `/api/passes/${encodeURIComponent(passToken)}`);
      check(pub.ok, "enlace público del pase", String(pub.status));
      const pdf = await fetch(`${API}/api/passes/${encodeURIComponent(passToken)}/pdf`);
      check(pdf.ok && (pdf.headers.get("content-type") ?? "").includes("pdf"), "PDF del pase", String(pdf.status));
    }
  }
  const mine = await call(t, "GET", "/api/entry-permissions/me?pageSize=50");
  check(mine.ok, "Mis pases", String(mine.status));
  const notif = await call(t, "GET", "/api/notifications/unread-count");
  check(notif.ok, "contador de avisos", String(notif.status));
  return { permissionId, passToken, requestId };
}

async function security(t, { permissionId, passToken }) {
  title("SEGURIDAD");
  const stats = await call(t, "GET", "/api/stats/security");
  check(stats.ok, "métricas", String(stats.status));
  const today = await call(t, "GET", "/api/entry-permissions/today?pageSize=50");
  check(today.ok && items(today.data).some((p) => p.id === permissionId), "el permiso nuevo aparece en Visitas de hoy", String(today.status));
  const sync = await call(t, "GET", "/api/entry-permissions/sync");
  check(sync.ok && Array.isArray(sync.data?.items), "lista de sincronización offline", String(sync.status));

  if (passToken) {
    const inn = await call(t, "POST", "/api/entry-permissions/scan", { token: passToken, action: "CheckIn" });
    check(inn.ok && inn.data?.success && inn.data?.outcome === "CheckIn", "escaneo: ingreso autorizado", `${inn.status} ${inn.data?.message}`);
    const again = await call(t, "POST", "/api/entry-permissions/scan", { token: passToken, action: "CheckIn" });
    check(again.ok && !again.data?.success && again.data?.reason === "AlreadyInside", "escaneo: rechaza doble ingreso", `${again.data?.reason}`);
    const out = await call(t, "POST", "/api/entry-permissions/scan", { token: passToken, action: "CheckOut" });
    check(out.ok && out.data?.success && out.data?.outcome === "CheckOut", "escaneo: salida registrada", `${out.status} ${out.data?.message}`);
    const bad = await call(t, "POST", "/api/entry-permissions/scan", { token: "token-falso", action: "CheckIn" });
    check(bad.ok && !bad.data?.success, "escaneo: QR inválido rechazado", `${bad.data?.reason}`);
  }
  const history = await call(t, "GET", "/api/entry-permissions/history?pageSize=10");
  check(history.ok, "historial de permisos", String(history.status));
  const logs = await call(t, "GET", "/api/access-logs?pageSize=10");
  check(logs.ok && items(logs.data).length > 0, "registro de accesos (auditoría)", String(logs.status));
  const visits = await call(t, "GET", "/api/visits?pageSize=5");
  check(visits.ok, "listado de visitantes", String(visits.status));
  const orders = await call(t, "GET", "/api/orders?pageSize=5");
  check(orders.ok, "listado de servicios", String(orders.status));

  // Lo que Seguridad NO debe poder hacer
  const forbidden = await call(t, "POST", "/api/amenities", { amenityName: "x", description: "x", schedules: "x", capacity: 1 });
  check(forbidden.status === 403, "no puede crear amenities", String(forbidden.status));
}

async function adminResolves(adminToken, residentToken, requestId) {
  title("ADMIN · SOLICITUDES");
  if (!requestId) return check(false, "hay una solicitud pendiente para resolver");
  const inbox = await call(adminToken, "GET", "/api/requests?pageSize=100&status=Pending");
  check(inbox.ok && items(inbox.data).some((x) => x.id === requestId), "la solicitud del residente aparece en la bandeja del Admin", String(inbox.status));
  const resolved = await call(adminToken, "PUT", `/api/requests/${requestId}`, { status: "Completed" });
  check(resolved.ok && resolved.data?.status === "Completed", "el Admin marca la solicitud como resuelta", `${resolved.status} ${resolved.message}`);
  const again = await call(adminToken, "PUT", `/api/requests/${requestId}`, { status: "Cancelled" });
  check(again.status === 422, "una solicitud resuelta no se puede volver a cambiar", `${again.status} ${again.message}`);
  const mine = await call(residentToken, "GET", "/api/requests/me?pageSize=100");
  check(items(mine.data).find((x) => x.id === requestId)?.status === "Completed", "el residente ve su solicitud resuelta", String(mine.status));
}

async function main() {
  for (const [role, acc] of Object.entries(ACCOUNTS)) if (!acc.password) throw new Error(`Falta SMOKE_PASSWORD_${role.toUpperCase()}`);
  console.log(`API: ${API}  ·  prefijo de datos: ${tag}`);
  const [a, r, s] = [await login("Admin"), await login("Resident"), await login("Security")];
  try {
    const created = await admin(a.accessToken);
    const pass = await resident(r.accessToken, r, created);
    await security(s.accessToken, pass);
    await adminResolves(a.accessToken, r.accessToken, pass.requestId);
    if (pass.permissionId) cleanup.push(() => call(r.accessToken, "DELETE", `/api/entry-permissions/${pass.permissionId}`));
  } finally {
    for (const fn of cleanup.reverse()) await fn().catch(() => {});
  }
  const failed = results.filter((x) => !x.ok);
  console.log(failed.length ? `\n✗ ${failed.length} de ${results.length} verificaciones fallaron` : `\n✓ ${results.length} verificaciones OK`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error("Error en la prueba:", e);
  process.exit(2);
});
