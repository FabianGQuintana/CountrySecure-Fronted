"use client";

import { DataTable, type Column, type TableFilter } from "@/components/ui/DataTable";
import type { EntryPermissionDto } from "@/types/models";

type DisplayStatus = "Pendiente" | "Adentro" | "Completado" | "Vencido" | "Cancelado";

const STATUS_STYLES: Record<DisplayStatus, string> = {
  Pendiente: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Adentro: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Completado: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Vencido: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  Cancelado: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

// Estado "de negocio" que ve el guardia, derivado del estado, las marcas de ingreso/egreso y la vigencia
function displayStatus(p: EntryPermissionDto): DisplayStatus {
  if (p.status === "Cancelled" || p.baseEntityStatus === "Inactive") return "Cancelado";
  if (p.entryTime && !p.departureTime) return "Adentro";
  if (p.entryTime && p.departureTime) return "Completado";
  if (p.status === "Expired" || (p.validTo && new Date(p.validTo) < new Date())) return "Vencido";
  return "Pendiente";
}

const formatDateTime = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false })
    : "—";

const STATUS_FILTERS: DisplayStatus[] = ["Pendiente", "Adentro", "Completado", "Vencido", "Cancelado"];

const FILTERS: TableFilter<EntryPermissionDto>[] = [
  { value: "all", label: "Todos", predicate: () => true },
  ...STATUS_FILTERS.map((status) => ({ value: status, label: status, predicate: (p: EntryPermissionDto) => displayStatus(p) === status })),
];

const columns: Column<EntryPermissionDto>[] = [
  {
    key: "visitor",
    header: "Visitante / Proveedor",
    sortValue: (p) => `${p.visitor.lastNameVisit} ${p.visitor.nameVisit}`,
    cell: (p) => (
      <>
        <p className="font-medium">
          {p.visitor.nameVisit} {p.visitor.lastNameVisit}
        </p>
        <p className="text-xs text-slate-400">{p.order?.supplierName ?? `DNI ${p.visitor.dniVisit}`}</p>
      </>
    ),
  },
  { key: "type", header: "Tipo", sortValue: (p) => p.type, cell: (p) => (p.type === "Maintenance" ? "Servicio" : "Visita") },
  { key: "resident", header: "Residente", sortValue: (p) => p.resident.lastname, cell: (p) => `${p.resident.name} ${p.resident.lastname}` },
  {
    key: "validity",
    header: "Vigencia",
    sortValue: (p) => new Date(p.validFrom).getTime(),
    cell: (p) => (
      <span className="text-xs text-slate-300">
        {formatDateTime(p.validFrom)}
        <br />
        hasta {formatDateTime(p.validTo)}
      </span>
    ),
  },
  { key: "entry", header: "Ingreso", sortValue: (p) => (p.entryTime ? new Date(p.entryTime).getTime() : 0), cell: (p) => formatDateTime(p.entryTime) },
  { key: "exit", header: "Salida", cell: (p) => formatDateTime(p.departureTime) },
  {
    key: "status",
    header: "Estado",
    sortValue: (p) => displayStatus(p),
    cell: (p) => {
      const status = displayStatus(p);
      return <span className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-medium ${STATUS_STYLES[status]}`}>{status}</span>;
    },
  },
];

export default function PermissionsTable({ permissions }: { permissions: EntryPermissionDto[] }) {
  return (
    <DataTable
      variant="dark"
      data={permissions}
      columns={columns}
      getRowId={(p) => p.id}
      itemLabel="permiso"
      pageSize={10}
      searchPlaceholder="Buscar por visitante, DNI, residente o proveedor..."
      getSearchText={(p) =>
        [p.visitor.nameVisit, p.visitor.lastNameVisit, p.visitor.dniVisit, p.resident.name, p.resident.lastname, p.order?.supplierName].filter(Boolean).join(" ")
      }
      filters={FILTERS}
      initialSort={{ key: "validity", direction: "desc" }}
      emptyMessage="No hay permisos que coincidan con los filtros."
    />
  );
}
