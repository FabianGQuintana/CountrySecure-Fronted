"use client";

import type React from "react";
import {
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  Truck,
} from "lucide-react";
import { Button } from "@/components/UI/button";
import { useRouter } from "next/navigation";

interface VisitCardProps {
  permission: any;
}

const VisitCard: React.FC<VisitCardProps> = ({ permission }) => {
  const router = useRouter();

  // Cambiar para usar el `effectiveStatus` que viene del componente principal
  const getStatusBadge = () => {
    switch (permission.effectiveStatus) {
      case "Pending":
        return (
          <span className="flex items-center gap-1 text-xs px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full font-medium border border-amber-500/30">
            <Clock size={14} />
            Pendiente
          </span>
        );
      case "Active":
        return (
          <span className="flex items-center gap-1 text-xs px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full font-medium border border-emerald-500/30">
            <CheckCircle size={14} />
            Activo
          </span>
        );
      case "Expired":
        return (
          <span className="flex items-center gap-1 text-xs px-3 py-1 bg-red-500/20 text-amber-300 rounded-full font-medium border border-amber-500/30">
            <Clock size={14} />
            Expirado
          </span>
        );
      default:
        return null;
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "No registrado";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const getCardBorderColor = () => {
    switch (permission.type) {
      case "Visit":
        return "border-l-purple-500";
      case "Maintenance":
        return "border-l-orange-500";
      case "Delivery":
        return "border-l-blue-500";
      default:
        return "border-l-gray-500";
    }
  };

  const getTypeLabel = () => {
    switch (permission.type) {
      case "Visit":
        return {
          label: "VISITANTE",
          color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        };
      case "Maintenance":
        return {
          label: "MANTENIMIENTO",
          color: "bg-orange-500/20 text-orange-300 border-orange-500/30",
        };
      case "Delivery":
        return {
          label: "DELIVERY",
          color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        };
      default:
        return {
          label: "OTRO",
          color: "bg-gray-500/20 text-gray-300 border-gray-500/30",
        };
    }
  };

  const typeLabel = getTypeLabel();

  const handleViewMore = () => {
    // Si el permiso está expirado, no dejar hacer clic en "Ver más"
    if (permission.effectiveStatus === "Expired") return;
    router.push(`/security/visit/${permission.id}`);
  };

  return (
    <div
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border-l-4 ${getCardBorderColor()} border border-slate-700/50 hover:border-purple-500/50 hover:scale-105`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <span
          className={`px-3 py-1 ${typeLabel.color} text-xs font-bold rounded-lg border`}
        >
          {typeLabel.label}
        </span>
        {getStatusBadge()}
      </div>

      {/* Content */}
      <div className="space-y-4 mb-5">
        {/* Validación de datos obligatorios */}
        {(!permission.resident || !permission.visitor) && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-xs">
            ⚠️ Error: Faltan datos obligatorios
            {!permission.resident && <div>• Sin información del residente</div>}
            {!permission.visitor && <div>• Sin información del visitante</div>}
          </div>
        )}

        {/* Visitante o Proveedor */}
        {permission.type === "Visit" ? (
          <div className="flex items-start gap-3">
            <User size={18} className="text-purple-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">
                {permission.visitor?.nameVisit}{" "}
                {permission.visitor?.lastNameVisit}
              </p>
              <p className="text-xs text-gray-400">
                DNI: {permission.visitor?.dniVisit || "N/A"}
              </p>
            </div>
          </div>
        ) : permission.order ? (
          <div className="flex items-start gap-3">
            <Truck size={18} className="text-orange-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">
                {permission.order.supplierName}
              </p>
              <p className="text-xs text-gray-400">
                {permission.order.orderType}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <Package size={18} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">
                Servicio sin detalles
              </p>
              <p className="text-xs text-gray-400">Información no disponible</p>
            </div>
          </div>
        )}

        {/* Residente */}
        <div className="flex items-start gap-3">
          <User size={18} className="text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Residente</p>
            <p className="text-sm text-gray-300">
              {permission.resident?.name && permission.resident?.lastname
                ? `${permission.resident.name} ${permission.resident.lastname}`
                : "No especificado"}
            </p>
          </div>
        </div>

        {/* Horario */}
        <div className="flex items-start gap-3">
          <Calendar size={18} className="text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Horario programado</p>
            <p className="text-sm text-gray-300">
              {formatDateTime(permission.validFrom)}
            </p>
            <p className="text-xs text-gray-400">hasta</p>
            <p className="text-sm text-gray-300">
              {formatDateTime(permission.validTo)}
            </p>
          </div>
        </div>

        {/* Entrada registrada */}
        {permission.entryTime && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
            <Clock size={16} className="text-emerald-400" />
            <p className="text-sm text-emerald-300">
              Entrada: {formatDateTime(permission.entryTime)}
            </p>
          </div>
        )}

        {/* Salida registrada */}
        {permission.departureTime && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            <Clock size={16} className="text-red-400" />
            <p className="text-sm text-red-300">
              Salida: {formatDateTime(permission.departureTime)}
            </p>
          </div>
        )}
      </div>

      {/* Button */}
      <Button
        onClick={handleViewMore}
        className="w-full bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
      >
        Ver más
      </Button>
    </div>
  );
};

export default VisitCard;
