import type { ScanAction } from "@/types/api";
import type { ScanResultDto, SyncPassDto } from "@/types/models";

/**
 * Respaldo sin conexión de la guardia: una copia de los pases activos del día y una cola de escaneos
 * aprobados localmente que se envían al servidor cuando vuelve la red.
 *
 * El almacenamiento es localStorage (por navegador/dispositivo de la guardia). Todo acceso está protegido:
 * si el navegador lo bloquea, la pantalla sigue funcionando solo con conexión.
 */

const CACHE_KEY = "cs.scan.cache.v1";
const QUEUE_KEY = "cs.scan.queue.v1";

export interface PassCache {
  generatedAt: string;
  items: SyncPassDto[];
}

export interface QueuedScan {
  token: string;
  action: ScanAction;
  /** Momento real del escaneo en la guardia (ISO, UTC). */
  scannedAt: string;
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const loadCache = () => read<PassCache>(CACHE_KEY);
export const saveCache = (cache: PassCache) => write(CACHE_KEY, cache);
export const loadQueue = () => read<QueuedScan[]>(QUEUE_KEY) ?? [];
export const saveQueue = (queue: QueuedScan[]) => write(QUEUE_KEY, queue);

export interface OfflineOutcome {
  result: ScanResultDto;
  /** Pase actualizado en la caché (null si el escaneo fue rechazado: no cambia nada). */
  updated: SyncPassDto | null;
}

function reject(reason: ScanResultDto["reason"], message: string, at: Date, pass: SyncPassDto | null): OfflineOutcome {
  return { result: { success: false, outcome: "Rejected", reason, message, scannedAt: at.toISOString(), pass }, updated: null };
}

/**
 * Valida un QR contra la caché local con las mismas reglas que el servidor:
 * existencia, estado, ventana horaria y lista negra. El token tiene que coincidir con uno de la lista descargada
 * (la firma no se puede verificar acá porque la clave vive solo en el servidor).
 */
export function validateOffline(cache: PassCache, token: string, action: ScanAction, now: Date): OfflineOutcome {
  const pass = cache.items.find((p) => p.token === token);
  if (!pass) {
    return reject("NotFound", "Pase no encontrado en la lista del día (sin conexión). Si es válido, reintentá cuando vuelva la red.", now, null);
  }

  const t = now.getTime();
  const single = pass.passType === "SingleEntry";
  const inside = !!pass.entryTime && !pass.departureTime;

  if (action === "CheckOut") {
    if (!inside) return reject("NotInside", "El visitante no tiene un ingreso abierto: no registró entrada o ya salió.", now, pass);
    const updated = { ...pass, departureTime: now.toISOString() };
    return {
      result: { success: true, outcome: "CheckOut", reason: "None", message: "Salida registrada.", scannedAt: now.toISOString(), pass: updated },
      updated,
    };
  }

  if (single && pass.entryTime) return reject("AlreadyUsed", "Invitación ya utilizada.", now, pass);
  if (inside) return reject("AlreadyInside", "El visitante ya se encuentra dentro del barrio.", now, pass);

  if (t < new Date(pass.validFrom).getTime()) {
    return reject("NotYetValid", "Fuera de horario permitido: el pase todavía no está vigente.", now, pass);
  }
  if (pass.validTo && t > new Date(pass.validTo).getTime()) {
    return reject("Expired", "Fuera de horario permitido: el pase venció.", now, pass);
  }

  if (pass.blocked) return reject("Blocked", "Visitante o residente bloqueado. No se permite el ingreso.", now, pass);

  const updated = { ...pass, entryTime: now.toISOString(), departureTime: null, status: single ? ("Completed" as const) : pass.status };
  return {
    result: { success: true, outcome: "CheckIn", reason: "None", message: "Ingreso autorizado.", scannedAt: now.toISOString(), pass: updated },
    updated,
  };
}

/** Aplica un pase actualizado a la caché y la guarda. */
export function applyToCache(cache: PassCache, updated: SyncPassDto): PassCache {
  const next = { ...cache, items: cache.items.map((p) => (p.permissionId === updated.permissionId ? updated : p)) };
  saveCache(next);
  return next;
}
