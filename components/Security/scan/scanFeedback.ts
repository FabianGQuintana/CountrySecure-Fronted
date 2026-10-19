import type { ScanReason } from "@/types/api";
import type { ScanResultDto } from "@/types/models";

/** Título grande de la pantalla de resultado (en mayúsculas, legible a distancia). */
export function resultTitle(result: Pick<ScanResultDto, "success" | "outcome" | "reason">): string {
  if (result.success) return result.outcome === "CheckOut" ? "SALIDA REGISTRADA" : "INGRESO AUTORIZADO";

  const titles: Partial<Record<ScanReason, string>> = {
    InvalidToken: "QR NO VÁLIDO",
    NotFound: "PASE INEXISTENTE",
    Cancelled: "PASE CANCELADO",
    AlreadyUsed: "PASE YA UTILIZADO",
    AlreadyInside: "YA ESTÁ ADENTRO",
    NotInside: "SIN INGRESO REGISTRADO",
    NotYetValid: "FUERA DE HORARIO",
    Expired: "FUERA DE HORARIO",
    Blocked: "ACCESO BLOQUEADO",
  };
  return titles[result.reason] ?? "ACCESO DENEGADO";
}

/**
 * Sonidos de confirmación y de alerta generados con Web Audio (no hace falta ningún archivo de audio).
 * El navegador solo permite audio después de un gesto del usuario: `unlock()` se llama al iniciar el escáner.
 */
export function createFeedbackPlayer() {
  let context: AudioContext | null = null;

  const unlock = () => {
    try {
      context ??= new AudioContext();
      if (context.state === "suspended") void context.resume();
    } catch {
      context = null; // sin audio disponible: el aviso visual alcanza
    }
  };

  const beep = (frequency: number, startAt: number, duration: number, type: OscillatorType, volume = 0.25) => {
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, context.currentTime + startAt);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + startAt + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(context.currentTime + startAt);
    oscillator.stop(context.currentTime + startAt + duration + 0.02);
  };

  return {
    unlock,
    /** Check de éxito: dos tonos agudos ascendentes. */
    success() {
      beep(880, 0, 0.12, "sine");
      beep(1320, 0.14, 0.2, "sine");
      navigator.vibrate?.(80);
    },
    /** Alerta: dos tonos graves y ásperos. */
    error() {
      beep(220, 0, 0.28, "square", 0.2);
      beep(175, 0.32, 0.4, "square", 0.2);
      navigator.vibrate?.([200, 100, 200]);
    },
  };
}
