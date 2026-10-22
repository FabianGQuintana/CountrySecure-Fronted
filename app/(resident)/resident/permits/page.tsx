"use client";

import { useEffect, useState } from "react";
import { KeyRound, UserCheck } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { DateTimeInput, Field, FormError, Input, Select, Spinner, Textarea, primaryButtonClass, secondaryButtonClass } from "@/components/ui/form";
import { PASS_TYPE_LABELS, PassType, PermissionType, VEHICLE_TYPE_LABELS, VehicleType } from "@/types/api";
import { createPermission, fetchPass } from "@/features/entry-permissions/actions";
import { PassCard } from "@/components/pass/PassCard";
import { createVisit, findVisitsByDni } from "@/features/visits/actions";
import { listOrders } from "@/features/orders/actions";
import type { VisitDto, OrderDto, PassDto } from "@/types/models";
import { orderTypeLabel } from "@/types/api";
import { useSession } from "next-auth/react";
import { nowRounded, parseLocal, toLocalDateTimeValue } from "@/lib/datetime";

type FormErrors = Partial<Record<keyof PermitFormData, string>>;

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

// Mismas reglas que CreateEntryPermissionValidator del backend
const PLATE_PATTERN = /^[A-Za-z0-9]{5,10}$/;
const DNI_PATTERN = /^\d{7,8}$/;

