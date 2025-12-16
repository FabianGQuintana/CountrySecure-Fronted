import LoginFormulario from "./login-form";

export default function Login() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/countryHero.png)",
        }}
      />

      {/* Overlay difuminado */}
      <div className="absolute inset-0 backdrop-blur-lg bg-black/30" />

      {/* Contenido */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <LoginFormulario />
      </div>
    </main>
  );
}
