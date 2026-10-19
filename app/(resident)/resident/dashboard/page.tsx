"use client";

import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { FiUser, FiHome, FiKey, FiCalendar, FiTool } from "react-icons/fi";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchResidentStats } from "@/features/stats/actions";
import type { ResidentStats } from "@/types/stats";

export default function ResidentDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<ResidentStats | null>(null);

  useEffect(() => {
    fetchResidentStats().then((result) => {
      if (result.ok) setStats(result.data);
      else toast.error(result.error);
    });
  }, []);

  if (status === "loading") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-green-50">
        <div className="w-14 h-14 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // El acceso por rol lo garantizan proxy.ts y el layout del grupo de rutas.

  const value = (n?: number) => (stats ? String(n ?? 0) : "—");

  const formatLastActivity = (iso: string | null | undefined) => {
    if (!stats) return "—";
    if (!iso) return "Sin actividad";
    const date = new Date(iso);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Hoy";
    return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
  };

  const kpis = [
    {
      title: "Mis próximas reservas",
      value: value(stats?.upcomingReservations),
      icon: <FiCalendar size={28} />,
      color: "from-blue-400 to-cyan-300",
      delay: 0.1,
    },
    {
      title: "Permisos de ingreso activos",
      value: value(stats?.activePermits),
      icon: <FiKey size={28} />,
      color: "from-green-400 to-teal-300",
      delay: 0.2,
    },
    {
      title: "Amenities disponibles",
      value: value(stats?.availableAmenities),
      icon: <FiHome size={28} />,
      color: "from-yellow-400 to-orange-300",
      delay: 0.3,
    },
    {
      title: "Última actividad",
      value: formatLastActivity(stats?.lastActivityAt),
      icon: <FiUser size={28} />,
      color: "from-purple-400 to-pink-300",
      delay: 0.4,
    },
  ];

  const sections = [
    {
      title: "Mi Perfil",
      desc: "Ver y modificar tus datos personales.",
      href: "/resident/profile",
      icon: <FiUser size={32} />,
      delay: 0.1,
    },
    {
      title: "Amenities",
      desc: "Reservá salas, gimnasios y espacios comunes.",
      href: "/resident/amenities",
      icon: <FiHome size={32} />,
      delay: 0.2,
    },
    {
      title: "Permisos de Ingreso",
      desc: "Registrá visitas y gestioná permisos.",
      href: "/resident/permits",
      icon: <FiKey size={32} />,
      delay: 0.3,
    },
    {
      title: "Mis Reservas",
      desc: "Consultá y cancelá tus turnos reservados.",
      href: "/resident/reservations",
      icon: <FiCalendar size={32} />,
      delay: 0.4,
    },
    {
      title: "Solicitudes",
      desc: "Pedí servicios de mantenimiento a la administración.",
      href: "/resident/requests",
      icon: <FiTool size={32} />,
      delay: 0.5,
    },
  ];

  return (
    <div className="flex bg-linear-to-br from-blue-50 via-white to-green-50">

      {/* CONTENEDOR PRINCIPAL */}
      <div className="w-full p-10 text-gray-900">
        {/* HEADER */}
        <div className="mb-12 flex flex-col">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold"
          >
            Hola,{" "}
            <span className="bg-linear-to-r from-purple-200 to-purple-500 bg-clip-text text-transparent">
              {session?.user?.name || "Residente"}
            </span>
          </motion.h1>
          <p className="text-gray-500 text-lg mt-2">Panel de Residente</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {kpis.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              {/* Glow suave */}
              <div
                className={`absolute -inset-0.5 bg-linear-to-br ${item.color} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}
              ></div>

              <Card className="relative bg-white border border-gray-200 rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-3 rounded-xl bg-linear-to-br ${item.color} bg-opacity-20`}
                    >
                      {item.icon}
                    </div>
                    <div className="text-gray-400 text-sm font-medium">
                      {item.value}
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    {item.title}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {sections.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: item.delay }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="relative group cursor-pointer"
              onClick={() => (window.location.href = item.href)}
            >
              <div className="absolute -inset-0.5 bg-linear-to-br from-gray-200 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>

              <Card className="relative bg-white border border-gray-200 rounded-2xl shadow p-6 h-full">
                <CardContent className="h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-blue-100 text-blue-600 shadow-lg">
                      {item.icon}
                    </div>
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      className="text-gray-400 group-hover:text-cyan-400 transition"
                    >
                      →
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm grow">{item.desc}</p>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="mt-6 text-sm font-medium text-purple-500 flex items-center"
                  >
                    Acceder <span className="ml-2">↗</span>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
