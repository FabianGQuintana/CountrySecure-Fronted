import "server-only";
import { unstable_rethrow } from "next/navigation";
import { ApiError } from "@/lib/api-error";

export type Loaded<T> = { data: T; error?: undefined } | { data?: undefined; error: string };

/**
 * Carga datos en un Server Component sin romper la página ante un error de la API:
 * devuelve `{ data }` o `{ error }` para mostrar un `ErrorState`.
 * Los redirects de Next (p. ej. sesión vencida) se re-lanzan.
 */
export async function load<T>(fn: () => Promise<T>): Promise<Loaded<T>> {
  try {
    return { data: await fn() };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ApiError) return { error: error.message };
    console.error("[load] Error inesperado:", error);
    return { error: "Ocurrió un error inesperado." };
  }
}
