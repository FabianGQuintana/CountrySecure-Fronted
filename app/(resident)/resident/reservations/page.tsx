"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Home, Info } from "lucide-react";
import { Card, CardContent } from "@/components/UI/card";
import { Badge } from "@/components/UI/badge";
import { useCallback, useEffect, useState } from "react";
import { cancelTurn, getMyTurns, type TurnResponse } from "@/actions/turnosActions";

type ReservationStatus = "PENDING" | "COMPLETED" | "FINISHED" | "CANCELLED";

type Reservation = {
  id: string;
  amenityName: string;
  start: Date;
  end: Date;
  status: ReservationStatus;
};

// Traduce el turno de la API al modelo de la vista
function toReservation(turn: TurnResponse): Reservation {
  const start = new Date(turn.startTime);
  const end = new Date(turn.endTime);

  let status: ReservationStatus = "PENDING";
  if (turn.turnStatus === "Cancelled" || turn.status === "Inactive") status = "CANCELLED";
  else if (turn.turnStatus === "Completed") status = "COMPLETED";
  else if (end < new Date()) status = "FINISHED";

  return { id: turn.id, amenityName: turn.amenity?.name ?? "Amenity", start, end, status };
}

const formatTime = (d: Date) =>
  d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });

const statusConfig: Record<ReservationStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Confirmada",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  },
  COMPLETED: {
    label: "Completada",
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
  },
  FINISHED: {
    label: "Finalizada",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
  },
  CANCELLED: {
    label: "Cancelada",
    className:
      "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/30",
  },
};

export default function ResidentReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const turns = await getMyTurns();
      // Próximas primero, luego el historial
      const items = turns.map(toReservation).sort((a, b) => b.start.getTime() - a.start.getTime());
      setReservations(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = async (id: string) => {
    if (!confirm("¿Cancelar esta reserva?")) return;
    setCancellingId(id);
    try {
      await cancelTurn(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "No se pudo cancelar la reserva");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-purple-500/5">
      <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">
        {/* Header mejorado con gradiente sutil en morado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
              Gestión de Amenities
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-purple-600">
            Mis Reservas
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Acá podés ver y gestionar todas tus reservas de amenities del
            edificio
          </p>
        </motion.div>

        {loading && (
          <p className="text-muted-foreground animate-pulse">Cargando reservas...</p>
        )}

        {error && (
          <Card className="border border-red-200 bg-red-50">
            <CardContent className="p-6 text-red-600">{error}</CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!loading && !error && reservations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-dashed border-2 bg-muted/30 backdrop-blur-sm">
              <CardContent className="p-12 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center ring-8 ring-purple-500/5">
                  <Info className="w-8 h-8 text-purple-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">
                    No tenés reservas todavía
                  </p>
                  <p className="text-muted-foreground max-w-sm">
                    Cuando reserves un amenity, va a aparecer acá con todos los
                    detalles
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Grid de reservas mejorado */}
        {reservations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation, index) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <Card className="group relative overflow-hidden border-border hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 bg-card/50 backdrop-blur-sm">
                  {/* Efecto de brillo sutil */}
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500/0 via-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardContent className="relative p-6 space-y-5">
                    {/* Icono y título */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                          <Home className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold truncate">
                            {reservation.amenityName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Amenity
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          statusConfig[reservation.status].className
                        } text-xs font-medium px-2.5 py-1 shrink-0`}
                      >
                        {statusConfig[reservation.status].label}
                      </Badge>
                    </div>

                    {/* Divisor sutil */}
                    <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

                    {/* Detalles de fecha y hora */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm group/item">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover/item:bg-purple-500/10 transition-colors">
                          <Calendar className="w-4 h-4 text-muted-foreground group-hover/item:text-purple-500 transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Fecha</p>
                          <p className="font-medium">
                            {reservation.start.toLocaleDateString("es-AR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm group/item">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover/item:bg-purple-500/10 transition-colors">
                          <Clock className="w-4 h-4 text-muted-foreground group-hover/item:text-purple-500 transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Horario
                          </p>
                          <p className="font-medium">
                            {formatTime(reservation.start)} - {formatTime(reservation.end)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {reservation.status === "PENDING" && reservation.start > new Date() && (
                      <button
                        onClick={() => handleCancel(reservation.id)}
                        disabled={cancellingId === reservation.id}
                        className="w-full text-sm font-medium text-red-600 border border-red-200 rounded-lg py-2 hover:bg-red-50 transition disabled:opacity-50"
                      >
                        {cancellingId === reservation.id ? "Cancelando..." : "Cancelar reserva"}
                      </button>
                    )}

                    {/* Indicador de hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-purple-500 via-purple-600 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
