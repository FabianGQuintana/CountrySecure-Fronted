import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ApiError } from "@/lib/api-error";
import type { PagedResult } from "@/types/models";

/**
 * Cliente HTTP único hacia la API .NET. SOLO se usa del lado del servidor
 * (Server Components, Server Actions): el access token nunca viaja al navegador.
 *
 *  - Resuelve la URL base (API_HOST) y el token de la sesión.
 *  - Normaliza los errores (ProblemDetails / errores de validación) en un `ApiError`.
 *  - Ante un 401 (sesión inválida) redirige al login en lugar de devolver datos rotos.
 */

const API_URL = (process.env.API_HOST ?? "").replace(/\/$/, "");
const TIMEOUT_MS = 15_000;

type QueryValue = string | number | boolean | null | undefined;
export type Query = Record<string, QueryValue>;

interface RequestOptions {
  query?: Query;
  body?: unknown;
}

function buildUrl(path: string, query?: Query) {
  const url = new URL(`${API_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function toApiError(response: Response): Promise<ApiError> {
  let payload: Record<string, unknown> | null = null;
  try {
    payload = await response.json();
  } catch {
    /* cuerpo vacío o no JSON */
  }

  // ProblemDetails (RFC 7807) con `message` de compatibilidad, o errores de validación { errors: { campo: [msg] } }
  const fieldErrors = (payload?.errors ?? undefined) as Record<string, string[]> | undefined;
  const firstFieldError = fieldErrors ? Object.values(fieldErrors).flat()[0] : undefined;
  const message =
    (typeof payload?.message === "string" && payload.message) ||
    (typeof payload?.detail === "string" && payload.detail) ||
    firstFieldError ||
    (typeof payload?.title === "string" && payload.title) ||
    `Error ${response.status}`;

  return new ApiError(message, response.status, fieldErrors);
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const user = await auth();
  if (!user?.accessToken) redirect("/login?reason=expired");

  let response: Response;
  try {
    response = await fetch(buildUrl(path, options.query), {
      method,
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    // Timeout o API caída
    throw new ApiError(
      error instanceof Error && error.name === "TimeoutError"
        ? "El servidor tardó demasiado en responder."
        : "No se pudo conectar con el servidor.",
      503
    );
  }

  if (response.status === 401) redirect("/login?reason=expired");
  if (!response.ok) throw await toApiError(response);
  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string, query?: Query) => request<T>("GET", path, { query }),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, { body }),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, { body }),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, { body }),
  delete: <T>(path: string) => request<T>("DELETE", path),
};

/**
 * Recorre todas las páginas de un listado (hasta `maxItems`) y devuelve los elementos.
 * Pensado para tablas de administración acotadas por el tamaño de la comunidad.
 */
export async function fetchAll<T>(path: string, query: Query = {}, maxItems = 2000): Promise<T[]> {
  const pageSize = 100;
  const items: T[] = [];

  for (let page = 1; items.length < maxItems; page++) {
    const result = await api.get<PagedResult<T>>(path, { ...query, page, pageSize });
    items.push(...result.items);
    if (!result.hasNextPage) break;
  }

  return items;
}
