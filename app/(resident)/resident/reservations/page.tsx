"use client";

import { toast } from "sonner";
import Link from "next/link";
import { CalendarDays, Calendar, Clock, Plus, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatusBadge, type StatusTone } from "@/components/ui/StatusBadge";
import { primaryButtonClass } from "@/components/ui/form";
import { cancelTurn, listMyTurns } from "@/features/turns/actions";
import type { TurnDto } from "@/types/models";

type ReservationStatus = "UPCOMING" | "COMPLETED" | "FINISHED" | "CANCELLED";

type Reservation = {
  id: string;
  amenityName: string;
  start: Date;
  end: Date;
  status: ReservationStatus;
};

// Traduce el turno de la API al modelo de la vista
function toReservation(turn: TurnDto): Reservation {
  const start = new Date(turn.startTime);
  const end = new Date(turn.endTime);

  let status: ReservationStatus = "UPCOMING";
  if (turn.turnStatus === "Cancelled" || turn.status === "Inactive") status = "CANCELLED";
  else if (turn.turnStatus === "Completed") status = "COMPLETED";
  else if (end < new Date()) status = "FINISHED";

  return { id: turn.id, amenityName: turn.amenity?.name ?? "Amenity", start, end, status };
}

const formatTime = (d: Date) => d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
const formatDate = (d: Date) => d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

const STATUS: Record<ReservationStatus, { label: string; tone: StatusTone }> = {
  UPCOMING: { label: "Confirmada", tone: "success" },
  COMPLETED: { label: "Completada", tone: "info" },
  FINISHED: { label: "Finalizada", tone: "neutral" },
  CANCELLED: { label: "Cancelada", tone: "danger" },
};

export default function ResidentReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirm, confirmDialog] = useConfirm();

  const load = useCallback(async () => {
    const result = await listMyTurns();

    if (result.ok) {
      const all = result.data.map(toReservation);
      // Primero las próximas (la más cercana arriba), después el historial (la más reciente arriba)
      const upcoming = all.filter((r) => r.status === "UPCOMING").sort((a, b) => a.start.getTime() - b.start.getTime());
      const past = all.filter((r) => r.status !== "UPCOMING").sort((a, b) => b.start.getTime() - a.start.getTime());
      setReservations([...upcoming, ...past]);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos
    load();
  }, [load]);

  const handleCancel = async (r: Reservation) => {
    const ok = await confirm({
      title: "¿Cancelar la reserva?",
      message: `${r.amenityName} · ${formatDate(r.start)}, ${formatTime(r.start)} a ${formatTime(r.end)}`,
      confirmLabel: "Cancelar reserva",
      danger: true,
    });
    if (!ok) return;
    setCancellingId(r.id);
    const result = await cancelTurn(r.id);
    if (!result.ok) toast.error(result.error);
    else {
      toast.success("Reserva cancelada.");
      await load();
    }
    setCancellingId(null);
  };

  return (
    <PageContainer size="wide">
      {confirmDialog}
      <PageHeader
        icon={<CalendarDays size={24} aria-hidden />}
        title="Mis reservas"
        description="Tus reservas de amenities: las próximas primero y después el historial."
        actions={
          <Link href="/resident/amenities" className={primaryButtonClass}>
            <Plus size={18} aria-hidden /> Nueva reserva
          </Link>
        }
      />

      {loading && <p className="animate-pulse text-muted-foreground">Cargando reservas…</p>}
      {error && <ErrorState title="No se pudieron cargar tus reservas" message={error} />}

      {!loading && !error && reservations.length === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card">
          <EmptyState message="Todavía no tenés reservas. Cuando reserves un amenity va a aparecer acá." />
        </div>
      )}

      {reservations.length > 0 && (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reservations.map((r) => {
            const status = STATUS[r.status];
            const canCancel = r.status === "UPCOMING" && r.start > new Date();
            return (
              <li
                key={r.id}
                className={`flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40 animate-fade-in ${r.status === "CANCELLED" ? "opacity-70" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Star size={20} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="break-words font-semibold leading-tight text-foreground">{r.amenityName}</p>
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                  </div>
                </div>

                <dl className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="shrink-0 text-muted-foreground" aria-hidden />
                    <dt className="sr-only">Fecha</dt>
                    <dd className="font-medium text-foreground first-letter:uppercase">{formatDate(r.start)}</dd>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="shrink-0 text-muted-foreground" aria-hidden />
                    <dt className="sr-only">Horario</dt>
                    <dd className="font-medium text-foreground">
                      {formatTime(r.start)} a {formatTime(r.end)}
                    </dd>
                  </div>
                </dl>

                {canCancel && (
                  <button
                    type="button"
                    onClick={() => handleCancel(r)}
                    disabled={cancellingId === r.id}
                    className="mt-auto w-full rounded-xl border border-danger/30 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-soft disabled:opacity-50"
                  >
                    {cancellingId === r.id ? "Cancelando…" : "Cancelar reserva"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </PageContainer>
  );
}
