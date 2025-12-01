"use client";
import { IconAvatar, IconLock, IconEye, IconLoading } from "@/app/assets/icon";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginFormulario() {
  const [verContraseña, setVerContraseña] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [googleCargando, setGoogleCargando] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const form = e.target as HTMLFormElement; // 👈 NUEVO
    const formData = new FormData(form); // 👈 NUEVO
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Datos Incorrectos.");
    } else if (result?.ok) {
      router.replace("/");
    }

    setCargando(false);
  }

  return (
    <div className="w-[400px] bg-white rounded-md shadow-md px-8 py-10 flex flex-col items-center border border-gray-200">
      <h2 className="text-2xl font-bold text-center">
        Inicia sesión en tu cuenta
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 w-full">
        {/* Email */}
        <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
        <div className="border border-gray-300 rounded-md bg-white flex items-center px-3 py-2 mb-4">
          <IconAvatar className="w-4 h-4 text-gray-500" />
          <input
            type="email"
            name="email"
            placeholder="tu@email.com"
            className="ml-2 w-full bg-transparent text-sm outline-none"
            required
          />
        </div>

        {/* Contraseña */}
        <label className="text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <div className="border border-gray-300 rounded-md bg-white flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2 w-full">
            <IconLock className="w-4 h-4 text-gray-500" />
            <input
              type={verContraseña ? "text" : "password"}
              name="password"
              placeholder="********"
              className="w-full bg-transparent text-sm outline-none"
              required
            />
          </div>
          <IconEye
            open={verContraseña}
            className="w-4 h-4 text-gray-500 cursor-pointer"
            onClick={() => setVerContraseña(!verContraseña)}
          />
        </div>

        {/* Botón iniciar sesión */}
        <button
          type="submit"
          className="flex justify-center items-center w-full bg-gray-900 text-white font-semibold text-sm py-2 mt-5 rounded-md hover:bg-gray-800 transition hover: cursor-pointer"
          disabled={cargando}
        >
          {cargando ? (
            <IconLoading className="h-5 w-5 animate-spin" />
          ) : (
            "Iniciar Sesión"
          )}
        </button>

        {/* Separador */}
        <div className="flex items-center my-6">
          <hr className="grow border-gray-300" />
          <span className="mx-2 text-gray-400 text-xs">o</span>
          <hr className="grow border-gray-300" />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
