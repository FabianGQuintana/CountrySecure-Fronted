"use client";

import type React from "react";

import { IconAvatar, IconLock, IconEye, IconLoading } from "@/app/assets/icon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

export default function LoginFormulario() {
  const [verContraseña, setVerContraseña] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Datos Incorrectos.");
      setCargando(false);
      return;
    }

    const session = await getSession();

    const rol = session?.user?.role;

    // ⬇️ Redirección según el rol
    if (rol === "Admin") {
      router.replace("/admin/");
    } else if (rol === "Resident") {
      router.replace("/resident/dashboard");
    } else if (rol === "Security") {
      router.replace("/security");
    } else {
      router.replace("/"); // fallback
    }

    setCargando(false);
  }
  return (
    <div
      className="w-full max-w-sm rounded-3xl px-8 py-12 flex flex-col items-center
             bg-white backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
             border border-gray-200 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-purple-200/30 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200/25 to-transparent rounded-full blur-2xl -z-10" />

      <div
        className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-orange-500 
                    flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30"
      >
        <IconLock className="w-8 h-8 text-white" />
      </div>

      <h2
        className="text-3xl font-bold text-center bg-linear-to-r from-purple-600 via-purple-500 to-orange-500 
                   bg-clip-text text-transparent mb-2"
      >
        Inicia sesión
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Ingresa tus credenciales para continuar
      </p>

      <form onSubmit={handleSubmit} className="mt-2 w-full">
        <label className="text-sm font-semibold text-purple-700 mb-2 block">
          Email
        </label>
        <div
          className="border-2 border-purple-200 rounded-xl bg-white/70
                 flex items-center px-4 py-3 mb-5 transition-all duration-300
                 hover:border-purple-300 focus-within:border-purple-500 
                 focus-within:shadow-lg focus-within:shadow-purple-500/20"
        >
          <IconAvatar className="w-5 h-5 text-purple-600" />
          <input
            type="email"
            name="email"
            placeholder="tu@email.com"
            className="ml-3 w-full bg-transparent text-sm outline-none 
                   text-gray-800 placeholder-gray-400"
            required
          />
        </div>

        <label className="text-sm font-semibold text-purple-900 mb-2 block">
          Contraseña
        </label>
        <div
          className="border-2 border-purple-200 rounded-xl bg-white/70
                 flex items-center justify-between px-4 py-3 transition-all duration-300
                 hover:border-purple-300 focus-within:border-purple-500
                 focus-within:shadow-lg focus-within:shadow-purple-500/20"
        >
          <div className="flex items-center gap-3 w-full">
            <IconLock className="w-5 h-5 text-purple-600" />
            <input
              type={verContraseña ? "text" : "password"}
              name="password"
              placeholder="********"
              className="w-full bg-transparent text-sm outline-none 
                     text-gray-800 placeholder-gray-400"
              required
            />
          </div>
          <IconEye
            open={verContraseña}
            className="w-5 h-5 text-purple-500 cursor-pointer hover:text-purple-700 
                     transition-colors duration-200"
            onClick={() => setVerContraseña(!verContraseña)}
          />
        </div>

        <button
          type="submit"
          className="flex justify-center items-center w-full 
                 bg-linear-to-r from-purple-700 to-purple-800 text-white font-semibold text-sm 
                 py-3.5 mt-6 rounded-xl hover:from-purple-700 hover:to-purple-600 
                 transition-all duration-300 cursor-pointer
                 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40
                 hover:scale-[1.02] active:scale-[0.98]
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          disabled={cargando}
        >
          {cargando ? (
            <IconLoading className="h-5 w-5 animate-spin" />
          ) : (
            "Iniciar Sesión"
          )}
        </button>

        <div className="flex items-center my-6">
          <hr className="grow border-gray-200" />
          <span className="mx-3 text-purple-500 text-xs font-medium">o</span>
          <hr className="grow border-gray-200" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mt-4">
            <p className="text-red-600 text-sm text-center font-medium">
              {error}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
