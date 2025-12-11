"use client";

import { Card, CardContent } from "@/components/UI/card";
import { FiUser, FiHome, FiKey, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import ResidentSidebar from "@/components/residentes/sideBar/ResidentSidebar";

export default function ResidentDashboard() {
  const { data: session, status } = useSession();

  // Loading mientras se valida sesión
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Verificando...</p>
      </div>
    );
  }

  // Solo rol Residente
  if (!session || session.user.role !== "Resident") {
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
              : "No tienes permisos para acceder a esta sección."}
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

  // KPIs del residente
  const kpis = [
    {
      title: "Mis reservas activas",
      value: "3",
      icon: <FiCalendar size={28} />,
      gradient: "bg-gradient-to-tr from-indigo-500 to-purple-600",
    },
    {
      title: "Permisos solicitados",
      value: "12",
      icon: <FiKey size={28} />,
      gradient: "bg-gradient-to-tr from-green-400 to-teal-500",
    },
    {
      title: "Amenities disponibles",
      value: "8",
      icon: <FiHome size={28} />,
      gradient: "bg-gradient-to-tr from-yellow-400 to-orange-500",
    },
    {
      title: "Última actividad",
      value: "Hoy",
      icon: <FiUser size={28} />,
      gradient: "bg-gradient-to-tr from-pink-500 to-red-500",
    },
  ];

  // Secciones del residente
  const sections = [
    {
      title: "Mi Perfil",
      desc: "Ver y modificar tus datos personales.",
      btn: "Ir al Perfil",
      href: "/resident/profile",
      icon: <FiUser size={36} />,
    },
    {
      title: "Amenities",
      desc: "Reservá salas, gimnasios y demás espacios comunes.",
      btn: "Ver Amenities",
      href: "/resident/amenities",
      icon: <FiHome size={36} />,
    },
    {
      title: "Permisos de Ingreso",
      desc: "Registrá visitas y gestioná permisos para invitados.",
      btn: "Solicitar Permiso",
      href: "/resident/permits",
      icon: <FiKey size={36} />,
    },
  ];

  return (
    <div className="flex">

      <ResidentSidebar />

      {/* CONTENEDOR PRINCIPAL (solo uno) */}
      <div className="ml-64 w-full min-h-screen p-10 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

        {/* Título */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Bienvenido, {session.user?.name || "Residente"}
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Accedé rápido a tus funciones principales.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {kpis.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card
                className={`${item.gradient} text-white shadow-2xl rounded-3xl border-none overflow-hidden`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-80">{item.title}</p>
                      <h2 className="text-3xl font-bold mt-1">{item.value}</h2>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      {item.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Secciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {sections.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.04, translateY: -4 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-3xl hover:shadow-purple-500/40 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-purple-400">{item.icon}</div>
                    <h2 className="text-2xl font-bold">{item.title}</h2>
                  </div>

                  <p className="text-slate-300 mb-6">{item.desc}</p>

                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    href={item.href}
                    className="w-full block text-center py-2 rounded-xl bg-linear-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-purple-500/60 transition-all"
                  >
                    {item.btn}
                  </motion.a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
