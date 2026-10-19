"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { PASS_TYPE_LABELS, PassType, PermissionType, VEHICLE_TYPE_LABELS, VehicleType } from "@/types/api";
import { createPermission, fetchPass } from "@/features/entry-permissions/actions";
import { PassCard } from "@/components/pass/PassCard";
import { createVisit, findVisitsByDni } from "@/features/visits/actions";
import { listOrders } from "@/features/orders/actions";
import type { VisitDto, OrderDto, PassDto } from "@/types/models";
import { orderTypeLabel } from "@/types/api";
import { useSession } from "next-auth/react";

type FormErrors = Record<string, string>;

interface PermitFormData {
  permissionType: PermissionType;
  nameVisit: string;
  lastNameVisit: string;
  dniVisit: string;
  orderId: string;
  description: string;
  validFrom: string;
  validTo: string;
  companionsCount: string;
  vehicleType: VehicleType;
  vehiclePlate: string;
  vehicleModel: string;
  passType: PassType;
}

const EMPTY_FORM: PermitFormData = {
  permissionType: PermissionType.Visit,
  nameVisit: "",
  lastNameVisit: "",
  dniVisit: "",
  orderId: "",
  description: "",
  validFrom: "",
  validTo: "",
  companionsCount: "0",
  vehicleType: VehicleType.OnFoot,
  vehiclePlate: "",
  vehicleModel: "",
  passType: PassType.SingleEntry,
};

// Patente: 5 a 12 letras, números, espacios o guiones (el servidor la normaliza)
const PLATE_PATTERN = /^[A-Za-z0-9 -]{5,12}$/;

