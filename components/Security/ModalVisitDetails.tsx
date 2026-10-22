"use client";
import type React from "react";
import type { EntryPermissionDto } from "@/types/models";
import { useState } from "react";
import {
  X,
  User,
  Calendar,
  Clock,
  Truck,
  Package,
  CheckCircle,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { checkInPermission, checkOutPermission } from "@/features/entry-permissions/actions";

interface ModalVisitDetailsProps {
  permission: EntryPermissionDto;
}

const ModalVisitDetails: React.FC<ModalVisitDetailsProps> = ({ permission }) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      return "Formato inválido";
    }
  };

  const handleRegisterEntry = async () => {
    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);

    const result = await checkInPermission(permission.id);

    if (!result.ok) {
      setError(result.error);
      setIsProcessing(false);
      return;
    }

    setSuccessMessage("✓ Entrada registrada exitosamente");

    // Esperar 1.5 segundos y luego cerrar
    setTimeout(() => {
      router.back();
      router.refresh();
    }, 1500);
  };

  const handleRegisterDeparture = async () => {
    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);

    const result = await checkOutPermission(permission.id);

    if (!result.ok) {
      setError(result.error);
      setIsProcessing(false);
      return;
    }

    setSuccessMessage("✓ Salida registrada exitosamente");

    // Esperar 1.5 segundos y luego cerrar
    setTimeout(() => {
      router.back();
      router.refresh();
    }, 1500);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 bg-overlay backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-primary/30 bg-background">
        {/* Header */}
        <div className="sticky top-0 text-primary-foreground p-5 rounded-t-2xl flex justify-between items-center shadow-lg z-10 bg-primary">
          <div>
            <h2 className="text-2xl font-bold">Detalles del Permiso</h2>
            <p className="text-primary text-xs mt-1">ID: {permission.id}</p>
          </div>
          <button
            onClick={handleClose}
            className="hover:bg-card/20 rounded-full p-2 transition-all duration-300 hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-danger/20 border border-danger/50 text-danger rounded-lg text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-success/20 border border-success/50 text-success rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {/* Validación de datos obligatorios */}
          {(!permission.resident || !permission.visitor) && (
            <div className="p-3 bg-danger/20 border border-danger/50 text-danger rounded-lg text-sm">
              <p className="font-semibold mb-1">
                ⚠️ Error: Datos obligatorios faltantes
              </p>
              <ul className="text-xs space-y-1">
                {!permission.resident && (
                  <li>• No hay información del residente</li>
                )}
                {!permission.visitor && (
                  <li>• No hay información del visitante</li>
                )}
              </ul>
            </div>
          )}

          {/* Tipo de Permiso y Status */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                permission.type === "Visit"
                  ? "bg-primary/20 text-primary border border-primary/50"
                  : permission.type === "Maintenance"
                  ? "bg-warning/20 text-warning border border-warning/50"
                  : "bg-info/20 text-info border border-info/50"
              }`}
            >
              {permission.type === "Visit"
                ? "VISITANTE"
                : permission.type === "Maintenance"
                ? "MANTENIMIENTO"
                : "DELIVERY"}
            </span>
            <span
              className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                permission.status === "Pending"
                  ? "bg-warning/20 text-warning border border-warning/50"
                  : permission.entryTime && !permission.departureTime
                  ? "bg-success/20 text-success border border-success/50"
                  : "bg-muted-foreground/20 text-muted-foreground border border-border/50"
              }`}
            >
              {permission.status}
            </span>
          </div>

          {/* Grid de información - Compacto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Visitante o Proveedor */}
            {permission.type === "Visit" ? (
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <User className="text-primary" size={20} />
                  <h3 className="text-sm font-semibold text-foreground">
                    Visitante
                  </h3>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-foreground">
                    {permission.visitor?.nameVisit}{" "}
                    {permission.visitor?.lastNameVisit}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    DNI: {permission.visitor?.dniVisit || "N/A"}
                  </p>
                </div>
              </div>
            ) : permission.order ? (
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="text-warning" size={20} />
                  <h3 className="text-sm font-semibold text-foreground">Servicio</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-foreground">
                    {permission.order.supplierName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {permission.order.description}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Package size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {permission.order.orderType}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="text-muted-foreground" size={20} />
                  <h3 className="text-sm font-semibold text-foreground">
                    Información no disponible
                  </h3>
                </div>
              </div>
            )}

            {/* Residente */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Building className="text-primary" size={20} />
                <h3 className="text-sm font-semibold text-foreground">Residente</h3>
              </div>
              {permission.resident ? (
                <div className="space-y-1">
                  <p className="text-base font-bold text-foreground">
                    {permission.resident.name} {permission.resident.lastname}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    DNI: {permission.resident.dni || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tel: {permission.resident.phone || "N/A"}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Información no disponible
                </p>
              )}
            </div>

            {/* Horarios */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-primary" size={20} />
                <h3 className="text-sm font-semibold text-foreground">
                  Horario Programado
                </h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Válido desde</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(permission.validFrom)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Válido hasta</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(permission.validTo)}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-primary" size={20} />
                <h3 className="text-sm font-semibold text-foreground">Código QR</h3>
              </div>
              <p className="text-xs text-muted-foreground break-all font-mono bg-card/50 p-2 rounded">
                {permission.qrCodeValue}
              </p>
            </div>
          </div>

          {/* Registro de Movimientos - Compacto */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
            <h3 className="font-semibold text-foreground text-base mb-3 flex items-center gap-2">
              <Clock className="text-primary" size={20} />
              Registro de Movimientos
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`p-3 rounded-lg ${
                  permission.entryTime
                    ? "bg-success/10 border border-success/50"
                    : "bg-card/50 border border-border/50"
                }`}
              >
                <p className="text-xs text-muted-foreground mb-1">Hora de Entrada</p>
                <p
                  className={`text-sm font-semibold ${
                    permission.entryTime ? "text-success" : "text-muted-foreground"
                  }`}
                >
                  {formatDateTime(permission.entryTime)}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  permission.departureTime
                    ? "bg-danger/10 border border-danger/50"
                    : "bg-card/50 border border-border/50"
                }`}
              >
                <p className="text-xs text-muted-foreground mb-1">Hora de Salida</p>
                <p
                  className={`text-sm font-semibold ${
                    permission.departureTime ? "text-danger" : "text-muted-foreground"
                  }`}
                >
                  {formatDateTime(permission.departureTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-background/95 p-4 -mx-6 -mb-6 rounded-b-2xl">
            {!permission.entryTime && permission.status === "Pending" && (
              <Button
                onClick={handleRegisterEntry}
                disabled={isProcessing}
                className="flex-1 bg-linear-to-r from-success to-success hover:from-success hover:to-success text-foreground font-bold py-3 shadow-lg hover:shadow-success/50 transition-all duration-300"
              >
                {isProcessing ? "Procesando..." : "✓ Registrar Entrada"}
              </Button>
            )}

            {permission.entryTime && !permission.departureTime && (
              <Button
                onClick={handleRegisterDeparture}
                disabled={isProcessing}
                className="flex-1 bg-linear-to-r from-danger to-danger hover:from-danger hover:to-danger text-foreground font-bold py-3 shadow-lg hover:shadow-danger/50 transition-all duration-300"
              >
                {isProcessing ? "Procesando..." : "✗ Registrar Salida"}
              </Button>
            )}

            <Button
              onClick={handleClose}
              className="flex-1 bg-muted hover:bg-muted text-foreground font-semibold py-3 border border-border transition-all duration-300"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVisitDetails;
