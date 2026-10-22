import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { primaryButtonClass } from "@/components/ui/form";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = { title: "Nueva contraseña · CountrySecure" };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  return (
    <AuthCard
      icon={<KeyRound className="h-8 w-8" aria-hidden />}
      title="Elegí una nueva contraseña"
      description="Por seguridad, al cambiarla se cierran las sesiones abiertas en otros dispositivos."
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="space-y-5 text-center">
          <p className="text-sm text-danger">El enlace no es válido. Pedí uno nuevo para restablecer tu contraseña.</p>
          <Link href="/forgot-password" className={`${primaryButtonClass} w-full`}>
            Pedir un enlace nuevo
          </Link>
        </div>
      )}
    </AuthCard>
  );
}
