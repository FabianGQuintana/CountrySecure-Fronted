"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
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

  if (status === "loading") {
    return null;
  }

  if (!session) {
    return null;
  }

  return (
    <>
      {/* Botón menú móvil */}
      {!isMobileMenuOpen && (
  <button
    onClick={() => setIsMobileMenuOpen(true)}
    className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl 
              bg-gradient-to-r from-purple-600 to-indigo-600 
              text-white shadow-lg"
    aria-label="Abrir menú"
  >
    <Menu size={22} />
  </button>
)}

      {/* Sidebar */}
      <aside
        ref={menuRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 h-screen bg-slate-900 text-gray-300
        border-r border-purple-500/20 shadow-xl
        transform transition-transform duration-300
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full justify-between p-6">
          {/* ===== USER HEADER ===== */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xl shadow-lg">
                🛡️
              </div>

              <div className="leading-tight">
                <p className="text-white font-semibold">
                  {session.user.name || "Administrador"}
                </p>
                <p className="text-xs text-gray-400">
                  {session.user.email}
                </p>
                <p className="text-[11px] text-purple-400 mt-1">
                  Panel de Seguridad
                </p>
              </div>
            </div>

            {/* ===== NAV ===== */}
            <nav className="space-y-2">
              <Link
                href="/security/visit"
                className="flex items-center gap-3 px-4 py-3 rounded-xl
                hover:bg-purple-600/20 hover:text-white transition"
              >
                <CalendarCheck size={20} className="text-purple-400" />
                <span className="text-sm font-medium">
                  Visitas de Hoy
                </span>
              </Link>

              <Link
                href="/security/logs"
                className="flex items-center gap-3 px-4 py-3 rounded-xl
                hover:bg-purple-600/20 hover:text-white transition"
              >
                <ClipboardList size={20} className="text-purple-400" />
                <span className="text-sm font-medium">
                  Registro de Entradas
                </span>
              </Link>
            </nav>
          </div>

          {/* ===== LOGOUT ===== */}
          <button
            onClick={() => signOut()}
            className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl
            border border-purple-500/30 text-gray-300
            hover:bg-red-600/20 hover:text-red-400 transition"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Overlay móvil */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
