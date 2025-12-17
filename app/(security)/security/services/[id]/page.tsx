"use client"

import { QRCodeCanvas } from "qrcode.react"
import type React from "react"
import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import { EntryPermissionResponseDto } from "@/types/order"

export default function ServiceDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [data, setData] = useState<EntryPermissionResponseDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/entrypermissions/${id}`,
          { cache: "no-store" }
        )

        if (!res.ok) return notFound()
        const json = await res.json()
        setData(json)
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [id])

  if (loading) return <p className="p-6 text-gray-400">Cargando...</p>
  if (!data) return notFound()

  return (
    <div className="in-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">

      {/* CARD PRINCIPAL */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-purple-500/20 shadow-xl">

        {/* BARRA SUPERIOR */}
        <div className="h-2 bg-gradient-to-r from-purple-600 to-purple-800 rounded-t-2xl" />

        <div className="p-6">

          {/* HEADER + QR */}
          <div className="flex flex-col md:flex-row justify-between gap-8">

            {/* TITULO */}
            <div>
              <h1 className="text-3xl font-bold text-white">
                Permiso #{data.id.slice(0, 8)}
              </h1>
              <p className="text-gray-400 mt-1">
                Detalle del permiso de acceso
              </p>

              {/* ESTADO */}
              <span
                className={`inline-flex mt-4 px-4 py-1 text-sm font-bold rounded-lg border
                  ${
                    String(data.status) === "Pending"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                      : String(data.status) === "Completed"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                      : "bg-red-500/20 text-red-300 border-red-500/50"
                  }
                `}
              >
                {String(data.status)}
              </span>
            </div>

            {/* QR */}
            <div className="flex flex-col items-center">
              <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl">
                <QRCodeCanvas
                  value={data.qrCodeValue}
                  size={160}
                  level="H"
                  includeMargin
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center break-all max-w-[160px]">
                {data.qrCodeValue}
              </p>
            </div>
          </div>

          {/* DATOS GENERALES */}
          <SectionTitle>Datos Generales</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Info label="Tipo de permiso">{String(data.type)}</Info>
            <Info label="Creado el">
              {new Date(data.createdAt).toLocaleDateString("es-AR")}
            </Info>
            <Info label="Válido desde">
              {new Date(data.validFrom).toLocaleDateString("es-AR")}
            </Info>

            {data.entryTime && (
              <Info label="Hora de entrada">
                {new Date(data.entryTime).toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </Info>
            )}

            {data.departureTime && (
              <Info label="Hora de salida">
                {new Date(data.departureTime).toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </Info>
            )}

            <Info label="Visitante">
              {data.visitor.nameVisit} {data.visitor.lastNameVisit}
            </Info>

            <Info label="DNI">{data.visitor.dniVisit}</Info>
            <Info label="Servicio">{data.order.description}</Info>
            <Info label="Proveedor">{data.order.supplierName}</Info>
            <Info label="Tipo de servicio">
              {String(data.order.orderType)}
            </Info>
          </div>

          {/* RESIDENTE */}
          <SectionTitle>Solicitado por</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Info label="Nombre">
              {data.resident.name} {data.resident.lastname}
            </Info>
            <Info label="DNI">{data.resident.dni}</Info>
            <Info label="Email">{data.resident.email}</Info>
            <Info label="Teléfono">{data.resident.phone}</Info>
          </div>
        </div>
      </section>
    </div>
  )
}

/* TITULO DE SECCION */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold text-white mt-10 mb-6 pb-3 border-b border-purple-500/30">
      {children}
    </h2>
  )
}

/* INFO */
function Info({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-base font-medium text-gray-200">
        {children}
      </p>
    </div>
  )
}
