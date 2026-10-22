"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError } from "@/components/ui/FieldError";
import { formInputClass, formLabelClass, primaryButtonClass, secondaryButtonClass } from "@/components/ui/Modal";
import { amenitySchema, type AmenityFormOutput, type AmenityFormValues } from "../schemas";

interface Props {
  defaultValues?: AmenityFormValues;
  submitLabel: string;
  submittingLabel: string;
  disabled?: boolean;
  onSubmit: (values: AmenityFormOutput) => Promise<{ ok: true } | { ok: false; error: string }>;
  onCancel?: () => void;
}

export function AmenityForm({ defaultValues, submitLabel, submittingLabel, disabled, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AmenityFormValues, unknown, AmenityFormOutput>({
    resolver: zodResolver(amenitySchema),
    defaultValues: defaultValues ?? { amenityName: "", description: "", schedules: "", capacity: "" },
  });

  const submit = async (values: AmenityFormOutput) => {
    const result = await onSubmit(values);
    if (!result.ok) setError("root", { message: result.error });
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="amenityName" className={formLabelClass}>Nombre</label>
        <input id="amenityName" className={formInputClass} disabled={disabled} {...register("amenityName")} />
        <FieldError message={errors.amenityName?.message} />
      </div>
      <div>
        <label htmlFor="description" className={formLabelClass}>Descripción</label>
        <textarea id="description" rows={3} className={formInputClass} disabled={disabled} {...register("description")} />
        <FieldError message={errors.description?.message} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="schedules" className={formLabelClass}>Horarios</label>
          <input id="schedules" placeholder="Ej.: Lun a Dom de 9 a 22" className={formInputClass} disabled={disabled} {...register("schedules")} />
          <FieldError message={errors.schedules?.message} />
        </div>
        <div>
          <label htmlFor="capacity" className={formLabelClass}>Capacidad (reservas simultáneas)</label>
          <input id="capacity" inputMode="numeric" className={formInputClass} disabled={disabled} {...register("capacity")} />
          <FieldError message={errors.capacity?.message} />
        </div>
      </div>

      {errors.root?.message && (
        <p role="alert" className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg p-3">
          {errors.root.message}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className={secondaryButtonClass}>
            Cancelar
          </button>
        )}
        <button type="submit" disabled={isSubmitting || disabled || !isDirty} className={primaryButtonClass}>
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
