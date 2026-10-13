"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

// La API serializa los enums como texto (JsonStringEnumConverter)
export type ApiPermission = {
  id: string;
  type: "Visit" | "Maintenance" | string;
  status: "Pending" | "Completed" | "Cancelled" | "Expired" | string;
  validFrom: string;
  validTo?: string | null;
  entryTime?: string | null;
  departureTime?: string | null;
  baseEntityStatus: string;
  resident?: { name: string; lastname: string } | null;
  visitor?: { nameVisit: string; lastNameVisit: string; dniVisit: number } | null;
  order?: { supplierName: string } | null;
};

type DisplayStatus = "Pendiente" | "Adentro" | "Completado" | "Vencido" | "Cancelado";

const STATUS_STYLES: Record<DisplayStatus, string> = {
  Pendiente: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Adentro: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Completado: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Vencido: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  Cancelado: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

const STATUS_OPTIONS: (DisplayStatus | "Todos")[] = ["Todos", "Pendiente", "Adentro", "Completado", "Vencido", "Cancelado"];

const PAGE_SIZE = 10;

function displayStatus(p: ApiPermission): DisplayStatus {
  if (p.status === "Cancelled" || p.baseEntityStatus === "Inactive") return "Cancelado";
  if (p.entryTime && !p.departureTime) return "Adentro";
  if (p.entryTime && p.departureTime) return "Completado";
  if (p.status === "Expired" || (p.validTo && new Date(p.validTo) < new Date())) return "Vencido";
  return "Pendiente";
}

const formatDateTime = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "—";

export default function PermissionsTable({ permissions }: { permissions: ApiPermission[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DisplayStatus | "Todos">("Todos");
  const [typeFilter, setTypeFilter] = useState<"Todos" | "Visit" | "Maintenance">("Todos");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return permissions
      .map((p) => ({ ...p, display: displayStatus(p) }))
      .filter((p) => statusFilter === "Todos" || p.display === statusFilter)
      .filter((p) => typeFilter === "Todos" || p.type === typeFilter)
      .filter((p) => {
        if (!term) return true;
        const haystack = [
          p.visitor?.nameVisit,
          p.visitor?.lastNameVisit,
          p.visitor?.dniVisit?.toString(),
          p.resident?.name,
          p.resident?.lastname,
          p.order?.supplierName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      })
      .sort((a, b) => new Date(b.validFrom).getTime() - new Date(a.validFrom).getTime());
  }, [permissions, search, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por visitante, DNI, residente o proveedor..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as DisplayStatus | "Todos");
            setPage(1);
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value as "Todos" | "Visit" | "Maintenance");
            setPage(1);
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
        >
          <option value="Todos">Todos los tipos</option>
          <option value="Visit">Visitas</option>
          <option value="Maintenance">Servicios</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-800/60">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Visitante / Proveedor</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Residente</th>
              <th className="px-4 py-3 text-left">Vigencia</th>
              <th className="px-4 py-3 text-left">Ingreso</th>
              <th className="px-4 py-3 text-left">Salida</th>
              <th className="px-4 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60 text-slate-200">
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  No hay permisos que coincidan con los filtros.
                </td>
              </tr>
            )}
            {pageRows.map((p) => (
              <tr key={p.id} className="hover:bg-slate-700/30 transition">
                <td className="px-4 py-3">
                  <p className="font-medium">
                    {p.visitor ? `${p.visitor.nameVisit} ${p.visitor.lastNameVisit}` : "—"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {p.order?.supplierName ?? (p.visitor ? `DNI ${p.visitor.dniVisit}` : "")}
                  </p>
                </td>
                <td className="px-4 py-3">{p.type === "Maintenance" ? "Servicio" : "Visita"}</td>
                <td className="px-4 py-3">
                  {p.resident ? `${p.resident.name} ${p.resident.lastname}` : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-slate-300">
                  {formatDateTime(p.validFrom)}
                  <br />
                  hasta {formatDateTime(p.validTo)}
                </td>
                <td className="px-4 py-3">{formatDateTime(p.entryTime)}</td>
                <td className="px-4 py-3">{formatDateTime(p.departureTime)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-medium ${STATUS_STYLES[p.display]}`}
                  >
                    {p.display}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>
          {rows.length} permiso{rows.length === 1 ? "" : "s"} · página {currentPage} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-700 hover:bg-slate-700 disabled:opacity-40"
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-slate-700 hover:bg-slate-700 disabled:opacity-40"
            aria-label="Página siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
