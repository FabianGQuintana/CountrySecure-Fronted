"use client";
import { toast } from "sonner";
import { permissionStatusToText } from "@/types/api";
import type { EntryPermissionDto } from "@/types/models";

import { useEffect, useMemo, useState } from "react";
import { Eye, ChevronLeft, ChevronRight, Users, History } from "lucide-react";
import Link from "next/link";
import { listVisitPermissions } from "@/features/entry-permissions/actions";

/* 🔴 EXPIRADO */
const isExpired = (status: string, validTo?: string | null) => {
  if (status !== "Pending" || !validTo) return false;
  return new Date() > new Date(validTo);
};

export default function FamilyVisitsPageClient() {
  const [visits, setVisits] = useState<EntryPermissionDto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 📄 PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  /* 🔄 Fetch visitas familiares */
  useEffect(() => {
    const fetchVisits = async () => {
      const result = await listVisitPermissions();
      if (result.ok) setVisits(result.data);
      else toast.error(result.error);
      setLoading(false);
    };

    fetchVisits();
  }, []);

  /* 🔍 Filtro búsqueda */
  const filteredVisits = useMemo(() => {
    return visits.filter((v) => {
      const visitorName = `${v.visitor?.nameVisit ?? ""} ${
        v.visitor?.lastNameVisit ?? ""
      }`;
      const residentName = `${v.resident?.name ?? ""} ${
        v.resident?.lastname ?? ""
      }`;

      return (
        visitorName.toLowerCase().includes(search.toLowerCase()) ||
        residentName.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [visits, search]);

  /* 📄 Datos paginados */
  const totalPages = Math.ceil(filteredVisits.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedVisits = filteredVisits.slice(
    startIndex,
    startIndex + pageSize
  );

  if (loading) {
    return <p className="p-6 text-muted-foreground">Cargando visitas familiares...</p>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto text-foreground">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Users className="text-primary" />
            Visitas de Familiares
          </h1>
          <p className="text-muted-foreground text-lg">
            <span className="font-semibold text-primary">
              {filteredVisits.length}
            </span>{" "}
            visitas encontradas
          </p>
        </div>
        <Link
          href="/security/logs?type=Visit&hideTypeFilter=true"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold"
        >
          <History size={18} />
          Ver historial
        </Link>
      </div>

      {/* FILTRO */}
      <div className="bg-card/70 border border-border rounded-xl p-4 shadow mb-8">
        <input
          type="text"
          placeholder="Buscar por visitante o residente..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedVisits.map((v) => (
          <div
            key={v.id}
            className="rounded-2xl border border-primary/20 shadow-lg hover:shadow-primary/20 transition-all bg-background"
          >
            <div className="h-2 bg-primary" />

            <div className="p-5 flex flex-col h-full">
              {/* VISITANTE */}
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {v.visitor?.nameVisit} {v.visitor?.lastNameVisit}
                </h3>
                <p className="text-sm text-muted-foreground">Visitante</p>
              </div>

              {/* RESIDENTE */}
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">
                  Residente:{" "}
                  <b>
                    {v.resident?.name} {v.resident?.lastname}
                  </b>
                </p>
              </div>

              {/* FECHA */}
              <div className="mt-2 text-sm text-muted-foreground">
                Válido desde {new Date(v.validFrom).toLocaleDateString("es-AR")}
              </div>

              {(() => {
                const expired = isExpired(String(v.status), v.validTo);

                return (
                  <span
                    className={`self-start mt-3 px-3 py-1 text-xs font-bold rounded-lg border
                      ${
                        expired
                          ? "bg-danger/30 text-danger border-danger"
                          : String(v.status) === "Pending"
                          ? "bg-warning/20 text-warning border-warning/50"
                          : String(v.status) === "Completed"
                          ? "bg-success/20 text-success border-success/50"
                          : "bg-danger/20 text-danger border-danger/50"
                      }
                    `}
                  >
                    {expired ? "Vencido" : permissionStatusToText(v.status)}
                  </span>
                );
              })()}

              {/* DETALLE */}
              <Link
                href={`/security/family-visits/${v.id}`}
                className="mt-auto w-full flex justify-center items-center gap-2 px-4 py-2 bg-linear-to-r from-primary to-primary hover:from-primary hover:to-primary text-foreground rounded-lg font-semibold transition-all"
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
              {pageSize} visitas por página
            </div>
          </div>
        </div>
      )}

      {filteredVisits.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No se encontraron visitas familiares
        </div>
      )}
    </div>
  );
}
