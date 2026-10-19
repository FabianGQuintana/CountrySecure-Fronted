/**
 * Error normalizado de la API. Vive aparte de api-client.ts (que es server-only)
 * para poder usarse también en tipos y componentes de cliente.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Resultado serializable de una Server Action.
 * En producción Next oculta el mensaje de las excepciones lanzadas desde una Server Action,
 * por eso las acciones devuelven el error como dato en lugar de lanzarlo.
 */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number; fieldErrors?: Record<string, string[]> };
