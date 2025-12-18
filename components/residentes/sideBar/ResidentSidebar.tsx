"use client";

import { FiUser, FiHome, FiKey, FiCalendar, FiX } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import LogoutButton from "../buttons/LogoutButton";

type ResidentSidebarProps = {
  onClose?: () => void;
};

export default function ResidentSidebar({ onClose }: ResidentSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Mi Perfil",
      href: "/resident/profile",
      icon: <FiUser size={20} />,
    },
    {
      label: "Reservar Amenities",
      href: "/resident/amenities",
      icon: <FiHome size={20} />,
    },
    {
      label: "Solicitar Permisos",
      href: "/resident/permits",
      icon: <FiKey size={20} />,
    },
    {
      label: "Mis Reservas",
      href: "/resident/reservations",
      icon: <FiCalendar size={20} />,
    },
  ];

  return (
    <aside className="h-screen w-64 flex flex-col bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/50 shadow-2xl text-white">
      {/* Botón cerrar – SOLO MOBILE */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 z-50 p-2 rounded-lg hover:bg-slate-800/60"
      >
        <FiX size={20} />
      </button>

      {/* Header → BOTÓN DASHBOARD */}
      <Link
        href="/resident/dashboard"
        onClick={onClose}
        className="p-6 border-b border-slate-800/50 bg-linear-to-br from-purple-500/5 to-transparent
                   hover:bg-slate-800/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <FiHome size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Panel
            </h2>
            <p className="text-xs text-slate-400 font-medium">Residente</p>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className={`
                  group relative flex items-center gap-3 px-4 py-3 rounded-xl 
                  transition-all duration-300 overflow-hidden
                  ${
                    isActive
                      ? "bg-linear-to-r from-purple-500/20 to-purple-600/10 border border-purple-500/30 shadow-lg shadow-purple-500/10"
                      : "hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50"
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-purple-400 to-purple-600 rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <span
                  className={`
                    flex items-center justify-center w-9 h-9 rounded-lg
                    transition-all duration-300
                    ${
                      isActive
                        ? "text-purple-400 bg-purple-500/10"
                        : "text-slate-400 group-hover:text-purple-400 group-hover:bg-slate-800"
                    }
                  `}
                >
                  {item.icon}
                </span>

                <span
                  className={`
                    font-medium text-sm tracking-wide transition-colors duration-300
                    ${
                      isActive
                        ? "text-white"
                        : "text-slate-300 group-hover:text-white"
                    }
                  `}
                >
                  {item.label}
                </span>

                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" />
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/50">
        <LogoutButton />
      </div>
    </aside>
  );
}
