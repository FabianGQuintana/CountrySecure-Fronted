import Image from "next/image";
import type { ReactNode } from "react";
import heroImage from "@/public/images/countryHero.png";

/** Fondo y tarjeta de las pantallas sin sesión (recuperar y restablecer contraseña), igual que el login. */
export function AuthCard({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Image src={heroImage} alt="" fill priority placeholder="blur" sizes="100vw" quality={60} className="object-cover" />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-lg" />

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <section className="w-full max-w-sm rounded-3xl border border-border bg-card px-8 py-10 text-card-foreground shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            {icon}
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold text-foreground">{title}</h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">{description}</p>
          {children}
        </section>
      </div>
    </main>
  );
}
