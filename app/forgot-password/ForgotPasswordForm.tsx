"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Field, FormError, Input, Spinner, primaryButtonClass } from "@/components/ui/form";
import { requestPasswordReset } from "@/features/auth/password-reset";

const schema = z.object({
  email: z.string().trim().min(1, "Ingresá tu email").email("Ingresá un email válido"),
});
type Values = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = async ({ email }: Values) => {
    const result = await requestPasswordReset(email);
    if (!result.ok) {
      setError("root", { message: result.error });
      return;
    }
    setSentTo(email);
  };

  if (sentTo) {
    return (
      <div className="space-y-6">
        <div role="status" className="flex items-start gap-3 rounded-xl border border-success/30 bg-success-soft p-4 text-sm text-success">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden />
          <p>
            Si <strong className="break-all">{sentTo}</strong> corresponde a una cuenta, te enviamos un enlace para restablecer la
            contraseña. Vence en 30 minutos. Revisá también la carpeta de spam.
          </p>
        </div>
        <BackToLogin />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field label="Email" required error={errors.email?.message}>
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            autoFocus
            aria-describedby={describedBy}
            invalid={invalid}
            {...register("email")}
          />
        )}
      </Field>

      <FormError message={errors.root?.message} />

      <button type="submit" disabled={isSubmitting} className={`${primaryButtonClass} w-full`}>
        {isSubmitting ? (
          <>
            <Spinner /> Enviando…
          </>
        ) : (
          "Enviar enlace"
        )}
      </button>

      <BackToLogin />
    </form>
  );
}

function BackToLogin() {
  return (
    <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline">
      <ArrowLeft size={16} aria-hidden /> Volver a iniciar sesión
    </Link>
  );
}
