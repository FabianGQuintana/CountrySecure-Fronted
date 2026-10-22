// Fechas y horas en hora LOCAL del navegador, con el formato que usan los inputs nativos.
// Regla del sistema: nunca usar toISOString() para obtener "la fecha de hoy" (devuelve la fecha UTC).

const pad = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" en hora local. */
export function toLocalDateValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "HH:mm" en hora local. */
export function toLocalTimeValue(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** "YYYY-MM-DDTHH:mm" (valor de un input datetime-local) en hora local. */
export function toLocalDateTimeValue(date: Date): string {
  return `${toLocalDateValue(date)}T${toLocalTimeValue(date)}`;
}

/** Fecha local ("YYYY-MM-DD") de un ISO del servidor, para filtrar por día sin corrimiento UTC. */
export function localDateOf(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : toLocalDateValue(d);
}

/** Interpreta "YYYY-MM-DD" + "HH:mm" (o un valor datetime-local) como hora local. `null` si es inválido. */
export function parseLocal(date: string, time?: string): Date | null {
  if (!date) return null;
  const value = time === undefined ? date : time ? `${date}T${time}` : "";
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Ahora, redondeado al minuto (para el `min` de los inputs). */
export function nowRounded(): Date {
  const d = new Date();
  d.setSeconds(0, 0);
  return d;
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

/** Minutos entre dos fechas (b - a). */
export function minutesBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 60_000);
}
