"use client";

import { toast } from "sonner";
import { permissionStatusToText } from "@/types/api";
import { useEffect, useMemo, useState } from "react";
import { Eye, History, ChevronLeft, ChevronRight } from "lucide-react";
import { EntryPermissionResponseDto } from "@/types/order";
import Link from "next/link";
import { orderTypeLabel } from "@/types/api";
import { listMaintenancePermissions } from "@/features/entry-permissions/actions";

/* 🔴 EXPIRADO */
const isExpired = (status: string, validTo?: string) => {
  if (status !== "Pending" || !validTo) return false;
  return new Date() > new Date(validTo);
};

export default function ServicesCardsPage() {
  const [services, setServices] = useState<EntryPermissionResponseDto[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] =
    useState<EntryPermissionResponseDto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // 🔢 PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  /* 🔄 Traer servicios */
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await listMaintenancePermissions();
        if (!result.ok) throw new Error(result.error);
        const data = result.data;
        setServices(data);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "No se pudieron cargar los servicios.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  /* 🧠 Tipos únicos */
  const serviceTypes = useMemo(() => {
    return Array.from(new Set(services.map((s) => String(s.order?.orderType))));
  }, [services]);

  /* 🔍 Filtros */
  const filteredServices = useMemo(() => {
    setCurrentPage(1);
    return services.filter((s) => {
      const matchesSearch =
        s.order?.description?.toLowerCase().includes(search.toLowerCase()) ||
        (s.order?.supplierName ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesType =
        typeFilter === "all" || String(s.order?.orderType) === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [services, search, typeFilter]);

  /* 📄 Datos paginados */
  const totalPages = Math.ceil(filteredServices.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedServices = filteredServices.slice(
    startIndex,
    startIndex + pageSize
  );

  if (loading) {
    return <p className="p-6 text-muted-foreground">Cargando servicios...</p>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto text-foreground">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Gestión de Servicios
          </h1>
          <p className="text-muted-foreground text-lg">
            <span className="font-semibold text-primary">
              {filteredServices.length}
            </span>{" "}
            servicios encontrados
          </p>
        </div>

        <Link
          href="/security/logs?type=Maintenance&hideTypeFilter=true"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold"
        >
          <History size={18} />
          Ver historial
        </Link>
      </div>

      {/* FILTROS */}
      <div className="bg-card/70 border border-border rounded-xl p-4 shadow mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por descripción o proveedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:flex-1 px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-64 px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Todos los tipos</option>
          {serviceTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedServices.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-primary/20 shadow-lg hover:shadow-primary/20 transition-all bg-background"
          >
            <div className="h-2 bg-primary" />

            <div className="p-5 flex flex-col h-full">
              {/* SERVICIO */}
              <div className="mb-2">
                <h3 className="text-lg font-bold text-foreground">
                  {s.order?.description}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tipo: <b>{s.order ? orderTypeLabel(s.order.orderType) : "Sin servicio asignado"}</b>
                </p>
              </div>

              {/* VISITANTE */}
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">Visitante</p>
                <p className="text-base font-semibold text-foreground">
                  {s.visitor.nameVisit} {s.visitor.lastNameVisit}
                </p>
              </div>

              {/* RESIDENTE */}
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  Solicitado por{" "}
                  <b>
                    {s.resident.name} {s.resident.lastname}
                  </b>
                </p>
              </div>

              {/* FECHA */}
              <div className="mt-2 text-sm text-muted-foreground">
                Válido desde {new Date(s.validFrom).toLocaleDateString("es-AR")}
              </div>

              {/* STATUS */}
              {(() => {
                const expired = isExpired(String(s.status), s.validTo ?? undefined);

                return (
                  <span
                    className={`self-start mt-3 px-3 py-1 text-xs font-bold rounded-lg border
                      ${
                        expired
                          ? "bg-danger/30 text-danger border-danger"
                          : String(s.status) === "Pending"
                          ? "bg-warning/20 text-warning border-warning/50"
                          : String(s.status) === "Completed"
                          ? "bg-success/20 text-success border-success/50"
                          : "bg-danger/20 text-danger border-danger/50"
                      }
                    `}
                  >
                    {expired ? "Vencido" : permissionStatusToText(s.status)}
                  </span>
                );
              })()}

              {/* BOTÓN */}
              <Link
                href={`/security/services/${s.id}/`}
                className="mt-auto w-full flex justify-center items-center gap-2 px-4 py-2 bg-linear-to-r from-primary to-primary hover:from-primary hover:to-primary text-foreground rounded-lg font-semibold transition-all shadow-lg"
              >
                <Eye className="w-4 h-4" />
                Ver detalle
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="mt-8 bg-card/70 border border-border rounded-xl p-5 shadow">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-muted-foreground text-sm">
              Página {currentPage} de {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-background border border-border text-foreground hover:bg-muted disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-background border border-border text-foreground hover:bg-muted disabled:opacity-50"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-muted-foreground text-sm">
              {pageSize} servicios por página
            </div>
          </div>
        </div>
      )}

      {/* EMPTY */}
      {filteredServices.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No se encontraron servicios
        </div>
      )}
    </div>
  );
}
