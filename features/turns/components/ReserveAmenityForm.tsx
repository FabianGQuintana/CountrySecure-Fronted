"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, Clock, Info, Users } from "lucide-react";
import { DateInput, Field, FormError, Select, Spinner, TimeInput, primaryButtonClass, secondaryButtonClass } from "@/components/ui/form";
import { addMinutes, minutesBetween, nowRounded, parseLocal, toLocalDateValue } from "@/lib/datetime";
import type { AmenityDto } from "@/types/models";
import { createTurn } from "../actions";

// Mismas reglas que CreateTurnValidator / TurnService del backend
const MAX_DURATION_MINUTES = 12 * 60;

interface FormState {
  amenityId: string;
  date: string;
  startTime: string;
  endTime: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = { amenityId: "", date: "", startTime: "", endTime: "" };

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.amenityId) errors.amenityId = "Elegí el amenity que querés reservar.";

  const today = toLocalDateValue(new Date());
  if (!form.date) errors.date = "Elegí la fecha.";
  else if (form.date < today) errors.date = "La fecha no puede ser anterior a hoy.";

  if (!form.startTime) errors.startTime = "Indicá la hora de inicio.";
  if (!form.endTime) errors.endTime = "Indicá la hora de fin.";

  const start = parseLocal(form.date, form.startTime);
  const end = parseLocal(form.date, form.endTime);
  if (start && !errors.date && start < nowRounded()) errors.startTime = "Ese horario ya pasó.";
  if (start && end) {
    const minutes = minutesBetween(start, end);
    if (minutes <= 0) errors.endTime = "Tiene que ser posterior a la hora de inicio.";
    else if (minutes > MAX_DURATION_MINUTES) errors.endTime = "La reserva no puede durar más de 12 horas.";
  }
  return errors;
}

function formatRange(start: Date, end: Date) {
  const day = start.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  const time = (d: Date) => d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  return `${day}, de ${time(start)} a ${time(end)}`;
}

/** Reserva de amenities: mismo patrón que el permiso de visita (valida antes de enviar, errores por campo, resultado claro). */
export function ReserveAmenityForm({ amenities }: { amenities: AmenityDto[] }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<{ amenity: string; when: string } | null>(null);

  const selected = useMemo(() => amenities.find((a) => a.id === form.amenityId), [amenities, form.amenityId]);
  const today = toLocalDateValue(new Date());
  // Si la fecha es hoy, la hora de inicio no puede ser anterior a ahora
  const minStart = form.date === today ? `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}` : undefined;

  const setField = (key: keyof FormState, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Al elegir la hora de inicio, se sugiere una hora de fin (1 h después) si todavía no hay
      if (key === "startTime" && value && !prev.endTime && prev.date) {
        const start = parseLocal(prev.date, value);
        if (start) {
          const end = addMinutes(start, 60);
          if (toLocalDateValue(end) === prev.date) next.endTime = end.toTimeString().slice(0, 5);
        }
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const start = parseLocal(form.date, form.startTime)!;
    const end = parseLocal(form.date, form.endTime)!;

    setSubmitting(true);
    setSubmitError(null);
    const result = await createTurn({ amenityId: form.amenityId, startTime: start.toISOString(), endTime: end.toISOString() });
    setSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    setConfirmed({ amenity: selected?.amenityName ?? "Amenity", when: formatRange(start, end) });
  };

  if (confirmed) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-12 animate-pop">
        <CheckCircle2 className="mx-auto mb-5 h-16 w-16 text-success" aria-hidden />
        <h2 className="text-2xl font-bold text-foreground">¡Reserva confirmada!</h2>
        <p className="mt-2 text-muted-foreground">
          <span className="font-semibold text-foreground">{confirmed.amenity}</span> · {confirmed.when}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/resident/reservations" className={primaryButtonClass}>
            <CalendarCheck size={18} aria-hidden /> Ver mis reservas
          </Link>
          <button
            type="button"
            className={secondaryButtonClass}
            onClick={() => {
              setConfirmed(null);
              setForm(EMPTY);
              setErrors({});
            }}
          >
            Hacer otra reserva
          </button>
        </div>
      </div>
    );
  }

  if (amenities.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
        No hay amenities disponibles para reservar en este momento.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <Field label="Amenity" required error={errors.amenityId}>
        {({ id, describedBy, invalid }) => (
          <Select id={id} aria-describedby={describedBy} invalid={invalid} value={form.amenityId} onChange={(e) => setField("amenityId", e.target.value)}>
            <option value="">Elegí un amenity…</option>
            {amenities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.amenityName}
              </option>
            ))}
          </Select>
        )}
      </Field>

      {selected && (
        <div className="grid gap-3 rounded-2xl bg-muted/60 p-4 text-sm sm:grid-cols-2">
          <p className="flex items-start gap-2 text-foreground">
            <Clock size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden />
            <span>
              <span className="block text-xs text-muted-foreground">Horarios</span>
              {selected.schedules}
            </span>
          </p>
          <p className="flex items-start gap-2 text-foreground">
            <Users size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden />
            <span>
              <span className="block text-xs text-muted-foreground">Capacidad</span>
              {selected.capacity === 1 ? "Uso exclusivo (1 reserva por horario)" : `${selected.capacity} reservas simultáneas`}
            </span>
          </p>
          {selected.description && <p className="text-muted-foreground sm:col-span-2">{selected.description}</p>}
        </div>
      )}

      <Field label="Fecha" required error={errors.date}>
        {({ id, describedBy, invalid }) => (
          <DateInput id={id} aria-describedby={describedBy} invalid={invalid} min={today} value={form.date} onChange={(e) => setField("date", e.target.value)} />
        )}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Desde" required error={errors.startTime}>
          {({ id, describedBy, invalid }) => (
            <TimeInput id={id} aria-describedby={describedBy} invalid={invalid} min={minStart} value={form.startTime} onChange={(e) => setField("startTime", e.target.value)} />
          )}
        </Field>
        <Field label="Hasta" required error={errors.endTime} hint="Máximo 12 horas.">
          {({ id, describedBy, invalid }) => (
            <TimeInput id={id} aria-describedby={describedBy} invalid={invalid} min={form.startTime || undefined} value={form.endTime} onChange={(e) => setField("endTime", e.target.value)} />
          )}
        </Field>
      </div>

      <FormError message={submitError} />

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info size={14} className="mt-px shrink-0" aria-hidden />
        Podés cancelar la reserva desde &quot;Mis reservas&quot;.
      </p>

      <button type="submit" disabled={submitting} className={`${primaryButtonClass} w-full`}>
        {submitting ? (
          <>
            <Spinner /> Reservando…
          </>
        ) : (
          "Confirmar reserva"
        )}
      </button>
    </form>
  );
}
