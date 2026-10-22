"use server";

// Recuperación de contraseña: no hay sesión, así que se llama a la API directamente (como en el login).

type Result = { ok: true; message: string } | { ok: false; error: string };

const API_URL = (process.env.API_HOST ?? "").replace(/\/$/, "");

async function post(path: string, body: unknown): Promise<Result> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    const payload = (await response.json().catch(() => null)) as
      | { message?: string; errors?: Record<string, string[]> }
      | null;

    if (response.ok) return { ok: true, message: payload?.message ?? "Listo." };

    const firstFieldError = payload?.errors ? Object.values(payload.errors).flat()[0] : undefined;
    return {
      ok: false,
      error:
        payload?.message ??
        firstFieldError ??
        (response.status === 429
          ? "Hiciste demasiados intentos. Esperá unos minutos y probá de nuevo."
          : "No pudimos procesar el pedido. Intentá de nuevo."),
    };
  } catch {
    return { ok: false, error: "No pudimos conectar con el servidor. Intentá de nuevo en unos minutos." };
  }
}

export async function requestPasswordReset(email: string) {
  return post("/api/auth/forgot-password", { email: email.trim() });
}

export async function resetPassword(token: string, newPassword: string) {
  return post("/api/auth/reset-password", { token, newPassword });
}
