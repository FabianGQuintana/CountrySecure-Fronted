"use client";

import { forwardRef, useId, type ComponentProps, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Kit de formulario del sistema. Todos los formularios usan estas piezas para verse y comportarse
 * igual: label asociado, error accesible, foco visible, modo oscuro y fecha/hora robustas.
 */

const controlBase =
  "block w-full min-w-0 h-11 rounded-xl border bg-card px-3.5 text-sm text-foreground shadow-xs transition-colors " +
  "placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary " +
  "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";

export function controlClass(invalid?: boolean, extra?: string) {
  return cn(controlBase, invalid ? "border-danger focus:ring-danger/30 focus:border-danger" : "border-input", extra);
}

interface FieldProps {
  label: ReactNode;
  /** Error de validación debajo del control */
  error?: string;
  /** Texto de ayuda (se oculta si hay error) */
  hint?: ReactNode;
  required?: boolean;
  optional?: boolean;
  className?: string;
  /** Recibe el id del control y el id de ayuda/error para `aria-describedby` */
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}

/** Label + control + ayuda/error, con los atributos ARIA conectados. */
export function Field({ label, error, hint, required, optional, className, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cn("min-w-0 space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-primary" aria-hidden>*</span>}
        {optional && <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>}
      </label>
      {children({ id, describedBy, invalid: !!error })}
      {error ? (
        <p id={errorId} role="alert" className="flex items-start gap-1.5 text-xs font-medium text-danger">
          <AlertCircle size={14} className="mt-px shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = ComponentProps<"input"> & { invalid?: boolean };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ invalid, className, ...props }, ref) {
  return <input ref={ref} aria-invalid={invalid || undefined} className={controlClass(invalid, className)} {...props} />;
});

type SelectProps = ComponentProps<"select"> & { invalid?: boolean };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ invalid, className, ...props }, ref) {
  return <select ref={ref} aria-invalid={invalid || undefined} className={controlClass(invalid, cn("pr-8", className))} {...props} />;
});

type TextareaProps = ComponentProps<"textarea"> & { invalid?: boolean };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ invalid, className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={controlClass(invalid, cn("h-auto min-h-24 py-2.5 leading-relaxed", className))}
      {...props}
    />
  );
});

/*
 * Fecha y hora: inputs nativos (teclado, accesibilidad y selector del sistema) con alto fijo,
 * ancho mínimo seguro dentro de grillas y `min`/`max` siempre en formato local (ver lib/datetime.ts).
 */
type DateLikeProps = Omit<InputProps, "type">;

export const DateInput = forwardRef<HTMLInputElement, DateLikeProps>(function DateInput({ className, ...props }, ref) {
  return <Input ref={ref} type="date" className={cn("tabular-nums", className)} {...props} />;
});

export const TimeInput = forwardRef<HTMLInputElement, DateLikeProps>(function TimeInput({ className, ...props }, ref) {
  return <Input ref={ref} type="time" step={60} className={cn("tabular-nums", className)} {...props} />;
});

export const DateTimeInput = forwardRef<HTMLInputElement, DateLikeProps>(function DateTimeInput({ className, ...props }, ref) {
  return <Input ref={ref} type="datetime-local" step={60} className={cn("tabular-nums", className)} {...props} />;
});

/** Error general del formulario (respuesta del servidor). */
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-soft p-4 text-sm text-danger">
      <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden />
      <p>{message}</p>
    </div>
  );
}

export const primaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors " +
  "hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors " +
  "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export const dangerButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-danger px-5 text-sm font-semibold text-white transition-colors " +
  "hover:bg-danger/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:cursor-not-allowed disabled:opacity-50";

/** Spinner chico para botones en estado "enviando". */
export function Spinner({ className }: { className?: string }) {
  return <span className={cn("h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent", className)} aria-hidden />;
}
