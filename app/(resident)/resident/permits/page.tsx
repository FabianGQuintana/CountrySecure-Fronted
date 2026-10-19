"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { PermissionType } from "@/types/api";
import { createPermission } from "@/features/entry-permissions/actions";
import { createVisit, findVisitsByDni } from "@/features/visits/actions";
import { listOrders } from "@/features/orders/actions";
import type { VisitDto, OrderDto } from "@/types/models";
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
}

export default function PermitsPage() {
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState<PermitFormData>({
    permissionType: PermissionType.Visit,
    nameVisit: "",
    lastNameVisit: "",
    dniVisit: "",
    orderId: "",
    description: "",
    validFrom: "",
    validTo: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
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
    if (key === "permissionType") {
      setErrors({});
      setSubmitSuccess(false);
    }
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

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

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
    });

    if (permit.ok) setSubmitSuccess(true);
    else setSubmitError(permit.error);
    setIsSubmitting(false);
  };

  const inputBase =
    "w-full px-4 py-3.5 border-2 rounded-xl transition-all duration-200 bg-white";
  const inputOk =
    "border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 hover:border-violet-300";
  const inputErr = "border-red-300 bg-red-50/50";

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-violet-50 via-purple-50 to-indigo-100 px-4 py-12">
      <motion.div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-violet-100 p-10 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Permiso de ingreso</h1>
        <p className="text-gray-600">
          Completá los datos para generar el permiso.
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

        {submitSuccess && (
          <div className="flex gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            Permiso creado correctamente.
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-semibold text-white bg-linear-to-r from-violet-600 to-purple-600 shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Creando permiso..." : "Crear permiso"}
        </button>
      </motion.div>
    </div>
  );
}
