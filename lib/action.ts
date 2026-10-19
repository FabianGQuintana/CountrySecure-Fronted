import "server-only";
import { unstable_rethrow } from "next/navigation";
import { ApiError, type ActionResult } from "@/lib/api-error";

/**
 * Envuelve el cuerpo de una Server Action: devuelve `{ ok, data }` o `{ ok: false, error }`.
 * Los redirects de Next (p. ej. sesión vencida) se re-lanzan para que sigan funcionando.
 */
export async function runAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    unstable_rethrow(error);

    if (error instanceof ApiError) {
      return { ok: false, error: error.message, status: error.status, fieldErrors: error.fieldErrors };
    }

    console.error("[action] Error inesperado:", error);
    return { ok: false, error: "Ocurrió un error inesperado. Intentá de nuevo." };
  }
}
