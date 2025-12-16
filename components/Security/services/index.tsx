"use client"

import { useEffect, useMemo, useState } from "react"
import { Eye, History, ChevronLeft, ChevronRight } from "lucide-react"
import { EntryPermissionResponseDto } from "@/types/order"
import Link from "next/link"

export default function ServicesCardsPage() {
  const [services, setServices] = useState<EntryPermissionResponseDto[]>([])
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  const [selectedService, setSelectedService] =
    useState<EntryPermissionResponseDto | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

  // 🔢 PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  /* 🔄 Traer servicios */
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/entrypermissions/type/Maintenance`,
          { cache: "no-store" }
        )
        const data = await res.json()
        setServices(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  /* 🧠 Tipos únicos */
  const serviceTypes = useMemo(() => {
    return Array.from(new Set(services.map((s) => String(s.order.orderType))))
  }, [services])

  /* 🔍 Filtros */
  const filteredServices = useMemo(() => {
    setCurrentPage(1)
    return services.filter((s) => {
      const matchesSearch =
        s.order.description?.toLowerCase().includes(search.toLowerCase()) ||
        s.order.supplierName.toLowerCase().includes(search.toLowerCase())

      const matchesType =
        typeFilter === "all" || String(s.order.orderType) === typeFilter

      return matchesSearch && matchesType
    })
  }, [services, search, typeFilter])

  /* 📄 Datos paginados */
  const totalPages = Math.ceil(filteredServices.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedServices = filteredServices.slice(
    startIndex,
    startIndex + pageSize
  )

  if (loading) {
    return <p className="p-6 text-gray-300">Cargando servicios...</p>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-200">

      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Gestión de Servicios
          </h1>
          <p className="text-gray-300 text-lg">
            <span className="font-semibold text-purple-400">
              {filteredServices.length}
            </span>{" "}
            servicios encontrados
          </p>
        </div>

        <Link
          href="/security/logs?type=Maintenance&hideTypeFilter=true"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
        >
          <History size={18} />
          Ver historial
        </Link>
      </div>



      {/* FILTROS */}
      <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 shadow mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por descripción o proveedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:flex-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-64 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-purple-500/20 shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            <div className="h-2 bg-gradient-to-r from-purple-600 to-purple-800" />

            <div className="p-5 flex flex-col h-full">
              {/* SERVICIO */}
              <div className="mb-2">
                <h3 className="text-lg font-bold text-white">
                  {s.order?.description}
                </h3>
                <p className="text-sm text-gray-400">
                  Tipo: <b>{String(s.order.orderType)}</b>
                </p>
              </div>

              {/* VISITANTE */}
              <div className="mt-3">
                <p className="text-xs text-gray-500">Visitante</p>
                <p className="text-base font-semibold text-gray-200">
                  {s.visitor.nameVisit} {s.visitor.lastNameVisit}
                </p>
              </div>

              {/* RESIDENTE */}
              <div className="mt-2">
                <p className="text-sm text-gray-400">
                  Solicitado por{" "}
                  <b>
                    {s.resident.name} {s.resident.lastname}
                  </b>
                </p>
              </div>

              {/* FECHA */}
              <div className="mt-2 text-sm text-gray-500">
                Válido desde{" "}
                {new Date(s.validFrom).toLocaleDateString("es-AR")}
              </div>

              {/* STATUS */}
              <span
                className={`self-start mt-3 px-3 py-1 text-xs font-bold rounded-lg border
                  ${
                    String(s.status) === "Pending"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                      : String(s.status) === "Completed"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                      : "bg-red-500/20 text-red-300 border-red-500/50"
                  }
                `}
              >
                {String(s.status)}
              </span>

              {/* BOTÓN */}
              <Link
                href={`/security/services/${s.id}/`}
                className="mt-auto w-full flex justify-center items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg"
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
        <div className="mt-8 bg-slate-800/70 border border-slate-700 rounded-xl p-5 shadow">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <div className="text-gray-400 text-sm">
              Página {currentPage} de {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-gray-200 hover:bg-slate-700 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-gray-200 hover:bg-slate-700 disabled:opacity-50"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-gray-500 text-sm">
              {pageSize} servicios por página
            </div>
          </div>
        </div>
      )}

      {/* EMPTY */}
      {filteredServices.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No se encontraron servicios
        </div>
      )}
    </div>
  )
}
