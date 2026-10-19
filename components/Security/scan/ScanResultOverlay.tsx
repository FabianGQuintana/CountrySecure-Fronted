"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { PASS_TYPE_LABELS, VEHICLE_TYPE_LABELS, VehicleType } from "@/types/api";
import type { PassDto } from "@/types/models";
import { resultTitle } from "./scanFeedback";

export type OverlayState =
  | { kind: "result"; success: boolean; outcome: "CheckIn" | "CheckOut" | "Rejected"; reason: Parameters<typeof resultTitle>[0]["reason"]; message: string; pass?: PassDto | null; offline?: boolean }
  | { kind: "error"; message: string };

// Un ingreso aprobado se cierra solo: el guardia sigue con la fila. Un rechazo exige confirmación explícita.
const AUTO_CLOSE_MS = 7000;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider opacity-75">{label}</dt>
      <dd className="text-xl font-semibold break-words">{value}</dd>
    </div>
  );
}

function PassSummary({ pass }: { pass: PassDto }) {
  const vehicle =
    pass.vehicleType === VehicleType.OnFoot
      ? VEHICLE_TYPE_LABELS.OnFoot
      : [VEHICLE_TYPE_LABELS[pass.vehicleType], pass.vehiclePlate, pass.vehicleModel].filter(Boolean).join(" · ");

  return (
    <dl className="grid w-full max-w-xl gap-4 rounded-2xl bg-black/20 p-6 text-left sm:grid-cols-2">
      <Field label="Visitante" value={pass.visitorName} />
      <Field label="Documento" value={String(pass.visitorDni)} />
      <Field label="Destino (lote / casa)" value={pass.destination} />
      <Field label="Anfitrión" value={pass.residentName} />
      <Field label="Personas autorizadas" value={String(1 + pass.companionsCount)} />
      <Field label="Vehículo / patente" value={vehicle} />
      <Field label="Tipo de pase" value={PASS_TYPE_LABELS[pass.passType]} />
    </dl>
  );
}

/** Pantalla completa: VERDE si el acceso fue aprobado, ROJA si fue rechazado, con el motivo explícito. */
export function ScanResultOverlay({ state, onClose }: { state: OverlayState; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const success = state.kind === "result" && state.success;

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => (e.key === "Escape" || e.key === "Enter") && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(onClose, AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [success, onClose]);

  const title = state.kind === "result" ? resultTitle(state) : "NO SE PUDO VALIDAR";
  const Icon = success ? CheckCircle2 : XCircle;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label={title}
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 overflow-y-auto p-6 text-center text-white ${
        success ? "bg-emerald-600" : "bg-red-600"
      }`}
    >
      <Icon size={112} strokeWidth={1.5} aria-hidden />
      <h2 className="text-4xl font-extrabold tracking-wide sm:text-5xl">{title}</h2>
      <p className="max-w-xl text-xl font-medium">{state.message}</p>

      {state.kind === "result" && state.pass && <PassSummary pass={state.pass} />}
      {state.kind === "result" && state.offline && (
        <p className="rounded-full bg-black/25 px-4 py-1 text-sm">Validado sin conexión: se sincroniza cuando vuelva la red.</p>
      )}

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="mt-2 rounded-2xl bg-white px-10 py-4 text-xl font-bold text-gray-900 shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white/60"
      >
        {success ? "Continuar" : "Entendido"}
      </button>
    </div>
  );
}
