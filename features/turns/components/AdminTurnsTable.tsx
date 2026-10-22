"use client";

import { useCallback, useState } from "react";
import { FiRefreshCw, FiXCircle } from "react-icons/fi";
import { DataTable, type Column, type TableFilter } from "@/components/ui/DataTable";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import type { TurnDto } from "@/types/models";
import { cancelTurn, listAllTurns } from "../actions";

const STATUS_LABELS = { Pending: "Confirmada", Completed: "Completada", Cancelled: "Cancelada" } as const;
const STATUS_STYLES = {
  Pending: "bg-emerald-100 text-emerald-800",
  Completed: "bg-blue-100 text-blue-800",
  Cancelled: "bg-gray-100 text-gray-600",
} as const;

const FILTERS: TableFilter<TurnDto>[] = [
  { value: "all", label: "Todas", predicate: () => true },
  { value: "upcoming", label: "Próximas", predicate: (t) => t.turnStatus === "Pending" && new Date(t.endTime) >= new Date() },
  { value: "past", label: "Pasadas", predicate: (t) => t.turnStatus !== "Cancelled" && new Date(t.endTime) < new Date() },
  { value: "cancelled", label: "Canceladas", predicate: (t) => t.turnStatus === "Cancelled" },
];

const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });

export function AdminTurnsTable({ initialTurns }: { initialTurns: TurnDto[] }) {
  const [turns, setTurns] = useState(initialTurns);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [confirm, confirmDialog] = useConfirm();

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    const result = await listAllTurns();
    if (result.ok) {
      setTurns(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setIsRefreshing(false);
  }, []);

  const cancel = useCallback(
    async (turn: TurnDto) => {
      if (!(await confirm({ title: "¿Cancelar esta reserva?", message: `${turn.amenity?.name ?? "Amenity"} · ${turn.user?.fullName ?? ""}`, confirmLabel: "Cancelar reserva", danger: true }))) return;
      const result = await cancelTurn(turn.id);
      if (!result.ok) setError(result.error);
      await refresh();
    },
    [confirm, refresh]
  );

  const columns: Column<TurnDto>[] = [
    { key: "amenity", header: "Amenity", sortValue: (t) => t.amenity?.name ?? "", cell: (t) => <span className="font-semibold text-gray-900">{t.amenity?.name ?? "—"}</span> },
    { key: "user", header: "Residente", sortValue: (t) => t.user?.fullName ?? "", cell: (t) => <span className="text-gray-700">{t.user?.fullName ?? "—"}</span> },
    { key: "start", header: "Inicio", sortValue: (t) => new Date(t.startTime).getTime(), cell: (t) => dateTime(t.startTime) },
    { key: "end", header: "Fin", sortValue: (t) => new Date(t.endTime).getTime(), cell: (t) => dateTime(t.endTime) },
    {
      key: "status",
      header: "Estado",
      sortValue: (t) => t.turnStatus,
      cell: (t) => (
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[t.turnStatus]}`}>{STATUS_LABELS[t.turnStatus]}</span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      align: "right",
      cell: (t) =>
        t.turnStatus === "Pending" && new Date(t.endTime) >= new Date() ? (
          <button type="button" onClick={() => cancel(t)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-rose-50 text-rose-700 hover:bg-rose-100 transition">
            <FiXCircle /> Cancelar
          </button>
        ) : null,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50/80 via-white/90 to-pink-50/80 p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent mb-1">
            Reservas de amenities
          </h1>
          <p className="text-gray-500">Turnos reservados por los residentes</p>
        </div>
        <button type="button" onClick={refresh} disabled={isRefreshing} className="flex items-center px-4 py-2 bg-purple-100/80 text-purple-700 rounded-xl hover:bg-purple-200 transition disabled:opacity-50">
          <FiRefreshCw className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {confirmDialog}
      {error && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}

      <DataTable
        data={turns}
        columns={columns}
        getRowId={(t) => t.id}
        itemLabel="reserva"
        pageSize={10}
        searchPlaceholder="Buscar por amenity o residente..."
        getSearchText={(t) => `${t.amenity?.name ?? ""} ${t.user?.fullName ?? ""}`}
        filters={FILTERS}
        initialSort={{ key: "start", direction: "desc" }}
        emptyMessage="No hay reservas."
      />
    </div>
  );
}
