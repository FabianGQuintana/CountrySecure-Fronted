"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
} from "lucide-react"
import { Button } from "@/components/UI/button"

interface LogViewProps {
  session: any
}

interface LogEntry {
  id: string
  type: string
  status: string

  visitor?: {
    nameVisit: string
    lastNameVisit: string
    dniVisit: string
  }

  order?: {
    supplierName: string
    orderType: string
  }

  resident?: {
    name: string
    lastname: string
  }

  entryTime?: string
  departureTime?: string
  checkInGuard?: {
    id: string
    name: string
    lastname: string
  }
  checkOutGuard?: {
    id: string
    name: string
    lastname: string
  }
}

const PAGE_SIZE = 10

const LogView: React.FC<LogViewProps> = ({ session }) => {
  const searchParams = useSearchParams()

  // 🔒 Params desde Services
  const forcedType = searchParams.get("type")
  const hideTypeFilter = searchParams.get("hideTypeFilter") === "true"

  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔍 Filtros (NO SE TOCAN)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>(
    forcedType ?? "all"
  )

  // 📄 Paginación frontend REAL
  const [currentPage, setCurrentPage] = useState(1)

  /* 🔄 Fetch único */
  const fetchLogs = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/entrypermissions/history`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Error al obtener el historial")
      }

      const data = await response.json()
      const logsData = Array.isArray(data)
        ? data
        : data.items ?? []

      setLogs(logsData)
    } catch (err: any) {
      setError(err.message || "Error al cargar historial")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  /* 🧠 FILTRADO FRONTEND (CLAVE) */
  const filteredLogs = useMemo(() => {
    setCurrentPage(1)

    return logs.filter((log) => {
      // 🔒 FORCED TYPE SIEMPRE MANDA
      const matchesType =
        forcedType
          ? log.type === forcedType
          : filterType === "all" || log.type === filterType

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
          .includes(searchTerm.toLowerCase())

      const entryDate = log.entryTime
        ? new Date(log.entryTime).toISOString().split("T")[0]
        : null

      const matchesStart =
        !startDate || (entryDate && entryDate >= startDate)

      const matchesEnd =
        !endDate || (entryDate && entryDate <= endDate)

      return matchesType && matchesSearch && matchesStart && matchesEnd
    })
  }, [logs, searchTerm, filterType, startDate, endDate, forcedType])

  /* 📄 PAGINACIÓN */
  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE)

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredLogs.slice(start, start + PAGE_SIZE)
  }, [filteredLogs, currentPage])

  const handleSearch = () => setCurrentPage(1)

  const handleClearFilters = () => {
    setStartDate("")
    setEndDate("")
    setSearchTerm("")
    if (!forcedType) setFilterType("all")
    setCurrentPage(1)
  }

  const formatDateTime = (date?: string) =>
    date ? new Date(date).toLocaleString("es-AR") : "-"

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      Visit: "bg-purple-500/20 text-purple-300",
      Maintenance: "bg-orange-500/20 text-orange-300",
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[type] ?? "bg-gray-500/20 text-gray-300"}`}>
        {type}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Pending: "bg-amber-500/20 text-amber-300",
      Completed: "bg-emerald-500/20 text-emerald-300",
      Cancelled: "bg-red-500/20 text-red-300",
      Expired: "bg-gray-500/20 text-gray-300",
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[status] ?? "bg-gray-500/20 text-gray-300"}`}>
        {status}
      </span>
    )
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {forcedType === "Maintenance"
                ? "Historial de Servicios"
                : "Registro de Entradas"}
            </h1>
            <p className="text-gray-400">
              Historial completo de movimientos
            </p>
          </div>

          
        </div>

        {/* FILTROS */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nombre / Proveedor"
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Fecha desde
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Fecha hasta
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500"
              />
            </div>

            {!hideTypeFilter && (
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Tipo
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500"
                >
                  <option value="all">Todos</option>
                  <option value="Visit">Visitas</option>
                  <option value="Maintenance">Mantenimiento</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <Button onClick={handleSearch} className="bg-purple-600 text-white">
              <Filter size={18} className="mr-2" />
              Aplicar filtros
            </Button>
            <Button
              onClick={handleClearFilters}
              className="bg-slate-700 text-white"
            >
              Limpiar
            </Button>
          </div>
        </div>

        {/* TABLA */}
        <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              Cargando historial...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">
              {error}
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No se encontraron registros
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
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
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-700">
                    {paginatedLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-700/30">
                        <td className="px-4 py-4">
                           {getTypeBadge(log.type)}
                        </td>

                        <td className="px-4 py-4 text-white">
                          {log.visitor
                            ? `${log.visitor.nameVisit} ${log.visitor.lastNameVisit}`
                            : log.order?.supplierName ?? "N/A"}
                        </td>

                        <td className="px-4 py-4 text-gray-300">
                          {log.resident
                            ? `${log.resident.name} ${log.resident.lastname}`
                            : "-"}
                        </td>

                        <td className="px-4 py-4 text-gray-300">
                          {formatDateTime(log.entryTime)}
                        </td>

                        <td className="px-4 py-4 text-gray-300">
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
              <div className="px-6 py-4 flex justify-between items-center border-t border-slate-700">
                <span className="text-sm text-gray-400">
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
  )
}

export default LogView
