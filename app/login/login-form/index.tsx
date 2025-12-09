// "use client";
// import { IconAvatar, IconLock, IconEye, IconLoading } from "@/app/assets/icon";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";

// export default function LoginFormulario() {
//   const [verContraseña, setVerContraseña] = useState(false);
//   const [cargando, setCargando] = useState(false);
//   const [error, setError] = useState("");

//   const router = useRouter();

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setError("");
//     setCargando(true);

//     const form = e.target as HTMLFormElement;
//     const formData = new FormData(form);
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;

//     const result = await signIn("credentials", {
//       redirect: false,
//       email,
//       password,
//     });

//     if (result?.error) {
//       setError("Datos Incorrectos.");
//     } else if (result?.ok) {
//       router.replace("/");
//     }

//     setCargando(false);
//   }

"use client";

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
      router.replace("/resident/");
    } else if (rol === "Security") {
      router.replace("/securiti");
    } else {
      router.replace("/"); // fallback
    }

    setCargando(false);
  }
  return (
    <div
      className="w-full max-w-sm rounded-2xl px-8 py-10 flex flex-col items-center
             bg-white/50 shadow-2xl border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-center text-emerald-800">
        Inicia sesión
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 w-full">
        <label className="text-sm font-semibold text-gray-700 mb-1">
          Email
        </label>
        <div
          className="border border-gray-300 rounded-md bg-gray-50 
                 flex items-center px-3 py-2 mb-4"
        >
          <IconAvatar className="w-4 h-4 text-gray-600" />
          <input
            type="email"
            name="email"
            placeholder="tu@email.com"
            className="ml-2 w-full bg-transparent text-sm outline-none 
                   text-gray-800 placeholder-gray-500"
            required
          />
        </div>

        <label className="text-sm font-semibold text-gray-700 mb-1">
          Contraseña
        </label>
        <div
          className="border border-gray-300 rounded-md bg-gray-50 
                 flex items-center justify-between px-3 py-2"
        >
          <div className="flex items-center gap-2 w-full">
            <IconLock className="w-4 h-4 text-gray-600" />
            <input
              type={verContraseña ? "text" : "password"}
              name="password"
              placeholder="********"
              className="w-full bg-transparent text-sm outline-none 
                     text-gray-800 placeholder-gray-500"
              required
            />
          </div>
          <IconEye
            open={verContraseña}
            className="w-4 h-4 text-gray-600 cursor-pointer"
            onClick={() => setVerContraseña(!verContraseña)}
          />
        </div>

        {/* Botón iniciar sesión */}
        <button
          type="submit"
          className="flex justify-center items-center w-full 
                 bg-emerald-700 text-white font-semibold text-sm 
                 py-2 mt-5 rounded-md hover:bg-emerald-800 
                 transition cursor-pointer"
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
          <span className="mx-2 text-gray-500 text-xs">o</span>
          <hr className="grow border-gray-300" />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-xs mt-2 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
