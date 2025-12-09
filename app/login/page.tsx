import LoginFormulario from "./login-form";

export default function Login() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/countryHero.png)",
        }}
      >
        <div className="absolute inset-0 bg-emerald-800/10 mix-blend-lighten" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <LoginFormulario />
      </div>
    </main>
  );
}
