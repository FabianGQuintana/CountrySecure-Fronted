"use client"

import { useEffect, useMemo, useState } from "react"
import { Eye, ChevronLeft, ChevronRight, Users, History } from "lucide-react"
import Link from "next/link"

/* 🔴 EXPIRADO */
const isExpired = (status: string, validTo?: string) => {
  if (status !== "Pending" || !validTo) return false
  return new Date() > new Date(validTo)
}

interface Props {
  initialToken: string | null
  apiHost: string
}

export default function FamilyVisitsPageClient({
  initialToken,
  apiHost,
}: Props) {
  const [visits, setVisits] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  // 📄 PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  /* 🔄 Fetch visitas familiares */
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await fetch(
          `${apiHost}/api/entrypermissions/type/Visit`,
          {
            headers: {
              Authorization: `Bearer ${initialToken}`,
            },
            cache: "no-store",
          }
        )

        const data = await res.json()
        setVisits(Array.isArray(data) ? data : data.items || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchVisits()
  }, [apiHost, initialToken])

  /* 🔍 Filtro búsqueda */
  const filteredVisits = useMemo(() => {
    setCurrentPage(1)
    return visits.filter((v) => {
      const visitorName = `${v.visitor?.nameVisit ?? ""} ${v.visitor?.lastNameVisit ?? ""}`
      const residentName = `${v.resident?.name ?? ""} ${v.resident?.lastname ?? ""}`

      return (
        visitorName.toLowerCase().includes(search.toLowerCase()) ||
        residentName.toLowerCase().includes(search.toLowerCase())
      )
    })
  }, [visits, search])

  /* 📄 Datos paginados */
  const totalPages = Math.ceil(filteredVisits.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedVisits = filteredVisits.slice(
    startIndex,
    startIndex + pageSize
  )

  if (loading) {
    return <p className="p-6 text-gray-300">Cargando visitas familiares...</p>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-200">

      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="text-purple-500" />
            Visitas de Familiares
          </h1>
          <p className="text-gray-300 text-lg">
            <span className="font-semibold text-purple-400">
              {filteredVisits.length}
            </span>{" "}
            visitas encontradas
          </p>
        </div>
        <Link
                  href="/security/logs?type=Visit&hideTypeFilter=true"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
                >
                  <History size={18} />
                  Ver historial
                </Link>
      </div>

      {/* FILTRO */}
      <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 shadow mb-8">
        <input
          type="text"
          placeholder="Buscar por visitante o residente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedVisits.map((v) => (
          <div
            key={v.id}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-purple-500/20 shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-700" />

            <div className="p-5 flex flex-col h-full">

              {/* VISITANTE */}
              <div>
                <h3 className="text-lg font-bold text-white">
                  {v.visitor?.nameVisit} {v.visitor?.lastNameVisit}
                </h3>
                <p className="text-sm text-gray-400">Visitante</p>
              </div>

              {/* RESIDENTE */}
              <div className="mt-3">
                <p className="text-sm text-gray-400">
                  Residente:{" "}
                  <b>
                    {v.resident?.name} {v.resident?.lastname}
                  </b>
                </p>
              </div>

              {/* FECHA */}
              <div className="mt-2 text-sm text-gray-500">
                Válido desde{" "}
                {new Date(v.validFrom).toLocaleDateString("es-AR")}
              </div>

              {(() => {
                const expired = isExpired(String(v.status), v.validTo)

                return (
                  <span
                    className={`self-start mt-3 px-3 py-1 text-xs font-bold rounded-lg border
                      ${
                        expired
                          ? "bg-red-600/30 text-red-300 border-red-500"
                          : String(v.status) === "Pending"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                          : String(v.status) === "Completed"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                          : "bg-red-500/20 text-red-300 border-red-500/50"
                      }
                    `}
                  >
                    {expired ? "Expired" : String(v.status)}
                  </span>
                )
              })()}

              {/* DETALLE */}
              <Link
                    href={`/security/family-visits/${v.id}`}
                    className="mt-auto w-full flex justify-center items-center gap-2 px-4 py-2
                                bg-gradient-to-r from-purple-600 to-purple-800
                                hover:from-purple-500 hover:to-purple-700
                                text-white rounded-lg font-semibold transition-all"
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
              {pageSize} visitas por página
            </div>
          </div>
        </div>
      )}

      {filteredVisits.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No se encontraron visitas familiares
        </div>
      )}
    </div>
  )
}
