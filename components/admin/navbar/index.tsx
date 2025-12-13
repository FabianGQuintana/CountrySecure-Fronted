"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Users,
  Home,
  Settings,
  Star,
  LogOut,
  Shield,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function MenuAdmin() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();

  const toggleSubMenu = (menuName: string) => {
    setOpenSubMenu((prev) => (prev === menuName ? null : menuName));
  };

  // Cerrar menú al hacer clic fuera o al cambiar tamaño
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
        setOpenSubMenu(null);
      }
    }

    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setOpenSubMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Mostrar loading mientras se carga la sesión
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no hay sesión, mostrar mensaje
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center bg-linear-to-br from-purple-50 to-indigo-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100 max-w-md">
          <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="text-white" size={28} />
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-4">
            No has iniciado sesión
          </p>
          <p className="text-gray-600 mb-6">
            Inicia sesión para acceder al panel de administración
          </p>
          <Link
            href="/auth/login"
            className="bg-linear-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Botón menú móvil */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        ref={menuRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 h-screen bg-white p-6 flex flex-col justify-between shadow-xl border-r border-gray-200 transform transition-transform duration-300 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Encabezado simple y elegante */}
          <div className="mb-8">
            <div className="mt-4 p-3 rounded-lg">
              <p className="text-sm text-gray-800 font-medium">
                {session.user.name || "Usuario"} {session.user.lastname || ""}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {session.user.email || "usuario@email.com"}
              </p>
            </div>
          </div>

          {/* Menú Items */}
          <div className="space-y-3">
            {/* Usuarios */}
            <div>
              <button
                onClick={() => toggleSubMenu("usuarios")}
                className={`w-full flex justify-between items-center py-3 px-4 rounded-xl transition-all duration-300 ${
                  openSubMenu === "usuarios"
                    ? "bg-linear-to-r from-purple-500 to-indigo-500 text-white shadow-md"
                    : "hover:bg-linear-to-r hover:from-purple-50 hover:to-indigo-50 text-gray-700 hover:text-purple-700 border border-transparent hover:border-purple-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users
                    size={20}
                    className={
                      openSubMenu === "usuarios"
                        ? "text-white"
                        : "text-purple-600"
                    }
                  />
                  <span
                    className={
                      openSubMenu === "usuarios"
                        ? "text-white font-medium"
                        : "text-gray-800 font-medium"
                    }
                  >
                    Usuarios
                  </span>
                </div>
                {openSubMenu === "usuarios" ? (
                  <ChevronUp size={18} className="text-white" />
                ) : (
                  <ChevronDown size={18} className="text-purple-500" />
                )}
              </button>
              {openSubMenu === "usuarios" && (
                <ul className="mt-2 space-y-1 pl-4 animate-fadeIn">
                  <li>
                    <Link
                      href="/admin/users/residentes"
                      className="flex items-center gap-2 text-gray-700 hover:text-purple-700 py-2 px-4 rounded-lg hover:bg-linear-to-r hover:from-purple-50 hover:to-indigo-50 transition-colors ml-2 border-l-2 border-transparent hover:border-purple-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      Residentes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/users/seguridad"
                      className="flex items-center gap-2 text-gray-700 hover:text-purple-700 py-2 px-4 rounded-lg hover:bg-linear-to-r hover:from-purple-50 hover:to-indigo-50 transition-colors ml-2 border-l-2 border-transparent hover:border-purple-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      Personal Seguridad
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Amenities */}
            <div>
              <button
                onClick={() => toggleSubMenu("amenities")}
                className={`w-full flex justify-between items-center py-3 px-4 rounded-xl transition-all duration-300 ${
                  openSubMenu === "amenities"
                    ? "bg-linear-to-r from-fuchsia-500 to-purple-500 text-white shadow-md"
                    : "hover:bg-linear-to-r hover:from-fuchsia-50 hover:to-purple-50 text-gray-700 hover:text-fuchsia-700 border border-transparent hover:border-fuchsia-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Star
                    size={20}
                    className={
                      openSubMenu === "amenities"
                        ? "text-white"
                        : "text-fuchsia-600"
                    }
                  />
                  <span
                    className={
                      openSubMenu === "amenities"
                        ? "text-white font-medium"
                        : "text-gray-800 font-medium"
                    }
                  >
                    Amenities
                  </span>
                </div>
                {openSubMenu === "amenities" ? (
                  <ChevronUp size={18} className="text-white" />
                ) : (
                  <ChevronDown size={18} className="text-fuchsia-500" />
                )}
              </button>
              {openSubMenu === "amenities" && (
                <ul className="mt-2 space-y-1 pl-4 animate-fadeIn">
                  <li>
                    <Link
                      href="/admin/amenities"
                      className="flex items-center gap-2 text-gray-700 hover:text-fuchsia-700 py-2 px-4 rounded-lg hover:bg-linear-to-r hover:from-fuchsia-50 hover:to-purple-50 transition-colors ml-2 border-l-2 border-transparent hover:border-fuchsia-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full"></div>
                      Amenities
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/usuarios"
                      className="flex items-center gap-2 text-gray-700 hover:text-fuchsia-700 py-2 px-4 rounded-lg hover:bg-linear-to-r hover:from-fuchsia-50 hover:to-purple-50 transition-colors ml-2 border-l-2 border-transparent hover:border-fuchsia-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full"></div>
                      Solicitudes
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Servicios */}
            <div>
              <button
                onClick={() => toggleSubMenu("servicios")}
                className={`w-full flex justify-between items-center py-3 px-4 rounded-xl transition-all duration-300 ${
                  openSubMenu === "servicios"
                    ? "bg-linear-to-r from-violet-500 to-purple-600 text-white shadow-md"
                    : "hover:bg-linear-to-r hover:from-violet-50 hover:to-purple-50 text-gray-700 hover:text-violet-700 border border-transparent hover:border-violet-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings
                    size={20}
                    className={
                      openSubMenu === "servicios"
                        ? "text-white"
                        : "text-violet-600"
                    }
                  />
                  <span
                    className={
                      openSubMenu === "servicios"
                        ? "text-white font-medium"
                        : "text-gray-800 font-medium"
                    }
                  >
                    Servicios
                  </span>
                </div>
                {openSubMenu === "servicios" ? (
                  <ChevronUp size={18} className="text-white" />
                ) : (
                  <ChevronDown size={18} className="text-violet-500" />
                )}
              </button>
              {openSubMenu === "servicios" && (
                <ul className="mt-2 space-y-1 pl-4 animate-fadeIn">
                  <li>
                    <Link
                      href="/admin/orders"
                      className="flex items-center gap-2 text-gray-700 hover:text-violet-700 py-2 px-4 rounded-lg hover:bg-linear-to-r hover:from-violet-50 hover:to-purple-50 transition-colors ml-2 border-l-2 border-transparent hover:border-violet-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-1.5 h-1.5 bg-violet-400 rounded-full"></div>
                      Proveedores
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/usuarios"
                      className="flex items-center gap-2 text-gray-700 hover:text-violet-700 py-2 px-4 rounded-lg hover:bg-linear-to-r hover:from-violet-50 hover:to-purple-50 transition-colors ml-2 border-l-2 border-transparent hover:border-violet-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-1.5 h-1.5 bg-violet-400 rounded-full"></div>
                      Solicitudes
                    </Link>
                  </li>
                </ul>
              )}
            </div>
            {/* Propiedad */}
            <div>
              <button
                onClick={() => toggleSubMenu("propiedad")}
                className={`w-full flex justify-between items-center py-3 px-4 rounded-xl transition-all duration-300 ${
                  openSubMenu === "propiedad"
                    ? "bg-linear-to-r from-violet-500 to-purple-600 text-white shadow-md"
                    : "hover:bg-linear-to-r hover:from-violet-50 hover:to-purple-50 text-gray-700 hover:text-violet-700 border border-transparent hover:border-violet-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home
                    size={20}
                    className={
                      openSubMenu === "propiedad"
                        ? "text-white"
                        : "text-violet-600"
                    }
                  />
                  <span
                    className={
                      openSubMenu === "propiedad"
                        ? "text-white font-medium"
                        : "text-gray-800 font-medium"
                    }
                  >
                    Propiedad
                  </span>
                </div>
                {openSubMenu === "propiedad" ? (
                  <ChevronUp size={18} className="text-white" />
                ) : (
                  <ChevronDown size={18} className="text-violet-500" />
                )}
              </button>

              {openSubMenu === "propiedad" && (
                <ul className="mt-2 space-y-1 pl-4 animate-fadeIn">
                  <li>
                    <Link
                      href="/admin/propiedades"
                      className="flex items-center gap-2 text-gray-700 hover:text-violet-700 py-2 px-4 rounded-lg hover:bg-linear-to-r hover:from-violet-50 hover:to-purple-50 transition-colors ml-2 border-l-2 border-transparent hover:border-violet-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-1.5 h-1.5 bg-violet-400 rounded-full"></div>
                      Propiedades
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/admin/lotes"
                      className="flex items-center gap-2 text-gray-700 hover:text-violet-700 py-2 px-4 rounded-lg hover:bg-linear-to-r hover:from-violet-50 hover:to-purple-50 transition-colors ml-2 border-l-2 border-transparent hover:border-violet-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-1.5 h-1.5 bg-violet-400 rounded-full"></div>
                      Lotes
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Pie: cerrar sesión */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <button
            className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl bg-linear-to-r from-gray-50 to-white text-gray-700 hover:text-red-600 hover:bg-linear-to-r hover:from-red-50 hover:to-red-50 transition-all duration-300 border border-gray-100 hover:border-red-100 shadow-sm hover:shadow-md font-medium"
            onClick={() => signOut()}
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Overlay móvil */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Estilos para animación */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
