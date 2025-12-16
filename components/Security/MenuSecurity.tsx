
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  CalendarCheck,
  ClipboardList,
  LogOut,
  Shield,
  Wrench ,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function MenuSecurity() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();

  // Cerrar menú al hacer clic fuera o al cambiar tamaño
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }

    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Loading sesión
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-purple-600 font-medium">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  // Sin sesión
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
            Inicia sesión para acceder al panel de seguridad
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
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
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
          {/* Usuario */}
          <div className="mb-8">
            <p className="text-sm text-gray-800 font-medium">
              {session.user.name || "Usuario"}
            </p>
            <p className="text-xs text-gray-600">
              {session.user.email}
            </p>
          </div>

          {/* Menú */}
          <nav className="space-y-3">
            <Link
              href="/security/dashboard"
              className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
            >
              <LayoutDashboard size={20} className="text-purple-600" />
              Dashboard
            </Link>

            <Link
              href="/security/visit"
              className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 transition"
            >
              <CalendarCheck size={20} className="text-indigo-600" />
              Visitas de Hoy
            </Link>

            <Link
              href="/security/logs"
              className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-700 hover:text-violet-700 hover:bg-violet-50 transition"
            >
              <ClipboardList size={20} className="text-violet-600" />
              Registro de Entradas
            </Link>

            <Link
              href="/security/services"
              className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition"
            >
              <Wrench  size={20} className="text-purple-600" />
              Servicios
            </Link>

          </nav>
        </div>

        {/* Cerrar sesión */}
        <button
          className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl text-gray-700 hover:text-red-600 hover:bg-red-50 transition border"
          onClick={() => signOut()}
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>

      {/* Overlay móvil */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
