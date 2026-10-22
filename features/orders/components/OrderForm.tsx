"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError } from "@/components/ui/FieldError";
import { OrderStatus, orderTypeLabel } from "@/types/api";
import { orderSchema, type OrderFormValues, type OrderInput } from "../schemas";

const inputClass =
  "w-full border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed";
const labelClass = "block text-sm font-medium text-foreground mb-1";

interface OrderFormProps {
  defaultValues?: OrderFormValues;
  submitLabel: string;
  submittingLabel: string;
  disabled?: boolean;
  onSubmit: (values: OrderInput) => Promise<{ ok: true } | { ok: false; error: string }>;
  onCancel?: () => void;
}

/** Formulario de servicio (alta y edición) con validación Zod compartida con el backend. */
export function OrderForm({ defaultValues, submitLabel, submittingLabel, disabled, onSubmit, onCancel }: OrderFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<OrderFormValues, unknown, OrderInput>({
    resolver: zodResolver(orderSchema),
    defaultValues: defaultValues ?? { supplierName: "", description: "", orderType: undefined },
  });

  const submit = async (values: OrderInput) => {
    const result = await onSubmit(values);
    if (!result.ok) setError("root", { message: result.error });
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="supplierName" className={labelClass}>Proveedor</label>
        <input id="supplierName" className={inputClass} disabled={disabled} {...register("supplierName")} />
        <FieldError message={errors.supplierName?.message} />
      </div>

      <div>
        <label htmlFor="orderType" className={labelClass}>Tipo de servicio</label>
        <select id="orderType" className={inputClass} disabled={disabled} {...register("orderType")}>
          <option value="">Seleccioná un tipo...</option>
          {Object.values(OrderStatus).map((value) => (
            <option key={value} value={value}>{orderTypeLabel(value)}</option>
          ))}
        </select>
        <FieldError message={errors.orderType?.message} />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>Descripción</label>
        <textarea id="description" rows={3} className={inputClass} disabled={disabled} {...register("description")} />
        <FieldError message={errors.description?.message} />
      </div>

      {errors.root?.message && (
        <p role="alert" className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg p-3">
          {errors.root.message}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted">
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || disabled || !isDirty}
          className="px-5 py-2.5 rounded-lg text-white font-medium hover:shadow-lg disabled:opacity-50 bg-primary"
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
