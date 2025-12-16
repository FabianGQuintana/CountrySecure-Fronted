"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Clock, CheckCircle, AlertTriangle } from "lucide-react";
import VisitCard from "@/components/Security/VisitCard";

// ===============================================
// Props
// ===============================================
interface VisitsPageClientProps {
  initialToken: string | null;
  initialApiHost: string | null;
}

// ===============================================
// KPI Card
// ===============================================
interface KpiCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  colorClass,
}) => (
  <div
    className={`p-6 rounded-xl shadow-lg ${colorClass} transition-all hover:shadow-2xl hover:scale-105 duration-300`}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-4xl font-bold text-white mt-2">{value}</p>
      </div>
      <Icon className="h-12 w-12 text-white/80" />
    </div>
  </div>
);

// ===============================================
// Paginador
// ===============================================
interface PaginatorUIProps {
  paginaActual: number;
  totalPaginas: number;
  cambiarPagina: (page: number) => void;
  pageSize: number;
}

const PaginatorUI: React.FC<PaginatorUIProps> = ({
  paginaActual,
  totalPaginas,
  cambiarPagina,
  pageSize,
}) => {
  if (totalPaginas <= 1) return null;

  return (
    <div className="mt-6 rounded-xl border border-purple-500/30 bg-slate-900/60 backdrop-blur px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <span className="text-sm text-gray-300">
        Página <span className="font-semibold text-white">{paginaActual}</span>{" "}
        de <span className="font-semibold text-white">{totalPaginas}</span>
      </span>

      <div className="flex items-center gap-3">
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-purple-500/30
                     text-gray-300 hover:bg-purple-600/20 hover:text-white
                     disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Anterior
        </button>

        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-purple-500/30
                     text-gray-300 hover:bg-purple-600/20 hover:text-white
                     disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Siguiente →
        </button>
      </div>

      <span className="text-sm text-gray-400">
        {pageSize} visitas por página
      </span>
    </div>
  );
};

// ===============================================
// Main Component
// ===============================================
export default function VisitsPageClient({
  initialToken,
  initialApiHost,
}: VisitsPageClientProps) {
  const [visitPermissions, setVisitPermissions] = useState<any[]>([]);
  const [totalPermissions, setTotalPermissions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);

  const uiPageSize = 6;
  const accessToken = initialToken;
  const apiHost = initialApiHost;

  const fetchCurrentPagePermissions = useCallback(
    async (targetPage: number) => {
      if (!accessToken || !apiHost) return;

      setIsLoading(true);

      try {
        const url = `${apiHost}/api/entrypermissions/today?pageNumber=${targetPage}&pageSize=${uiPageSize}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = await response.json();
        setVisitPermissions(data.items || []);
        setTotalPermissions(data.totalCount || 0);
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, apiHost]
  );

  useEffect(() => {
    fetchCurrentPagePermissions(1);
  }, [fetchCurrentPagePermissions]);

  const totalPages = Math.ceil(totalPermissions / uiPageSize);

  const cambiarPagina = useCallback(
    async (numeroPagina: number) => {
      const newPage = Math.max(1, Math.min(numeroPagina, totalPages));
      if (newPage === paginaActual) return;

      setPaginaActual(newPage);
      fetchCurrentPagePermissions(newPage);
    },
    [paginaActual, totalPages, fetchCurrentPagePermissions]
  );

  const activeVisits = visitPermissions.filter(
    (p) => p.entryTime && !p.departureTime
  ).length;

  const pendingVisits = visitPermissions.filter(
    (p) => !p.entryTime
  ).length;

  if (totalPermissions === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        No hay permisos para hoy.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <h1 className="text-5xl font-bold text-white text-center">
          Visitas programadas para hoy
        </h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <KpiCard
            title="Permisos Hoy (Total)"
            value={totalPermissions}
            icon={Clock}
            colorClass="bg-gradient-to-br from-purple-600 to-purple-800"
          />
          <KpiCard
            title="Visitas Activas (Pág.)"
            value={activeVisits}
            icon={CheckCircle}
            colorClass="bg-gradient-to-br from-emerald-600 to-teal-700"
          />
          <KpiCard
            title="Próximas Entradas (Pág.)"
            value={pendingVisits}
            icon={AlertTriangle}
            colorClass="bg-gradient-to-br from-amber-500 to-orange-600"
          />
        </div>

        {/* Cards + overlay loading */}
        <div className="relative bg-slate-800/50 rounded-xl border border-purple-500/20 p-6 space-y-6">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${
              isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            {visitPermissions.map((permission) => (
              <VisitCard key={permission.id} permission={permission} />
            ))}
          </div>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-purple-300 text-sm animate-pulse">
                Actualizando página…
              </span>
            </div>
          )}

          <PaginatorUI
            paginaActual={paginaActual}
            totalPaginas={totalPages}
            cambiarPagina={cambiarPagina}
            pageSize={uiPageSize}
          />
        </div>
      </div>
    </div>
  );
}
