


"use client"
import { useState, useEffect } from "react"
import { Calendar, Clock, User, Search, ChevronLeft, ChevronRight, Filter, Download, ArrowUpDown } from "lucide-react"
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
  validFrom: string
  validTo: string
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

interface PaginationData {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

const LogView: React.FC<LogViewProps> = ({ session }) => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filtros
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  
  // Paginación
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  })

  const fetchLogs = async (page: number = 1) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pagination.pageSize.toString(),
      })

      if (startDate) params.append("startDate", startDate)
      if (endDate) params.append("endDate", endDate)
      if (searchTerm) params.append("search", searchTerm)
      if (filterType !== "all") params.append("type", filterType)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/entrypermissions/history?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      )

      if (!response.ok) throw new Error("Error al obtener el historial")

      const data = await response.json()
      
      setLogs(data.items || data.data || data)
      
      if (data.pagination) {
        setPagination(data.pagination)
      } else if (data.totalPages) {
        setPagination({
          currentPage: data.currentPage || page,
          pageSize: data.pageSize || 10,
          totalItems: data.totalItems || 0,
          totalPages: data.totalPages || 1,
        })
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Error al cargar el historial")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs(1)
  }, [])

  const handleSearch = () => {
    fetchLogs(1)
  }

  const handleClearFilters = () => {
    setStartDate("")
    setEndDate("")
    setSearchTerm("")
    setFilterType("all")
    fetchLogs(1)
  }

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-"
    try {
      const date = new Date(dateString)
      return date.toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "N/A"
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Visit":
        return <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-semibold">Visita</span>
      case "Maintenance":
        return <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs font-semibold">Mantenimiento</span>
      case "Delivery":
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-semibold">Delivery</span>
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs font-semibold">{type}</span>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded text-xs font-semibold">Pendiente</span>
      case "Active":
        return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs font-semibold">Activo</span>
      case "Completed":
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs font-semibold">Completado</span>
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs font-semibold">{status}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Registro de Entradas</h1>
            <p className="text-gray-400">Historial completo de movimientos</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Download size={18} className="mr-2" />
            Exportar
          </Button>
        </div>

        {/* Filtros */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Búsqueda */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Buscar por nombre/DNI</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Fecha inicio */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Fecha desde</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Fecha fin */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Fecha hasta</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Tipo</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
              >
                <option value="all">Todos</option>
                <option value="Visit">Visitas</option>
                <option value="Maintenance">Mantenimiento</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
          </div>

          {/* Botones de filtro */}
          <div className="flex gap-3 mt-4">
            <Button 
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Filter size={18} className="mr-2" />
              Aplicar Filtros
            </Button>
            <Button 
              onClick={handleClearFilters}
              className="bg-slate-700 hover:bg-slate-600 text-white"
            >
              Limpiar
            </Button>
          </div>
        </div>

        {/* Tabla de logs */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <p className="text-gray-400 mt-4">Cargando historial...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400">No se encontraron registros</p>
            </div>
          ) : (
            <>
              {/* Tabla */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Visitante/Servicio</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Residente</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Entrada</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Salida</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Guardia Entrada</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Guardia Salida</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-4">{getTypeBadge(log.type)}</td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-white font-medium">
                            {log.type === "Visit" && log.visitor
                              ? `${log.visitor.nameVisit} ${log.visitor.lastNameVisit}`
                              : log.order
                              ? log.order.supplierName
                              : "N/A"}
                          </div>
                          {log.type === "Visit" && log.visitor && (
                            <div className="text-xs text-gray-400">DNI: {log.visitor.dniVisit}</div>
                          )}
                          {log.order && (
                            <div className="text-xs text-gray-400">{log.order.orderType}</div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-300">
                            {log.resident ? `${log.resident.name} ${log.resident.lastname}` : "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-300">{formatDateTime(log.entryTime)}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-300">{formatDateTime(log.departureTime)}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-300">
                            {log.checkInGuard 
                              ? `${log.checkInGuard.name} ${log.checkInGuard.lastname}`
                              : "-"}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-300">
                            {log.checkOutGuard 
                              ? `${log.checkOutGuard.name} ${log.checkOutGuard.lastname}`
                              : "-"}
                          </div>
                        </td>
                        <td className="px-4 py-4">{getStatusBadge(log.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div className="bg-slate-700/30 px-6 py-4 flex items-center justify-between border-t border-slate-700">
                <div className="text-sm text-gray-400">
                  Mostrando {((pagination.currentPage - 1) * pagination.pageSize) + 1} a{" "}
                  {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} de{" "}
                  {pagination.totalItems} registros
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => fetchLogs(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"
                  >
                    <ChevronLeft size={18} />
                  </Button>
                  <span className="text-white px-4">
                    Página {pagination.currentPage} de {pagination.totalPages}
                  </span>
                  <Button
                    onClick={() => fetchLogs(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"
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