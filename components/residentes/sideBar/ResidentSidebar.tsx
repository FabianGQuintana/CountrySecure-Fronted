"use client";

import { FiUser, FiHome, FiKey, FiCalendar, FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import LogoutButton from "../buttons/LogoutButton";

export default function ResidentSidebar() {
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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 shadow-xl flex flex-col justify-between text-white p-6">
      {/* LOGO / TÍTULO */}
      <div>
        <h2 className="text-2xl font-bold mb-10 tracking-wide">
          Panel Residente
        </h2>

        {/* MENÚ */}
        <nav className="flex flex-col gap-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-all"
              >
                <span className="text-purple-400">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <LogoutButton />
    </aside>
  );
}
