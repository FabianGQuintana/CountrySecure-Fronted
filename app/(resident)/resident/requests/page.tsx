"use client";

import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { MapPin, Plus, Wrench, X } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Field, FormError, Input, Select, Spinner, Textarea, primaryButtonClass, secondaryButtonClass } from "@/components/ui/form";
import { cancelRequest, createRequest, listMyRequests } from "@/features/requests/actions";
import { requestStatusOf } from "@/features/requests/status";
import { listOrders } from "@/features/orders/actions";
import { orderTypeLabel } from "@/types/api";
import type { OrderDto, RequestDto } from "@/types/models";

interface FormState {
  orderId: string;
  details: string;
  location: string;
}
type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = { orderId: "", details: "", location: "" };

// Mismas reglas que CreateRequestValidator del backend
function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.orderId) errors.orderId = "Elegí el servicio que necesitás.";
  const details = form.details.trim();
  if (details.length < 5) errors.details = "Contanos un poco más del problema (mínimo 5 caracteres).";
  else if (details.length > 500) errors.details = "Máximo 500 caracteres.";
  if (!form.location.trim()) errors.location = "Indicá dónde hay que hacer el trabajo.";
  return errors;
}

export default function ResidentRequestsPage() {
  const [requests, setRequests] = useState<RequestDto[]>([]);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirm, confirmDialog] = useConfirm();

  const load = useCallback(async () => {
    const [mine, services] = await Promise.all([listMyRequests(), listOrders()]);

    if (mine.ok) {
      // Las más recientes primero
      setRequests([...mine.data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setError(null);
    } else {
      setError(mine.error);
    }

    if (services.ok) setOrders(services.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos
    load();
  }, [load]);

  const setField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(EMPTY);
    setErrors({});
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    const result = await createRequest({ orderId: form.orderId, details: form.details.trim(), location: form.location.trim() });
    setSaving(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    toast.success("Solicitud enviada. La administración la va a revisar.");
    closeForm();
    await load();
  };

  const handleCancel = async (r: RequestDto) => {
    const ok = await confirm({
      title: "¿Cancelar la solicitud?",
      message: `${r.order?.supplierName ?? "Servicio"}: “${r.details}”`,
      confirmLabel: "Cancelar solicitud",
      danger: true,
    });
    if (!ok) return;
    const result = await cancelRequest(r.id);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Solicitud cancelada.");
    await load();
  };

  return (
    <PageContainer>
      {confirmDialog}
      <PageHeader
        icon={<Wrench size={24} aria-hidden />}
        title="Solicitudes"
        description="Pedí servicios de mantenimiento y seguí su estado."
        actions={
          <button type="button" onClick={() => (showForm ? closeForm() : setShowForm(true))} className={showForm ? secondaryButtonClass : primaryButtonClass}>
            {showForm ? <X size={18} aria-hidden /> : <Plus size={18} aria-hidden />}
            {showForm ? "Cerrar" : "Nueva solicitud"}
          </button>
        }
      />

      {showForm && (
        <form onSubmit={handleSubmit} noValidate className="mb-8 space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm animate-fade-in">
          <Field label="Servicio" required error={errors.orderId}>
            {({ id, describedBy, invalid }) => (
              <Select id={id} aria-describedby={describedBy} invalid={invalid} value={form.orderId} onChange={(e) => setField("orderId", e.target.value)}>
                <option value="">Seleccioná un servicio…</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {orderTypeLabel(o.orderType)} · {o.supplierName}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Detalle" required error={errors.details} hint={`${form.details.trim().length}/500`}>
            {({ id, describedBy, invalid }) => (
              <Textarea
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                rows={3}
                maxLength={500}
                placeholder="Ej.: pérdida de agua en la cocina"
                value={form.details}
                onChange={(e) => setField("details", e.target.value)}
              />
            )}
          </Field>
          <Field label="Ubicación" required error={errors.location}>
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                maxLength={300}
                placeholder="Ej.: Lote 12, cocina"
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
              />
            )}
          </Field>
          <FormError message={submitError} />
          <button type="submit" disabled={saving} className={primaryButtonClass}>
            {saving ? (
              <>
                <Spinner /> Enviando…
              </>
            ) : (
              "Enviar solicitud"
            )}
          </button>
        </form>
      )}

      {loading && <p className="animate-pulse text-muted-foreground">Cargando solicitudes…</p>}
      {error && <ErrorState title="No se pudieron cargar tus solicitudes" message={error} />}

      {!loading && !error && requests.length === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card">
          <EmptyState message="Todavía no hiciste ninguna solicitud." />
        </div>
      )}

      <ul className="grid gap-4">
        {requests.map((r) => {
          const status = requestStatusOf(r);
          const canCancel = r.baseEntityStatus !== "Inactive" && r.status === "Pending";
          return (
            <li key={r.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center animate-fade-in">
              <div className="flex min-w-0 items-start gap-4">
                <div className="rounded-xl bg-primary-soft p-3 text-primary">
                  <Wrench size={20} aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{r.order?.supplierName ?? "Servicio"}</p>
                  <p className="break-words text-sm text-muted-foreground">{r.details}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={12} aria-hidden /> {r.location} ·{" "}
                    {new Date(r.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                {canCancel && (
                  <button type="button" onClick={() => handleCancel(r)} className="text-sm font-medium text-danger hover:underline">
                    Cancelar
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </PageContainer>
  );
}
