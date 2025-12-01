import Image from "next/image";
import LoginFormulario from "./login-form";

export default async function Login() {
  return (
    <main className="w-screen h-screen flex flex-col md:flex-row">
      {/* Contenedor de la imagen - Oculto en mobile, visible en pantallas medianas/grandes */}
      <div className="hidden md:block relative md:w-1/2 h-1/3 md:h-full overflow-hidden">
        <Image
          src="/images/logoLogin.png"
          alt="Imagen de fondo"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      {/* Contenedor del formulario - Ocupa 100% en mobile, 50% en pantallas grandes */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center p-4">
        <LoginFormulario />
      </div>
    </main>
  );
}
