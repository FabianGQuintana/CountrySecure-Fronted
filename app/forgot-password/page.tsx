import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = { title: "Recuperar contraseña · CountrySecure" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      icon={<Mail className="h-8 w-8" aria-hidden />}
      title="¿Olvidaste tu contraseña?"
      description="Ingresá el email de tu cuenta y te enviamos un enlace para elegir una nueva."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
