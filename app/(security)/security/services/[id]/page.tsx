"use client"
import { QRCodeCanvas } from "qrcode.react"
import type React from "react"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import {
  type EntryPermissionResponseDto,
  PermissionType,
  isMaintenancePermission,
  orderStatusToText,
} from "@/types/order"

export default function ServiceDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [data, setData] = useState<EntryPermissionResponseDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/entrypermissions/${id}`, { cache: "no-store" })

        if (!res.ok) return notFound()

        const json = await res.json()
        setData(json)
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [id])

  if (loading) return <p className="p-6">Cargando...</p>
  if (!data) return notFound()

  return (
    <div className="min-h-screen py-5 px-4 sm:px-6 lg:px-8">
      {/* HEADER + QR */}
    <section className="bg-white rounded-xl shadow-sm border p-6">
    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        
        {/* TITULO */}
        <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-gray-800">
            Permiso #{data.id.slice(0, 8)}
        </h1>
        <p className="text-gray-500 mt-1">
            Detalle del permiso de acceso
        </p>

        {/* ESTADO */}
        <div className="mt-4">
            <span
            className={`inline-flex px-4 py-1 text-sm font-bold rounded-full shadow-sm
                ${
                String(data.status) === "Pending"
                    ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                    : String(data.status) === "Completed"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }
            `}
            >
            {String(data.status)}
            </span>
        </div>
        </div>

        {/* QR */}
        <div className="flex flex-col items-center">
        <div className="p-3 bg-gray-100 rounded-lg">
            <QRCodeCanvas
            value={data.qrCodeValue}
            size={160}
            level="H"
            includeMargin
            />
        </div>

        <p className="mt-2 text-xs text-gray-500 break-all text-center max-w-[160px]">
            {data.qrCodeValue}
        </p>
        </div>    
    </div>
    {/* DATOS GENERALES */}
    <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-6 pb-3 border-b-2 border-purple-200">Datos Generales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Info label="Tipo de permiso">{String(data.type)}</Info>

            <Info label="Creado el">{new Date(data.createdAt).toLocaleDateString("es-AR")}</Info>

            <Info label="Válido desde">{new Date(data.validFrom).toLocaleDateString("es-AR")}</Info>

            {/* Verificamos que exista y que no sea una fecha nula de C# antigua */}
        {data.entryTime && (
        <Info label="Hora de entrada">
            {new Date(data.entryTime).toLocaleTimeString("es-AR", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Ponlo en true si prefieres 02:30 p.m.
            })}
        </Info>
        )}

        {data.departureTime && (
        <Info label="Hora de salida">
            {new Date(data.departureTime).toLocaleTimeString("es-AR", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
            })}
        </Info>
        )}

            <Info label="Visita Asociada">
              {data.visitor.nameVisit} {data.visitor.lastNameVisit}
            </Info>

            <Info label="DNI">{data.visitor.dniVisit}</Info>

            <Info label="Servicio Asociado">{data.order.description}</Info>

            <Info label="Proveedor">{data.order.supplierName}</Info>
            <Info label="Tipo">{String(data.order.orderType)}</Info>
          </div>
            {/* RESIDENTE */}
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6 pb-3 border-b-2 border-purple-200">Solicitado por:</h2>
          <div className="space-y-4">
            <Info label="Nombre">
              {data.resident.name} {data.resident.lastname}
            </Info>

            <Info label="DNI">{data.resident.dni}</Info>
            <Info label="Email">{data.resident.email}</Info>
            <Info label="Teléfono">{data.resident.phone}</Info>
          </div>
    </section>
      </div>

  )
}

/* COMPONENTE AUXILIAR */
function Info({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">{label}</p>
      <p className="text-base font-medium text-gray-900">{children}</p>
    </div>
  )
}
