"use client"
import type React from "react"
import { useState } from "react"
import { X, User, Calendar, Clock, Truck, Package, CheckCircle, Building } from "lucide-react"
import { Button } from "@/components/UI/button"
import { useRouter } from "next/navigation"
import { registerEntry, registerDeparture } from "@/actions/securityActions"

interface ModalVisitDetailsProps {
  permission: any
  guardId?: string
}

const ModalVisitDetails: React.FC<ModalVisitDetailsProps> = ({ permission, guardId }) => {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "No registrado"
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
      return "Formato inválido"
    }
  }

  const handleRegisterEntry = async () => {
    if (!guardId) {
      setError("No se pudo obtener el ID del guardia. Inicia sesión nuevamente.")
      return
    }

    setIsProcessing(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await registerEntry({
        permissionId: permission.id
        
      })
      
      setSuccessMessage("✓ Entrada registrada exitosamente")
      
      // Esperar 1.5 segundos y luego cerrar
      setTimeout(() => {
        router.back()
        router.refresh()
      }, 1500)
    } catch (err: any) {
      console.error("Error al registrar entrada:", err)
      setError(err.message || "Error al registrar la entrada")
      setIsProcessing(false)
    }
  }

  const handleRegisterDeparture = async () => {
    if (!guardId) {
      setError("No se pudo obtener el ID del guardia. Inicia sesión nuevamente.")
      return
    }

    setIsProcessing(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await registerDeparture({
        permissionId: permission.id
        
      })
      
      setSuccessMessage("✓ Salida registrada exitosamente")
      
      // Esperar 1.5 segundos y luego cerrar
      setTimeout(() => {
        router.back()
        router.refresh()
      }, 1500)
    } catch (err: any) {
      console.error("Error al registrar salida:", err)
      setError(err.message || "Error al registrar la salida")
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    router.back()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-purple-500/30">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-800 text-white p-5 rounded-t-2xl flex justify-between items-center shadow-lg z-10">
          <div>
            <h2 className="text-2xl font-bold">Detalles del Permiso</h2>
            <p className="text-purple-200 text-xs mt-1">ID: {permission.id}</p>
          </div>
          <button 
            onClick={handleClose} 
            className="hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {/* Validación de datos obligatorios */}
          {(!permission.resident || !permission.visitor) && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg text-sm">
              <p className="font-semibold mb-1">⚠️ Error: Datos obligatorios faltantes</p>
              <ul className="text-xs space-y-1">
                {!permission.resident && <li>• No hay información del residente</li>}
                {!permission.visitor && <li>• No hay información del visitante</li>}
              </ul>
            </div>
          )}

          {/* Tipo de Permiso y Status */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
              permission.type === "Visit" ? "bg-purple-500/20 text-purple-300 border border-purple-500/50" :
              permission.type === "Maintenance" ? "bg-orange-500/20 text-orange-300 border border-orange-500/50" :
              "bg-blue-500/20 text-blue-300 border border-blue-500/50"
            }`}>
              {permission.type === "Visit" ? "VISITANTE" : 
               permission.type === "Maintenance" ? "MANTENIMIENTO" : "DELIVERY"}
            </span>
            <span className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
              permission.status === "Pending" ? "bg-amber-500/20 text-amber-300 border border-amber-500/50" :
              permission.status === "Active" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50" :
              "bg-gray-500/20 text-gray-300 border border-gray-500/50"
            }`}>
              {permission.status}
            </span>
          </div>

          {/* Grid de información - Compacto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Visitante o Proveedor */}
            {permission.type === "Visit" ? (
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <User className="text-purple-400" size={20} />
                  <h3 className="text-sm font-semibold text-white">Visitante</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-white">
                    {permission.visitor?.nameVisit} {permission.visitor?.lastNameVisit}
                  </p>
                  <p className="text-xs text-gray-400">DNI: {permission.visitor?.dniVisit || 'N/A'}</p>
                </div>
              </div>
            ) : permission.order ? (
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="text-orange-400" size={20} />
                  <h3 className="text-sm font-semibold text-white">Servicio</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-white">{permission.order.supplierName}</p>
                  <p className="text-xs text-gray-400">{permission.order.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Package size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-300">{permission.order.orderType}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="text-gray-400" size={20} />
                  <h3 className="text-sm font-semibold text-white">Información no disponible</h3>
                </div>
              </div>
            )}

            {/* Residente */}
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <div className="flex items-center gap-2 mb-2">
                <Building className="text-purple-400" size={20} />
                <h3 className="text-sm font-semibold text-white">Residente</h3>
              </div>
              {permission.resident ? (
                <div className="space-y-1">
                  <p className="text-base font-bold text-white">
                    {permission.resident.name} {permission.resident.lastname}
                  </p>
                  <p className="text-xs text-gray-400">DNI: {permission.resident.dni || 'N/A'}</p>
                  <p className="text-xs text-gray-400">Tel: {permission.resident.phone || 'N/A'}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-400">Información no disponible</p>
              )}
            </div>

            {/* Horarios */}
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-purple-400" size={20} />
                <h3 className="text-sm font-semibold text-white">Horario Programado</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Válido desde</p>
                  <p className="text-sm text-gray-300">{formatDateTime(permission.validFrom)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Válido hasta</p>
                  <p className="text-sm text-gray-300">{formatDateTime(permission.validTo)}</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-purple-400" size={20} />
                <h3 className="text-sm font-semibold text-white">Código QR</h3>
              </div>
              <p className="text-xs text-gray-400 break-all font-mono bg-slate-800/50 p-2 rounded">
                {permission.qrCodeValue}
              </p>
            </div>

          </div>

          {/* Registro de Movimientos - Compacto */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
            <h3 className="font-semibold text-white text-base mb-3 flex items-center gap-2">
              <Clock className="text-purple-400" size={20} />
              Registro de Movimientos
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg ${permission.entryTime ? 'bg-emerald-500/10 border border-emerald-500/50' : 'bg-slate-800/50 border border-slate-600/50'}`}>
                <p className="text-xs text-gray-400 mb-1">Hora de Entrada</p>
                <p className={`text-sm font-semibold ${permission.entryTime ? 'text-emerald-300' : 'text-gray-500'}`}>
                  {formatDateTime(permission.entryTime)}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${permission.departureTime ? 'bg-red-500/10 border border-red-500/50' : 'bg-slate-800/50 border border-slate-600/50'}`}>
                <p className="text-xs text-gray-400 mb-1">Hora de Salida</p>
                <p className={`text-sm font-semibold ${permission.departureTime ? 'text-red-300' : 'text-gray-500'}`}>
                  {formatDateTime(permission.departureTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-slate-900/95 p-4 -mx-6 -mb-6 rounded-b-2xl">
            {!permission.entryTime && permission.status === "Pending" && (
              <Button 
                onClick={handleRegisterEntry} 
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-3 shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
              >
                {isProcessing ? "Procesando..." : "✓ Registrar Entrada"}
              </Button>
            )}

            {permission.entryTime && !permission.departureTime && (
              <Button 
                onClick={handleRegisterDeparture} 
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 shadow-lg hover:shadow-red-500/50 transition-all duration-300"
              >
                {isProcessing ? "Procesando..." : "✗ Registrar Salida"}
              </Button>
            )}

            <Button 
              onClick={handleClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 border border-slate-600 transition-all duration-300"
            >
              Cerrar
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ModalVisitDetails