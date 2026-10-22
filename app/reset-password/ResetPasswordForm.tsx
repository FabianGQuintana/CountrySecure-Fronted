"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, CheckCircle2, Eye, EyeOff, X } from "lucide-react";
import { Field, FormError, Input, Spinner, primaryButtonClass } from "@/components/ui/form";
import { resetPassword } from "@/features/auth/password-reset";
import { passwordRules } from "@/features/users/schemas";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, "Confirmá la nueva contraseña"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { path: ["confirmPassword"], message: "Las contraseñas no coinciden" });
type Values = z.infer<typeof schema>;

const FIELDS = [
  { name: "newPassword", label: "Nueva contraseña" },
  { name: "confirmPassword", label: "Repetí la nueva contraseña" },
] as const;

export function ResetPasswordForm({ token }: { token: string }) {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);
  const [expired, setExpired] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { newPassword: "", confirmPassword: "" } });
  const [newPassword, confirmPassword] = useWatch({ control, name: ["newPassword", "confirmPassword"] });

  const onSubmit = async (values: Values) => {
    const result = await resetPassword(token, values.newPassword);
    if (!result.ok) {
      setExpired(result.error.includes("enlace"));
      setError("root", { message: result.error });
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="space-y-6">
        <div role="status" className="flex items-start gap-3 rounded-xl border border-success/30 bg-success-soft p-4 text-sm text-success">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden />
          <p>Tu contraseña se actualizó. Ya podés iniciar sesión con la nueva.</p>
        </div>
        <Link href="/login" className={`${primaryButtonClass} w-full`}>
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  // Mismas reglas que el backend (ResetPasswordValidator)
  const requirements = [
    { text: "Mínimo 8 caracteres", met: newPassword.length >= 8 },
    { text: "Mayúscula y minúscula", met: /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) },
    { text: "Al menos un número", met: /[0-9]/.test(newPassword) },
    { text: "Las contraseñas coinciden", met: newPassword.length > 0 && newPassword === confirmPassword },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {FIELDS.map(({ name, label }) => (
        <Field key={name} label={label} required error={errors[name]?.message}>
          {({ id, describedBy, invalid }) => (
            <div className="relative">
              <Input
                id={id}
                type={visible ? "text" : "password"}
                autoComplete="new-password"
                aria-describedby={describedBy}
                invalid={invalid}
                className="pr-11"
                {...register(name)}
              />
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Ocultar contraseñas" : "Mostrar contraseñas"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
              </button>
            </div>
          )}
        </Field>
      ))}

      <ul className="grid gap-1.5 rounded-2xl bg-muted/60 p-4 text-sm" aria-label="Requisitos de la nueva contraseña">
        {requirements.map((r) => (
          <li key={r.text} className={cn("flex items-center gap-2", r.met ? "text-success" : "text-muted-foreground")}>
            {r.met ? <Check size={16} aria-hidden /> : <X size={16} aria-hidden />}
            {r.text}
          </li>
        ))}
      </ul>

      <FormError message={errors.root?.message} />
      {expired && (
        <Link href="/forgot-password" className="block text-center text-sm font-medium text-primary hover:underline">
          Pedir un enlace nuevo
        </Link>
      )}

      <button type="submit" disabled={isSubmitting} className={`${primaryButtonClass} w-full`}>
        {isSubmitting ? (
          <>
            <Spinner /> Guardando…
          </>
        ) : (
          "Guardar nueva contraseña"
        )}
      </button>
    </form>
  );
}