export default function PermitsPage() {
  const { data: session } = useSession();

  const [formData, setFormData] = useState<PermitFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  // Pase generado: cuando existe, se muestra en lugar del formulario
  const [createdPass, setCreatedPass] = useState<PassDto | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Se recalcula al enfocar los campos de fecha, así el mínimo nunca queda viejo
  const [minDateTime, setMinDateTime] = useState(() => toLocalDateTimeValue(nowRounded()));

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
    setErrors((prev) => (key === "permissionType" ? {} : { ...prev, [key]: undefined }));
    setSubmitError(null);
  };

  // Un visitante ya registrado completa nombre y apellido solo
  useEffect(() => {
    if (!resolvedVisit) return;
    setFormData((prev) =>
      prev.nameVisit || prev.lastNameVisit ? prev : { ...prev, nameVisit: resolvedVisit.nameVisit, lastNameVisit: resolvedVisit.lastNameVisit }
    );
  }, [resolvedVisit]);

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
    if (!DNI_PATTERN.test(dni)) return;

    let cancelled = false;
    const t = setTimeout(async () => {
      const result = await findVisitsByDni(Number(dni));
      if (!cancelled) setLookup(result.ok && result.data.length > 0 ? result.data[0] : null);
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [formData.dniVisit]);

  const validate = () => {
    const next: FormErrors = {};
    const from = parseLocal(formData.validFrom);
    const to = parseLocal(formData.validTo);

    if (!from) next.validFrom = "Ingresá fecha y hora de inicio.";
    if (!to) next.validTo = "Ingresá fecha y hora de fin.";
    if (from && to && to <= from) next.validTo = "Tiene que ser posterior al inicio.";
    if (to && to <= new Date()) next.validTo = "Tiene que ser una fecha futura.";

    if (!formData.nameVisit.trim()) next.nameVisit = "Ingresá el nombre.";
    if (!formData.lastNameVisit.trim()) next.lastNameVisit = "Ingresá el apellido.";
    if (!DNI_PATTERN.test(formData.dniVisit.trim())) next.dniVisit = "Ingresá un DNI de 7 u 8 números.";
    if (isMaintenance && !formData.orderId) next.orderId = "Seleccioná un servicio.";

    const companions = Number(formData.companionsCount);
    if (!Number.isInteger(companions) || companions < 0 || companions > 20) next.companionsCount = "Ingresá un número entre 0 y 20.";

    if (formData.vehicleType !== VehicleType.OnFoot && !PLATE_PATTERN.test(formData.vehiclePlate.replace(/[\s-]/g, "")))
      next.vehiclePlate = "Ingresá la patente (5 a 10 letras o números).";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const dniNum = Number(formData.dniVisit.trim());
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
      setSubmitError("Tu sesión expiró. Volvé a iniciar sesión.");
      setIsSubmitting(false);
      return;
    }

    const permit = await createPermission({
      permissionType: formData.permissionType,
      description: formData.description.trim() || null,
      validFrom: parseLocal(formData.validFrom)!.toISOString(),
      validTo: parseLocal(formData.validTo)!.toISOString(),
      visitId,
      userId,
      orderId: isMaintenance ? formData.orderId : null,
      companionsCount: Number(formData.companionsCount),
      vehicleType: formData.vehicleType,
      vehiclePlate: formData.vehicleType === VehicleType.OnFoot ? null : formData.vehiclePlate.replace(/[\s-]/g, "").toUpperCase(),
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
    else setSubmitError('El permiso se creó, pero no se pudo cargar el pase. Lo encontrás en "Mis pases".');
    setIsSubmitting(false);
  };

  if (createdPass) {
    return (
      <PageContainer size="narrow" className="flex flex-col items-center gap-6">
        <div className="text-center animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">¡Pase generado!</h1>
          <p className="text-muted-foreground">Descargalo o compartilo con tu visita para que lo presente en la guardia.</p>
        </div>
        <PassCard pass={createdPass} />
        <button
          type="button"
          onClick={() => {
            setCreatedPass(null);
            setFormData(EMPTY_FORM);
            setErrors({});
          }}
          className={secondaryButtonClass}
        >
          Crear otro pase
        </button>
      </PageContainer>
    );
  }

  const refreshMin = () => setMinDateTime(toLocalDateTimeValue(nowRounded()));

  return (
    <PageContainer size="narrow">
      <PageHeader
        icon={<KeyRound size={24} aria-hidden />}
        title="Permiso de ingreso"
        description="Completá los datos de la visita para generar el pase con su código QR."
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-8 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {/* Tipo y vigencia */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Tipo y vigencia</h2>
          <Field label="Tipo de permiso">
            {({ id }) => (
              <Select id={id} value={formData.permissionType} onChange={(e) => setField("permissionType", e.target.value as PermissionType)}>
                <option value={PermissionType.Visit}>Visita</option>
                <option value={PermissionType.Maintenance}>Mantenimiento</option>
              </Select>
            )}
          </Field>

          {isMaintenance && (
            <Field label="Servicio" required error={errors.orderId}>
              {({ id, describedBy, invalid }) => (
                <Select id={id} aria-describedby={describedBy} invalid={invalid} value={formData.orderId} onChange={(e) => setField("orderId", e.target.value)}>
                  <option value="">Seleccioná un servicio…</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {orderTypeLabel(o.orderType)} — {o.supplierName}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Válido desde" required error={errors.validFrom}>
              {({ id, describedBy, invalid }) => (
                <DateTimeInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  min={minDateTime}
                  onFocus={refreshMin}
                  value={formData.validFrom}
                  onChange={(e) => setField("validFrom", e.target.value)}
                />
              )}
            </Field>
            <Field label="Válido hasta" required error={errors.validTo}>
              {({ id, describedBy, invalid }) => (
                <DateTimeInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  min={formData.validFrom || minDateTime}
                  onFocus={refreshMin}
                  value={formData.validTo}
                  onChange={(e) => setField("validTo", e.target.value)}
                />
              )}
            </Field>
          </div>
        </section>

        {/* Visitante */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Visitante</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Field
              label="DNI"
              required
              error={errors.dniVisit}
              hint={resolvedVisit ? (
                <span className="inline-flex items-center gap-1 text-success">
                  <UserCheck size={14} aria-hidden /> Visitante ya registrado
                </span>
              ) : undefined}
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={8}
                  placeholder="30123456"
                  value={formData.dniVisit}
                  onChange={(e) => setField("dniVisit", e.target.value.replace(/\D/g, ""))}
                />
              )}
            </Field>
            <Field label="Nombre" required error={errors.nameVisit}>
              {({ id, describedBy, invalid }) => (
                <Input id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="off" value={formData.nameVisit} onChange={(e) => setField("nameVisit", e.target.value)} />
              )}
            </Field>
            <Field label="Apellido" required error={errors.lastNameVisit}>
              {({ id, describedBy, invalid }) => (
                <Input id={id} aria-describedby={describedBy} invalid={invalid} autoComplete="off" value={formData.lastNameVisit} onChange={(e) => setField("lastNameVisit", e.target.value)} />
              )}
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Acompañantes" error={errors.companionsCount} hint="Entre 0 y 20 personas.">
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  type="number"
                  min={0}
                  max={20}
                  inputMode="numeric"
                  value={formData.companionsCount}
                  onChange={(e) => setField("companionsCount", e.target.value)}
                />
              )}
            </Field>
            <Field label="Tipo de pase">
              {({ id }) => (
                <Select id={id} value={formData.passType} onChange={(e) => setField("passType", e.target.value as PassType)}>
                  <option value={PassType.SingleEntry}>{PASS_TYPE_LABELS.SingleEntry}</option>
                  <option value={PassType.MultipleEntries}>{PASS_TYPE_LABELS.MultipleEntries}</option>
                </Select>
              )}
            </Field>
          </div>
        </section>

        {/* Vehículo */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Cómo llega</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Medio">
              {({ id }) => (
                <Select id={id} value={formData.vehicleType} onChange={(e) => setField("vehicleType", e.target.value as VehicleType)}>
                  <option value={VehicleType.OnFoot}>{VEHICLE_TYPE_LABELS.OnFoot}</option>
                  <option value={VehicleType.Car}>{VEHICLE_TYPE_LABELS.Car}</option>
                  <option value={VehicleType.Motorcycle}>{VEHICLE_TYPE_LABELS.Motorcycle}</option>
                </Select>
              )}
            </Field>

            {formData.vehicleType !== VehicleType.OnFoot && (
              <>
                <Field label="Patente" required error={errors.vehiclePlate}>
                  {({ id, describedBy, invalid }) => (
                    <Input
                      id={id}
                      aria-describedby={describedBy}
                      invalid={invalid}
                      placeholder="AB123CD"
                      maxLength={12}
                      autoComplete="off"
                      className="uppercase"
                      value={formData.vehiclePlate}
                      onChange={(e) => setField("vehiclePlate", e.target.value.toUpperCase())}
                    />
                  )}
                </Field>
                <Field label="Modelo" optional>
                  {({ id }) => (
                    <Input id={id} placeholder="Fiat Cronos" value={formData.vehicleModel} onChange={(e) => setField("vehicleModel", e.target.value)} />
                  )}
                </Field>
              </>
            )}
          </div>

          <Field label="Nota para la guardia" optional>
            {({ id }) => (
              <Textarea id={id} rows={2} maxLength={500} placeholder="Ej.: trae herramientas" value={formData.description} onChange={(e) => setField("description", e.target.value)} />
            )}
          </Field>
        </section>

        <FormError message={submitError} />

        <button type="submit" disabled={isSubmitting} className={`${primaryButtonClass} w-full`}>
          {isSubmitting ? (
            <>
              <Spinner /> Generando pase…
            </>
          ) : (
            "Generar pase"
          )}
        </button>
      </form>
    </PageContainer>
  );
}
