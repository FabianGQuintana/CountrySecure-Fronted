"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, CheckCircle2, Eye, EyeOff, KeyRound, X } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { Field, FormError, Input, Spinner, primaryButtonClass, secondaryButtonClass } from "@/components/ui/form";
import { changePassword } from "@/features/users/actions";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/features/users/schemas";
import { cn } from "@/lib/utils";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

const LABELS: Record<PasswordField, string> = {
  currentPassword: "Contraseña actual",
  newPassword: "Nueva contraseña",
  confirmPassword: "Repetí la nueva contraseña",
};

const AUTOCOMPLETE: Record<PasswordField, string> = {
  currentPassword: "current-password",
  newPassword: "new-password",
  confirmPassword: "new-password",
};

export default function ChangePasswordPage() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const [visible, setVisible] = useState<Record<PasswordField, boolean>>({ currentPassword: false, newPassword: false, confirmPassword: false });
  const [success, setSuccess] = useState(false);
  const [newPassword, confirmPassword] = useWatch({ control, name: ["newPassword", "confirmPassword"] });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setSuccess(false);
    const result = await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
    if (!result.ok) {
      setError("root", { message: result.error });
      return;
    }
    setSuccess(true);
    reset();
  };

  // Mismas reglas que el backend (ChangePasswordValidator)
  const requirements = [
    { text: "Mínimo 8 caracteres", met: newPassword.length >= 8 },
    { text: "Una mayúscula y una minúscula", met: /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) },
    { text: "Al menos un número", met: /[0-9]/.test(newPassword) },
    { text: "Las contraseñas coinciden", met: newPassword.length > 0 && newPassword === confirmPassword },
  ];

  return (
    <PageContainer size="narrow">
      <PageHeader
        icon={<KeyRound size={24} aria-hidden />}
        title="Cambiar contraseña"
        description="Por seguridad, te pedimos tu contraseña actual."
        actions={
          <Link href="/resident/profile" className={secondaryButtonClass}>
            <ArrowLeft size={18} aria-hidden /> Volver
          </Link>
        }
      />

      {success && (
        <div role="status" className="mb-6 flex items-start gap-3 rounded-xl border border-success/30 bg-success-soft p-4 text-sm text-success animate-fade-in">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden />
          <p>Tu contraseña se actualizó. La próxima vez que inicies sesión usá la nueva.</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {(Object.keys(LABELS) as PasswordField[]).map((name) => (
          <Field key={name} label={LABELS[name]} required error={errors[name]?.message}>
            {({ id, describedBy, invalid }) => (
              <div className="relative">
                <Input
                  id={id}
                  type={visible[name] ? "text" : "password"}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete={AUTOCOMPLETE[name]}
                  className="pr-11"
                  {...register(name)}
                />
                <button
                  type="button"
                  onClick={() => setVisible((v) => ({ ...v, [name]: !v[name] }))}
                  aria-label={visible[name] ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {visible[name] ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
                </button>
              </div>
            )}
          </Field>
        ))}

        <ul className="grid gap-2 rounded-2xl bg-muted/60 p-4 text-sm sm:grid-cols-2" aria-label="Requisitos de la nueva contraseña">
          {requirements.map((r) => (
            <li key={r.text} className={cn("flex items-center gap-2", r.met ? "text-success" : "text-muted-foreground")}>
              {r.met ? <Check size={16} aria-hidden /> : <X size={16} aria-hidden />}
              {r.text}
            </li>
          ))}
        </ul>

        <FormError message={errors.root?.message} />

        <button type="submit" disabled={isSubmitting} className={`${primaryButtonClass} w-full`}>
          {isSubmitting ? (
            <>
              <Spinner /> Actualizando…
            </>
          ) : (
            "Actualizar contraseña"
          )}
        </button>
      </form>
    </PageContainer>
  );
}
