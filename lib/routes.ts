// Rutas y roles compartidos por el proxy, el login y los menús.
// Única fuente de verdad para "a dónde va cada rol" (rutas canónicas, sin barra final).

export type Role = "Admin" | "Resident" | "Security";

export const ROLE_HOME: Record<Role, string> = {
  Admin: "/admin",
  Resident: "/resident/dashboard",
  Security: "/security/visit",
};

// Prefijo de URL que le corresponde a cada rol
export const ROLE_PREFIX: Record<Role, string> = {
  Admin: "/admin",
  Resident: "/resident",
  Security: "/security",
};

export const LOGIN_PATH = "/login";

export function isRole(value: unknown): value is Role {
  return value === "Admin" || value === "Resident" || value === "Security";
}

export function homeForRole(role: unknown): string {
  return isRole(role) ? ROLE_HOME[role] : "/";
}

/**
 * Valida un `callbackUrl` recibido por query string: solo se acepta una ruta interna
 * que pertenezca a la sección del rol. Evita open-redirects y que un usuario sea enviado
 * a una sección que no le corresponde.
 */
export function safeCallbackUrl(callbackUrl: string | null | undefined, role: unknown): string {
  const fallback = homeForRole(role);
  if (!callbackUrl || !isRole(role)) return fallback;

  // Debe ser una ruta relativa del sitio (no "//host" ni "http://...")
  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) return fallback;

  const prefix = ROLE_PREFIX[role];
  const path = callbackUrl.split(/[?#]/)[0];
  return path === prefix || path.startsWith(`${prefix}/`) ? callbackUrl : fallback;
}
