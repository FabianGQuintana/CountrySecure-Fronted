import { Suspense } from "react";
import Image from "next/image";
import heroImage from "@/public/images/countryHero.png";
import LoginFormulario from "./login-form";

export default function Login() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Imagen de fondo */}
      <Image src={heroImage} alt="" fill priority placeholder="blur" sizes="100vw" quality={60} className="object-cover" />

      {/* Overlay difuminado */}
      <div className="absolute inset-0 backdrop-blur-lg bg-black/30" />

      {/* Contenido */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Suspense fallback={null}><LoginFormulario /></Suspense>
      </div>
    </main>
  );
}
