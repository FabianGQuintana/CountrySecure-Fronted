"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { DateInput, Field, Input, Select, primaryButtonClass, secondaryButtonClass } from "@/components/ui/form";
import { localDateOf } from "@/lib/datetime";
import { StatusBadge, type StatusTone } from "@/components/ui/StatusBadge";
import { permissionStatusToText } from "@/types/api";
import { Button } from "@/components/ui/button";
import { listPermissionHistory } from "@/features/entry-permissions/actions";

interface LogEntry {
  id: string;
  type: string;
  status: string;

  visitor?: {
    nameVisit: string;
    lastNameVisit: string;
    dniVisit: string;
  };

  order?: {
    supplierName: string;
    orderType: string;
  };

  resident?: {
    name: string;
    lastname: string;
  };

  entryTime?: string;
  departureTime?: string;
  checkInGuard?: {
    id: string;
    name: string;
    lastname: string;
  };
  checkOutGuard?: {
    id: string;
    name: string;
    lastname: string;
  };
}

const PAGE_SIZE = 10;

const LogView: React.FC = () => {
  const searchParams = useSearchParams();

  // 🔒 Params desde Services
  const forcedType = searchParams.get("type");
  const hideTypeFilter = searchParams.get("hideTypeFilter") === "true";

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔍 Filtros (NO SE TOCAN)
  // 📄 Paginación frontend REAL
  const [currentPage, setCurrentPage] = useState(1);

  const [startDate, setStartDateState] = useState("");
  const [endDate, setEndDateState] = useState("");
  const [searchTerm, setSearchTermState] = useState("");
  const [filterType, setFilterTypeState] = useState<string>(forcedType ?? "all");

  // Cambiar un filtro vuelve a la primera página
  const setStartDate = (v: string) => (setStartDateState(v), setCurrentPage(1));
  const setEndDate = (v: string) => (setEndDateState(v), setCurrentPage(1));
  const dateRangeError = startDate && endDate && endDate < startDate ? "Tiene que ser igual o posterior a la fecha desde." : undefined;
  const setSearchTerm = (v: string) => (setSearchTermState(v), setCurrentPage(1));
  const setFilterType = (v: string) => (setFilterTypeState(v), setCurrentPage(1));

  /* 🔄 Fetch único */
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);

    const result = await listPermissionHistory();

    if (result.ok) setLogs(result.data as unknown as LogEntry[]);
    else setError(result.error || "Error al cargar historial");

    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos
    fetchLogs();
  }, []);

  /* 🧠 FILTRADO FRONTEND (CLAVE) */
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // 🔒 FORCED TYPE SIEMPRE MANDA
      const matchesType = forcedType
        ? log.type === forcedType
        : filterType === "all" || log.type === filterType;

      const matchesSearch =
        !searchTerm ||
        log.visitor?.nameVisit
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        log.visitor?.lastNameVisit
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        log.order?.supplierName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Fecha LOCAL del ingreso (con toISOString un ingreso a las 22 h caía en el día siguiente)
      const entryDate = localDateOf(log.entryTime);

      const matchesStart = !startDate || (entryDate && entryDate >= startDate);

      const matchesEnd = !endDate || (entryDate && entryDate <= endDate);

      return matchesType && matchesSearch && matchesStart && matchesEnd;
    });
  }, [logs, searchTerm, filterType, startDate, endDate, forcedType]);

  /* 📄 PAGINACIÓN */
  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLogs.slice(start, start + PAGE_SIZE);
  }, [filteredLogs, currentPage]);

  const handleSearch = () => setCurrentPage(1);

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    if (!forcedType) setFilterType("all");
    setCurrentPage(1);
  };

  const formatDateTime = (date?: string) =>
    date ? new Date(date).toLocaleString("es-AR") : "-";

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      Visit: "bg-primary/20 text-primary",
      Maintenance: "bg-warning/20 text-warning",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-semibold ${
          styles[type] ?? "bg-muted-foreground/20 text-muted-foreground"
        }`}
      >
        {type}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const tones: Record<string, StatusTone> = { Pending: "warning", Completed: "success", Cancelled: "danger", Expired: "neutral" };
    return <StatusBadge tone={tones[status] ?? "neutral"}>{permissionStatusToText(status)}</StatusBadge>;
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {forcedType === "Maintenance"
                ? "Historial de Servicios"
                : "Registro de Entradas"}
            </h1>
            <p className="text-muted-foreground">Historial completo de movimientos</p>
          </div>
        </div>

        {/* FILTROS */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Field label="Buscar">
              {({ id }) => (
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden />
                  <Input id={id} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Nombre / Proveedor" className="pl-10" />
                </div>
              )}
            </Field>

            <Field label="Fecha desde">
              {({ id }) => <DateInput id={id} value={startDate} max={endDate || undefined} onChange={(e) => setStartDate(e.target.value)} />}
            </Field>

            <Field label="Fecha hasta" error={dateRangeError}>
              {({ id, describedBy, invalid }) => (
                <DateInput id={id} aria-describedby={describedBy} invalid={invalid} value={endDate} min={startDate || undefined} onChange={(e) => setEndDate(e.target.value)} />
              )}
            </Field>

            {!hideTypeFilter && (
              <Field label="Tipo">
                {({ id }) => (
                  <Select id={id} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">Todos</option>
                    <option value="Visit">Visitas</option>
                    <option value="Maintenance">Mantenimiento</option>
                  </Select>
                )}
              </Field>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={handleSearch} className={primaryButtonClass}>
              <Filter size={18} aria-hidden />
              Aplicar filtros
            </button>
            <button type="button" onClick={handleClearFilters} className={secondaryButtonClass}>
              Limpiar
            </button>
          </div>
        </div>

        {/* TABLA */}
        <div className="bg-card/50 rounded-xl border border-primary/20 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground">
              Cargando historial...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-danger">{error}</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No se encontraron registros
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      {[
                        "Tipo",
                        "Visitante / Servicio",
                        "Residente",
                        "Entrada",
                        "Salida",
                        "Estado",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {paginatedLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/30">
                        <td className="px-4 py-4">{getTypeBadge(log.type)}</td>

                        <td className="px-4 py-4 text-foreground">
                          {log.visitor
                            ? `${log.visitor.nameVisit} ${log.visitor.lastNameVisit}`
                            : log.order?.supplierName ?? "N/A"}
                        </td>

                        <td className="px-4 py-4 text-muted-foreground">
                          {log.resident
                            ? `${log.resident.name} ${log.resident.lastname}`
                            : "-"}
                        </td>

                        <td className="px-4 py-4 text-muted-foreground">
                          {formatDateTime(log.entryTime)}
                        </td>

                        <td className="px-4 py-4 text-muted-foreground">
                          {formatDateTime(log.departureTime)}
                        </td>

                        <td className="px-4 py-4">
                          {getStatusBadge(log.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINACIÓN */}
              <div className="px-6 py-4 flex justify-between items-center border-t border-border">
                <span className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </span>

                <div className="flex gap-2">
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <ChevronLeft size={18} />
                  </Button>

                  <Button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    <ChevronRight size={18} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogView;
