"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FiUser, FiHome, FiKey, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import ResidentSidebar from "@/components/residentes/sideBar/ResidentSidebar";

export default function ResidentDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-green-50">
        <div className="w-14 h-14 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || session.user.role !== "Resident") {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-linear-to-br from-blue-50 via-white to-green-50">
        <div className="bg-white p-10 rounded-3xl shadow-lg text-center max-w-lg border border-gray-200">
          <div className="text-6xl mb-6">🚫</div>
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-500 mb-8 text-lg">
            {!session
              ? "Debes iniciar sesión para acceder."
              : "No tienes permisos para acceder a esta sección."}
          </p>
          <a
            href={!session ? "/auth/login" : "/"}
            className="inline-block bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-all shadow"
          >
            {!session ? "Iniciar Sesión" : "Volver al Inicio"}
          </a>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: "Mis reservas activas",
      value: "3",
      icon: <FiCalendar size={28} />,
      color: "from-blue-400 to-cyan-300",
      delay: 0.1,
    },
    {
      title: "Permisos solicitados",
      value: "12",
      icon: <FiKey size={28} />,
      color: "from-green-400 to-teal-300",
      delay: 0.2,
    },
    {
      title: "Amenities disponibles",
      value: "8",
      icon: <FiHome size={28} />,
      color: "from-yellow-400 to-orange-300",
      delay: 0.3,
    },
    {
      title: "Última actividad",
      value: "Hoy",
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
  ];

  return (
    <div className="flex bg-linear-to-br from-blue-50 via-white to-green-50">

      {/* <ResidentSidebar /> */}

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
            <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {session.user?.name || "Residente"}
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
                    className="mt-6 text-sm font-medium text-cyan-500 flex items-center"
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