export default function PermitsPage() {
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState<PermitFormData>(EMPTY_FORM);

  const [errors, setErrors] = useState<FormErrors>({});
  // Pase generado: cuando existe, se muestra en lugar del formulario
  const [createdPass, setCreatedPass] = useState<PassDto | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Último visitante encontrado por DNI; solo vale mientras el DNI escrito siga coincidiendo
  const [lookup, setLookup] = useState<VisitDto | null>(null);
  const resolvedVisit = lookup && String(lookup.dniVisit) === formData.dniVisit.trim() ? lookup : null;

  const [orders, setOrders] = useState<OrderDto[]>([]);

  const isMaintenance = formData.permissionType === PermissionType.Maintenance;

  const setField = <K extends keyof PermitFormData>(key: K, value: PermitFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
      // Al cambiar el tipo de permiso se descarta el servicio elegido
      ...(key === "permissionType" && value !== PermissionType.Maintenance ? { orderId: "" } : {}),
    }));
    if (key === "permissionType") setErrors({});
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
    setSubmitError(null);
  };

  const minDateTimeLocal = useMemo(() => {
    const d = new Date();
    d.setSeconds(0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }, []);

  useEffect(() => {
    if (!isMaintenance) return;
    (async () => {
      const result = await listOrders();
      if (result.ok) setOrders(result.data);
      else setSubmitError(result.error);
    })();
  }, [isMaintenance]);

  useEffect(() => {
    const dni = formData.dniVisit.trim();
    const dniNum = Number(dni);
    if (!dni || Number.isNaN(dniNum) || dni.length < 7) return;

    let cancelled = false;
    const t = setTimeout(async () => {
      const result = await findVisitsByDni(dniNum);
      if (!cancelled) setLookup(result.ok && result.data.length > 0 ? result.data[0] : null);
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [formData.dniVisit]);

  if (status === "loading") {
    return null;
  }

  const validate = () => {
    const next: FormErrors = {};

    if (!formData.validFrom) next.validFrom = "Ingresá fecha/hora de inicio.";
    if (!formData.validTo) next.validTo = "Ingresá fecha/hora de fin.";

    if (formData.validFrom && formData.validTo) {
      if (new Date(formData.validTo) <= new Date(formData.validFrom)) {
        next.validTo = "Debe ser posterior a la fecha de inicio.";
      }
    }

    if (!formData.nameVisit.trim()) next.nameVisit = "Ingresá nombre.";
    if (!formData.lastNameVisit.trim())
      next.lastNameVisit = "Ingresá apellido.";
    if (!formData.dniVisit.trim()) next.dniVisit = "Ingresá DNI.";
    if (isMaintenance && !formData.orderId)
      next.orderId = "Seleccioná un servicio.";

    const companions = Number(formData.companionsCount);
    if (!Number.isInteger(companions) || companions < 0 || companions > 20)
      next.companionsCount = "Ingresá un número entre 0 y 20.";

    if (formData.vehicleType !== VehicleType.OnFoot && !PLATE_PATTERN.test(formData.vehiclePlate.trim()))
      next.vehiclePlate = "Ingresá la patente (5 a 12 letras o números).";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const dniNum = Number(formData.dniVisit);
    let visitId = resolvedVisit?.visitId;

    if (!visitId) {
      const visit = await createVisit({
        nameVisit: formData.nameVisit.trim(),
        lastNameVisit: formData.lastNameVisit.trim(),
        dniVisit: dniNum,
      });

      if (!visit.ok) {
        setSubmitError(visit.error);
        setIsSubmitting(false);
        return;
      }
      visitId = visit.data.visitId;
    }

    const userId = session?.user?.id;
    if (!userId) {
      setSubmitError("Usuario no autenticado.");
      setIsSubmitting(false);
      return;
    }

    const permit = await createPermission({
      permissionType: formData.permissionType,
      description: formData.description || null,
      validFrom: new Date(formData.validFrom).toISOString(),
      validTo: new Date(formData.validTo).toISOString(),
      visitId,
      userId,
      orderId: isMaintenance ? formData.orderId : null,
      companionsCount: Number(formData.companionsCount),
      vehicleType: formData.vehicleType,
      vehiclePlate: formData.vehicleType === VehicleType.OnFoot ? null : formData.vehiclePlate.trim(),
      vehicleModel: formData.vehicleModel.trim() || null,
      passType: formData.passType,
    });

    if (!permit.ok) {
      setSubmitError(permit.error);
      setIsSubmitting(false);
      return;
    }

    // Pase digital listo para descargar y compartir con la visita
    const pass = await fetchPass(permit.data.id);
    if (pass.ok) setCreatedPass(pass.data);
    else setSubmitError("El permiso se creó, pero no se pudo cargar el pase. Lo encontrás en \"Mis pases\".");
    setIsSubmitting(false);
  };

  const inputBase =
    "w-full px-4 py-3.5 border-2 rounded-xl transition-all duration-200 bg-white";
  const inputOk =
    "border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 hover:border-violet-300";
  const inputErr = "border-red-300 bg-red-50/50";

  if (createdPass) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-linear-to-br from-violet-50 via-purple-50 to-indigo-100 px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">¡Pase generado!</h1>
          <p className="text-gray-600">Descargalo o compartilo con tu visita para que lo presente en la guardia.</p>
        </div>
        <PassCard pass={createdPass} />
        <button
          type="button"
          onClick={() => {
            setCreatedPass(null);
            setFormData(EMPTY_FORM);
            setErrors({});
          }}
          className="rounded-xl border border-violet-200 bg-white px-6 py-3 font-medium text-violet-700 hover:bg-violet-50"
        >
          Crear otro pase
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-violet-50 via-purple-50 to-indigo-100 px-4 py-12">
      <motion.div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-violet-100 p-10 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Permiso de ingreso</h1>
        <p className="text-gray-600">
          Completá los datos de la visita para generar el pase con su código QR.
        </p>

        {/* Tipo */}
        <select
          value={formData.permissionType}
          onChange={(e) => setField("permissionType", e.target.value as PermissionType)}
          className={cn(inputBase, inputOk)}
        >
          <option value={PermissionType.Visit}>Visita</option>
          <option value={PermissionType.Maintenance}>Mantenimiento</option>
        </select>

        {/* Fechas */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Desde */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">
              Válido desde
            </label>
            <input
              type="datetime-local"
              min={minDateTimeLocal}
              value={formData.validFrom}
              onChange={(e) => setField("validFrom", e.target.value)}
              className={cn(inputBase, errors.validFrom ? inputErr : inputOk)}
            />
            {errors.validFrom && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.validFrom}
              </p>
            )}
          </div>

          {/* Hasta */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">
              Válido hasta
            </label>
            <input
              type="datetime-local"
              min={minDateTimeLocal}
              value={formData.validTo}
              onChange={(e) => setField("validTo", e.target.value)}
              className={cn(inputBase, errors.validTo ? inputErr : inputOk)}
            />
            {errors.validTo && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.validTo}
              </p>
            )}
          </div>
        </div>

        {/* Datos visita */}
        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Nombre"
            value={formData.nameVisit}
            onChange={(e) => setField("nameVisit", e.target.value)}
            className={cn(inputBase, errors.nameVisit ? inputErr : inputOk)}
          />
          <input
            placeholder="Apellido"
            value={formData.lastNameVisit}
            onChange={(e) => setField("lastNameVisit", e.target.value)}
            className={cn(inputBase, errors.lastNameVisit ? inputErr : inputOk)}
          />
          <input
            placeholder="DNI"
            value={formData.dniVisit}
            onChange={(e) => setField("dniVisit", e.target.value)}
            className={cn(inputBase, errors.dniVisit ? inputErr : inputOk)}
          />
        </div>

        {/* Acompañantes y tipo de pase */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="companions" className="text-sm font-semibold text-gray-700">
              Cantidad de acompañantes
            </label>
            <input
              id="companions"
              type="number"
              min={0}
              max={20}
              inputMode="numeric"
              value={formData.companionsCount}
              onChange={(e) => setField("companionsCount", e.target.value)}
              className={cn(inputBase, errors.companionsCount ? inputErr : inputOk)}
            />
            {errors.companionsCount && <p className="text-sm text-red-600">{errors.companionsCount}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="passType" className="text-sm font-semibold text-gray-700">
              Tipo de pase
            </label>
            <select
              id="passType"
              value={formData.passType}
              onChange={(e) => setField("passType", e.target.value as PassType)}
              className={cn(inputBase, inputOk)}
            >
              <option value={PassType.SingleEntry}>{PASS_TYPE_LABELS.SingleEntry}</option>
              <option value={PassType.MultipleEntries}>{PASS_TYPE_LABELS.MultipleEntries}</option>
            </select>
          </div>
        </div>

        {/* Vehículo */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label htmlFor="vehicleType" className="text-sm font-semibold text-gray-700">
              Cómo llega
            </label>
            <select
              id="vehicleType"
              value={formData.vehicleType}
              onChange={(e) => setField("vehicleType", e.target.value as VehicleType)}
              className={cn(inputBase, inputOk)}
            >
              <option value={VehicleType.OnFoot}>{VEHICLE_TYPE_LABELS.OnFoot}</option>
              <option value={VehicleType.Car}>{VEHICLE_TYPE_LABELS.Car}</option>
              <option value={VehicleType.Motorcycle}>{VEHICLE_TYPE_LABELS.Motorcycle}</option>
            </select>
          </div>

          {formData.vehicleType !== VehicleType.OnFoot && (
            <>
              <div className="space-y-1">
                <label htmlFor="plate" className="text-sm font-semibold text-gray-700">
                  Patente
                </label>
                <input
                  id="plate"
                  placeholder="AB123CD"
                  value={formData.vehiclePlate}
                  onChange={(e) => setField("vehiclePlate", e.target.value.toUpperCase())}
                  className={cn(inputBase, "uppercase", errors.vehiclePlate ? inputErr : inputOk)}
                />
                {errors.vehiclePlate && <p className="text-sm text-red-600">{errors.vehiclePlate}</p>}
              </div>
              <div className="space-y-1">
                <label htmlFor="model" className="text-sm font-semibold text-gray-700">
                  Modelo <span className="font-normal text-gray-400">(opcional)</span>
                </label>
                <input
                  id="model"
                  placeholder="Fiat Cronos"
                  value={formData.vehicleModel}
                  onChange={(e) => setField("vehicleModel", e.target.value)}
                  className={cn(inputBase, inputOk)}
                />
              </div>
            </>
          )}
        </div>

        {/* Mantenimiento */}
        {isMaintenance && (
          <select
            value={formData.orderId}
            onChange={(e) => setField("orderId", e.target.value)}
            className={cn(inputBase, errors.orderId ? inputErr : inputOk)}
          >
            <option value="">Seleccionar servicio</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {orderTypeLabel(o.orderType)} — {o.supplierName}
              </option>
            ))}
          </select>
        )}

        {/* Feedback */}
        {submitError && (
          <div className="flex gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle className="w-5 h-5" />
            {submitError}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-semibold text-white bg-linear-to-r from-violet-600 to-purple-600 shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Generando pase..." : "Generar pase"}
        </button>
      </motion.div>
    </div>
  );
}
