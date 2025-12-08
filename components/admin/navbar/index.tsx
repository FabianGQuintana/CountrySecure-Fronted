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
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function MenuAdmin() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const toggleSubMenu = (menuName: string) => {
    setOpenSubMenu((prev) => (prev === menuName ? null : menuName));
  };

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

  return (
    <>
      {/* Botón menú móvil */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}{" "}
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
          <h1 className="text-2xl text-gray-800 font-bold mb-6 flex justify-center">
            Panel Admin
          </h1>

          {/* Menú Items */}
          <div className="space-y-4">
            {/* Usuarios */}
            <div>
              <button
                onClick={() => toggleSubMenu("usuarios")}
                className={`w-full flex justify-between items-center py-2 px-4 rounded-lg transition-colors ${
                  openSubMenu === "usuarios"
                    ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-md"
                    : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users
                    size={20}
                    className={
                      openSubMenu === "usuarios"
                        ? "text-white drop-shadow-md"
                        : "text-gray-600"
                    }
                  />
                  <span
                    className={
                      openSubMenu === "usuarios"
                        ? "text-white"
                        : "text-gray-800"
                    }
                  >
                    Usuarios
                  </span>
                </div>
                {openSubMenu === "usuarios" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              {openSubMenu === "usuarios" && (
                <ul className="mt-2 space-y-1 pl-6">
                  <li>
                    <Link
                      href="/admin/users/residentes"
                      className="block text-gray-700 hover:text-gray-900 py-1 px-3 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Residentes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/users/seguridad"
                      className="block text-gray-700 hover:text-gray-900 py-1 px-3 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
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
                className={`w-full flex justify-between items-center py-2 px-4 rounded-lg transition-colors ${
                  openSubMenu === "amenities"
                    ? "bg-linear-to-r from-emerald-400 to-teal-400 text-white shadow-md"
                    : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home
                    size={20}
                    className={
                      openSubMenu === "amenities"
                        ? "text-white drop-shadow-md"
                        : "text-gray-600"
                    }
                  />
                  <span
                    className={
                      openSubMenu === "amenities"
                        ? "text-white"
                        : "text-gray-800"
                    }
                  >
                    Amenities
                  </span>
                </div>
                {openSubMenu === "amenities" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              {openSubMenu === "amenities" && (
                <ul className="mt-2 space-y-1 pl-6">
                  <li>
                    <Link
                      href="/admin/amenities/"
                      className="block text-gray-700 hover:text-gray-900 py-1 px-3 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Amenities
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/usuarios"
                      className="block text-gray-700 hover:text-gray-900 py-1 px-3 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Solicitar turno
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Servicios */}
            <div>
              <button
                onClick={() => toggleSubMenu("servicios")}
                className={`w-full flex justify-between items-center py-2 px-4 rounded-lg transition-colors ${
                  openSubMenu === "servicios"
                    ? "bg-linear-to-r from-amber-400 to-orange-400 text-white shadow-md"
                    : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings
                    size={20}
                    className={
                      openSubMenu === "servicios"
                        ? "text-white drop-shadow-md"
                        : "text-gray-600"
                    }
                  />
                  <span
                    className={
                      openSubMenu === "servicios"
                        ? "text-white"
                        : "text-gray-800"
                    }
                  >
                    Servicios
                  </span>
                </div>
                {openSubMenu === "servicios" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              {openSubMenu === "servicios" && (
                <ul className="mt-2 space-y-1 pl-6">
                  <li>
                    <Link
                      href="/admin/usuarios"
                      className="block text-gray-700 hover:text-gray-900 py-1 px-3 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mis solicitudes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/usuarios"
                      className="block text-gray-700 hover:text-gray-900 py-1 px-3 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Solicitar Servicio
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Pie: cerrar sesión */}
        <div className="mt-6">
          <button className="w-full py-2 px-4 rounded-lg bg-linear-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all">
            Cerrar sesión
          </button>
        </div>
      </div>
      {/* Overlay móvil */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
