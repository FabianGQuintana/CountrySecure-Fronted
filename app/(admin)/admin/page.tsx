"use client";
import { Card, CardContent } from "@/components/UI/card";
import {
  FiUsers,
  FiHome,
  FiTool,
  FiTrendingUp,
  FiSettings,
  FiBarChart2,
  FiBell,
  FiCalendar,
  FiShield,
  FiPackage,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Función segura para obtener nombre completo
  const getUserFullName = () => {
    if (!session?.user) return "Usuario";
    const firstName = session.user.name || "";
    const lastName = session.user.lastname || "";
    return `${firstName} ${lastName}`.trim() || "Usuario";
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <p className="text-xl text-gray-500 animate-pulse">
          Verificando sesión...
        </p>
      </div>
    );
  }

  if (!session || session.user.role !== "Admin") {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="bg-white p-10 rounded-3xl shadow-lg text-center max-w-lg border border-gray-200">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-200 rounded-full blur-xl opacity-30"></div>
            <div className="relative flex items-center justify-center w-full h-full text-6xl">
              🚫
            </div>
          </div>
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            Acceso Restringido
          </h1>
          <p className="text-gray-500 mb-8 text-lg">
            {!session
              ? "Debes iniciar sesión para acceder al panel de administración."
              : "Tu cuenta no tiene permisos para acceder a esta sección."}
          </p>
          <a
            href={!session ? "/auth/login" : "/"}
            className="inline-block bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 shadow"
          >
            {!session ? "Iniciar Sesión" : "Volver al Inicio"}
          </a>
        </div>
      </div>
    );
  }

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  const formatDate = (date: Date) =>
    date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const kpis = [
    {
      title: "Usuarios Activos",
      value: "1,245",
      change: "+12.5%",
      icon: <FiUsers size={28} />,
      color: "from-blue-400 to-cyan-300",
      delay: 0.1,
      trend: "up",
    },
    {
      title: "Reservas Activas",
      value: "342",
      change: "+8.2%",
      icon: <FiHome size={28} />,
      color: "from-green-400 to-teal-300",
      delay: 0.2,
      trend: "up",
    },
    {
      title: "Servicios Activos",
      value: "27",
      change: "+2",
      icon: <FiTool size={28} />,
      color: "from-yellow-400 to-orange-300",
      delay: 0.3,
      trend: "up",
    },
    {
      title: "Crecimiento Mensual",
      value: "+14%",
      change: "vs último mes",
      icon: <FiTrendingUp size={28} />,
      color: "from-purple-400 to-pink-300",
      delay: 0.4,
      trend: "up",
    },
    {
      title: "Tasa de Satisfacción",
      value: "94.2%",
      change: "+3.1%",
      icon: <FiBarChart2 size={28} />,
      color: "from-violet-400 to-indigo-300",
      delay: 0.5,
      trend: "up",
    },
    {
      title: "Notificaciones Pendientes",
      value: "18",
      change: "5 nuevas",
      icon: <FiBell size={28} />,
      color: "from-red-400 to-rose-300",
      delay: 0.6,
      trend: "neutral",
    },
  ];

  const quickActions = [
    {
      title: "Gestión de Usuarios",
      desc: "Administrar permisos y usuarios",
      icon: <FiUsers size={32} />,
      onClick: () => router.push("/admin/users/residentes"),
      color: "bg-gradient-to-br from-blue-400 to-cyan-300",
      delay: 0.1,
    },
    {
      title: "Amenities",
      desc: "Ver y administrar reservas",
      icon: <FiCalendar size={32} />,
      onClick: () => router.push("/admin/amenities"),
      color: "bg-gradient-to-br from-green-400 to-teal-300",
      delay: 0.2,
    },
    {
      title: "Servicios",
      desc: "Configurar servicios disponibles",
      icon: <FiTool size={32} />,
      onClick: () => router.push("/admin/orders"),
      color: "bg-gradient-to-br from-yellow-400 to-orange-300",
      delay: 0.3,
    },
    {
      title: "Configuración",
      desc: "Ajustes del sistema",
      icon: <FiSettings size={32} />,
      onClick: () => router.push("/admin/settings"),
      color: "bg-gradient-to-br from-purple-400 to-pink-300",
      delay: 0.4,
    },
    {
      title: "Personal de Seguridad",
      desc: "Control de acceso",
      icon: <FiShield size={32} />,
      onClick: () => router.push("/admin/users/seguridad"),
      color: "bg-gradient-to-br from-violet-400 to-indigo-300",
      delay: 0.5,
    },
    {
      title: "Inventario",
      desc: "Gestión de recursos y activos",
      icon: <FiPackage size={32} />,
      onClick: () => router.push("/admin/inventory"),
      color: "bg-gradient-to-br from-red-400 to-rose-300",
      delay: 0.6,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 text-gray-900 p-4 md:p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-2"
            >
              Hola,{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {getUserFullName()}
              </span>
            </motion.h1>
            <p className="text-gray-500 text-lg">Panel de Administración</p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 md:mt-0"
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {formatTime(time)}
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  {formatDate(time)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Métricas Principales
          </span>
          <div className="ml-3 h-1 flex-1 bg-gray-300 rounded-full"></div>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {kpis.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div
                className={`absolute -inset-0.5 bg-gradient-to-br ${item.color} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}
              ></div>
              <Card className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${item.color} bg-opacity-20`}
                    >
                      {item.icon}
                    </div>
                    <div
                      className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        item.trend === "up"
                          ? "bg-emerald-100 text-emerald-500"
                          : item.trend === "down"
                          ? "bg-rose-100 text-rose-500"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.change}
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">
                    {item.title}
                  </h3>
                  <div className="text-2xl font-bold text-gray-900">
                    {item.value}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Acciones Rápidas
          </span>
          <div className="ml-3 h-1 flex-1 bg-gray-300 rounded-full"></div>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickActions.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: item.delay }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="relative group cursor-pointer"
              onClick={item.onClick}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-gray-200 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
              <Card className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden backdrop-blur-sm h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${item.color} shadow-lg`}>
                      {item.icon}
                    </div>
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      className="text-gray-400 group-hover:text-cyan-400 transition-colors"
                    >
                      →
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
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
