"use client"

import { useEffect, useMemo, useState } from "react"
import { Eye, X, ChevronLeft, ChevronRight } from "lucide-react"
import { EntryPermissionResponseDto, orderStatusToText, permissionStatusToText } from "@/types/order"
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
    return <p className="p-6">Cargando servicios...</p>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Servicios
        </h1>
        <p className="text-gray-500">
          <span className="font-semibold text-blue-700">
          {filteredServices.length}
          </span> servicios encontrados
        </p>
      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-lg p-4 shadow mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por descripción o proveedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring focus:ring-indigo-300"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
        {paginatedServices.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
          >
            <div className="h-2 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

            {/* 👇 CLAVE PARA BOTÓN ABAJO */}
            <div className="p-5 flex flex-col h-full">
            {/* SERVICIO */}
            <div className="mb-2">
              <h3 className="text-lg font-bold text-gray-900">
                {s.order?.description}
              </h3>

              <p className="text-sm text-gray-600">
                Tipo:{" "}
                <b>{String(s.order.orderType)}</b>
              </p>
            </div>

            {/* VISITANTE (MÁS GRANDE) */}
            <div className="mt-3">
              <p className="text-sm text-gray-500">
                Visitante
              </p>
              <p className="text-base font-semibold text-gray-800">
                {s.visitor.nameVisit} {s.visitor.lastNameVisit}
              </p>

              
            </div>

            {/* RESIDENTE (MÁS CHICO) */}
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Solicitado por{" "}
                <b>
                  {s.resident.name} {s.resident.lastname}
                </b>
              </p>
            </div>

            {/* FECHA VÁLIDA */}
            <div className="mt-2 text-sm text-gray-500">
              Válido desde{" "}
              {new Date(s.validFrom).toLocaleDateString("es-AR")}
            </div>

            {/* STATUS */}
            <span
              className={`self-start mt-3 inline-flex px-3 py-1 text-sm font-semibold rounded-full border
                ${
                  String(s.status) === "Pending"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                    : String(s.status) === "Completed"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }
              `}
            >
              {String(s.status)}
            </span>



            {/* BOTÓN */}
            <Link
              href={`/security/services/${s.id}/`}
              className="mt-auto w-full flex justify-center items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
      <div className="mt-8 bg-white rounded-xl p-5 border shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* INFO */}
          <div className="text-gray-600 text-sm">
            Página {currentPage} de {totalPages}
          </div>

          {/* CONTROLES */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1 rounded-lg border text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1 rounded-lg border text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* INFO EXTRA */}
          <div className="text-gray-500 text-sm">
            {pageSize} servicios por página
          </div>
        </div>
      </div>
    )}


      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3"
            >
              <X />
            </button>

            {modalLoading ? (
              <p>Cargando...</p>
            ) : (
              selectedService && (
                <>
                  <h2 className="text-xl font-bold mb-2">
                    {selectedService.order.description}
                  </h2>
                  <p className="text-gray-600">
                    Proveedor: {selectedService.order.supplierName}
                  </p>
                  <p className="mt-2">
                    Tipo: <b>{String(selectedService.order.orderType)}</b>
                  </p>
                  <p className="mt-2">
                    Estado: <b>{selectedService.status}</b>
                  </p>
                </>
              )
            )}
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
