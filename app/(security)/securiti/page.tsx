"use client";

import { useSession } from "next-auth/react";

export default function SecurityPage() {
  const { data: session, status } = useSession();

  // Mostrar loading mientras se verifica
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Verificando...</p>
      </div>
    );
  }

  // Si no hay sesión o no es Security -> acceso denegado
  if (!session || session.user.role !== "Security") {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600 mb-6">
            {!session
              ? "Debes iniciar sesión para acceder a esta página."
              : "No tienes permisos de seguridad para acceder a esta página."}
          </p>
          <a
            href={!session ? "/auth/login" : "/"}
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            {!session ? "Iniciar Sesión" : "Volver al Inicio"}
          </a>
        </div>
      </div>
    );
  }

  // Si tiene rol Security -> mostrar contenido
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado de bienvenida */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-blue-500">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            👮 Panel de Seguridad
          </h1>
          <p className="text-gray-600">
            Bienvenido,{" "}
            <span className="font-semibold text-blue-600">
              {session.user.name} {session.user.lastname}
            </span>
          </p>
          <div className="mt-2 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            Rol: {session.user.role}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Funciones Disponibles</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <h3 className="font-medium mb-2">📹 Monitoreo de Cámaras</h3>
              <p className="text-sm text-gray-500">Acceso en tiempo real</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <h3 className="font-medium mb-2">👤 Control de Visitantes</h3>
              <p className="text-sm text-gray-500">Registro y autorización</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <h3 className="font-medium mb-2">🚗 Acceso Vehicular</h3>
              <p className="text-sm text-gray-500">
                Entrada y salida de vehículos
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <h3 className="font-medium mb-2">📋 Reportes</h3>
              <p className="text-sm text-gray-500">Generar y ver reportes</p>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="border-t pt-6">
            <h3 className="font-medium mb-3">Tu Información:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Nombre</p>
                <p className="font-medium">{session.user.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Apellido</p>
                <p className="font-medium">{session.user.lastname}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{session.user.email}</p>
              </div>
              <div>
                <p className="text-gray-500">ID de Usuario</p>
                <p className="font-medium">{session.user.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de cerrar sesión */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              // Necesitarás importar signOut de next-auth/react
              // import { signOut } from "next-auth/react";
              // signOut({ callbackUrl: "/" });
            }}
            className="text-red-600 hover:text-red-800 underline"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
