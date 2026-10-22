"use client";

import type React from "react";
import type { EntryPermissionDto } from "@/types/models";
import {
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface VisitCardProps {
  permission: EntryPermissionDto & { effectiveStatus?: string };
}

const VisitCard: React.FC<VisitCardProps> = ({ permission }) => {
  const router = useRouter();

  // Cambiar para usar el `effectiveStatus` que viene del componente principal
  const getStatusBadge = () => {
    switch (permission.effectiveStatus) {
      case "Pending":
        return (
          <span className="flex items-center gap-1 text-xs px-3 py-1 bg-warning/20 text-warning rounded-full font-medium border border-warning/30">
            <Clock size={14} />
            Pendiente
          </span>
        );
      case "Active":
        return (
          <span className="flex items-center gap-1 text-xs px-3 py-1 bg-success/20 text-success rounded-full font-medium border border-success/30">
            <CheckCircle size={14} />
            Activo
          </span>
        );
      case "Expired":
        return (
          <span className="flex items-center gap-1 text-xs px-3 py-1 bg-danger/20 text-warning rounded-full font-medium border border-warning/30">
            <Clock size={14} />
            Expirado
          </span>
        );
      default:
        return null;
    }
  };

  const formatDateTime = (dateString?: string | null) => {
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
        return "border-l-primary";
      case "Maintenance":
        return "border-l-warning";
      default:
        return "border-l-border";
    }
  };

  const getTypeLabel = () => {
    switch (permission.type) {
      case "Visit":
        return {
          label: "VISITANTE",
          color: "bg-primary/20 text-primary border-primary/30",
        };
      case "Maintenance":
        return {
          label: "MANTENIMIENTO",
          color: "bg-warning/20 text-warning border-warning/30",
        };
      default:
        return {
          label: "OTRO",
          color: "bg-muted-foreground/20 text-muted-foreground border-border/30",
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
      className={`bg-card/50 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border-l-4 ${getCardBorderColor()} border border-border/50 hover:border-primary/50 hover:scale-105`}
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
          <div className="bg-danger/20 border border-danger/50 rounded-lg p-3 text-danger text-xs">
            ⚠️ Error: Faltan datos obligatorios
            {!permission.resident && <div>• Sin información del residente</div>}
            {!permission.visitor && <div>• Sin información del visitante</div>}
          </div>
        )}

        {/* Visitante o Proveedor */}
        {permission.type === "Visit" ? (
          <div className="flex items-start gap-3">
            <User size={18} className="text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {permission.visitor?.nameVisit}{" "}
                {permission.visitor?.lastNameVisit}
              </p>
              <p className="text-xs text-muted-foreground">
                DNI: {permission.visitor?.dniVisit || "N/A"}
              </p>
            </div>
          </div>
        ) : permission.order ? (
          <div className="flex items-start gap-3">
            <Truck size={18} className="text-warning mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {permission.order.supplierName}
              </p>
              <p className="text-xs text-muted-foreground">
                {permission.order.orderType}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <Package size={18} className="text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Servicio sin detalles
              </p>
              <p className="text-xs text-muted-foreground">Información no disponible</p>
            </div>
          </div>
        )}

        {/* Residente */}
        <div className="flex items-start gap-3">
          <User size={18} className="text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Residente</p>
            <p className="text-sm text-muted-foreground">
              {permission.resident?.name && permission.resident?.lastname
                ? `${permission.resident.name} ${permission.resident.lastname}`
                : "No especificado"}
            </p>
          </div>
        </div>

        {/* Horario */}
        <div className="flex items-start gap-3">
          <Calendar size={18} className="text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Horario programado</p>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(permission.validFrom)}
            </p>
            <p className="text-xs text-muted-foreground">hasta</p>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(permission.validTo)}
            </p>
          </div>
        </div>

        {/* Entrada registrada */}
        {permission.entryTime && (
          <div className="flex items-center gap-2 bg-success/10 border border-success/30 rounded-lg px-3 py-2">
            <Clock size={16} className="text-success" />
            <p className="text-sm text-success">
              Entrada: {formatDateTime(permission.entryTime)}
            </p>
          </div>
        )}

        {/* Salida registrada */}
        {permission.departureTime && (
          <div className="flex items-center gap-2 bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
            <Clock size={16} className="text-danger" />
            <p className="text-sm text-danger">
              Salida: {formatDateTime(permission.departureTime)}
            </p>
          </div>
        )}
      </div>

      {/* Button */}
      <Button
        onClick={handleViewMore}
        className="w-full bg-linear-to-r from-primary to-primary hover:from-primary hover:to-primary text-foreground font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/50"
      >
        Ver más
      </Button>
    </div>
  );
};

export default VisitCard;
