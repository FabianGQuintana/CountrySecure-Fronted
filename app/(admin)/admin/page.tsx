"use client";
import { Card, CardContent } from "@/components/ui/card";

import {
  FiUsers,
  FiHome,
  FiTool,
  FiBarChart2,
  FiCalendar,
  FiShield,
  FiPackage,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAdminStats } from "@/features/stats/actions";
import type { AdminStats } from "@/types/stats";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    fetchAdminStats().then((result) => {
      if (result.ok) setStats(result.data);
      else setStatsError(true);
    });
  }, []);

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
      <div className="flex justify-center items-center h-screen bg-linear-to-br from-purple-50/80 via-white/90 to-pink-50/80">
        <p className="text-xl text-purple-500 animate-pulse">
          Verificando sesión...
        </p>
      </div>
    );
  }

  // El acceso por rol lo garantizan proxy.ts y el layout del grupo de rutas.

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

  const value = (n?: number) => (stats ? String(n ?? 0) : "—");

  const kpis = [
    {
      title: "Residentes Activos",
      value: value(stats?.totalResidents),
      change: `${stats?.inactiveUsers ?? 0} inactivos`,
      icon: <FiUsers size={28} />,
      color: "from-purple-400/90 via-violet-400/80 to-fuchsia-300/90",
      delay: 0.1,
      trend: "neutral",
    },
    {
      title: "Próximas Reservas",
      value: value(stats?.upcomingReservations),
      change: `${stats?.reservationsToday ?? 0} hoy`,
      icon: <FiCalendar size={28} />,
      color: "from-fuchsia-400/90 via-pink-400/80 to-rose-300/90",
      delay: 0.2,
      trend: "up",
    },
    {
      title: "Servicios Activos",
      value: value(stats?.activeOrders),
      change: `${stats?.pendingRequests ?? 0} solicitudes`,
      icon: <FiTool size={28} />,
      color: "from-violet-500/90 via-indigo-400/80 to-purple-400/90",
      delay: 0.3,
      trend: "neutral",
    },
    {
      title: "Propiedades Ocupadas",
      value: value(stats?.occupiedProperties),
      change: `de ${stats?.totalProperties ?? 0}`,
      icon: <FiHome size={28} />,
      color: "from-purple-500/90 via-violet-500/80 to-indigo-400/90",
      delay: 0.4,
      trend: "neutral",
    },
    {
      title: "Permisos de Hoy",
      value: value(stats?.permitsToday),
      change: `${stats?.visitorsInside ?? 0} adentro`,
      icon: <FiBarChart2 size={28} />,
      color: "from-indigo-500/90 via-blue-400/80 to-violet-400/90",
      delay: 0.5,
      trend: "up",
    },
    {
      title: "Personal de Seguridad",
      value: value(stats?.totalSecurityStaff),
      change: `${stats?.totalAmenities ?? 0} amenities`,
      icon: <FiShield size={28} />,
      color: "from-rose-500/90 via-pink-400/80 to-fuchsia-300/90",
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
      color:
        "bg-linear-to-br from-purple-400/90 via-violet-400/80 to-fuchsia-300/90",
      delay: 0.1,
    },
    {
      title: "Amenities",
      desc: "Ver y administrar reservas",
      icon: <FiCalendar size={32} />,
      onClick: () => router.push("/admin/amenities"),
      color:
        "bg-linear-to-br from-fuchsia-400/90 via-pink-400/80 to-rose-300/90",
      delay: 0.2,
    },
    {
      title: "Servicios",
      desc: "Configurar servicios disponibles",
      icon: <FiTool size={32} />,
      onClick: () => router.push("/admin/orders"),
      color:
        "bg-linear-to-br from-violet-500/90 via-indigo-400/80 to-purple-400/90",
      delay: 0.3,
    },
    {
      title: "Lotes y Propiedades",
      desc: "Administrar lotes y viviendas",
      icon: <FiHome size={32} />,
      onClick: () => router.push("/admin/propiedades"),
      color:
        "bg-linear-to-br from-purple-500/90 via-violet-500/80 to-indigo-400/90",
      delay: 0.4,
    },
    {
      title: "Personal de Seguridad",
      desc: "Control de acceso",
      icon: <FiShield size={32} />,
      onClick: () => router.push("/admin/users/seguridad"),
      color:
        "bg-linear-to-br from-indigo-500/90 via-blue-400/80 to-violet-400/90",
      delay: 0.5,
    },
    {
      title: "Reservas de Amenities",
      desc: "Ver los turnos reservados",
      icon: <FiPackage size={32} />,
      onClick: () => router.push("/admin/amenities/solicitudes"),
      color:
        "bg-linear-to-br from-rose-500/90 via-pink-400/80 to-fuchsia-300/90",
      delay: 0.6,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50/90 via-white/95 to-pink-50/90 text-gray-900 p-4 md:p-8">
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
              <span className="bg-linear-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
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
            <div className="bg-white/80 backdrop-blur-sm border border-purple-100/50 rounded-2xl p-5 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold bg-linear-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
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
          <span className="bg-linear-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
            Métricas Principales
          </span>
          {statsError && (
            <span className="ml-3 text-sm font-normal text-rose-500">
              No se pudieron cargar las métricas
            </span>
          )}
          <div className="ml-3 h-1 flex-1 bg-linear-to-r from-purple-100 via-violet-100 to-pink-100 rounded-full"></div>
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
                className={`absolute -inset-0.5 bg-linear-to-br ${item.color} rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500`}
              ></div>
              <Card className="relative bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-2xl overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-3 rounded-xl bg-linear-to-br ${item.color} bg-opacity-25 shadow-inner`}
                    >
                      {item.icon}
                    </div>
                    <div
                      className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        item.trend === "up"
                          ? "bg-linear-to-r from-purple-100 to-violet-100 text-purple-600"
                          : item.trend === "down"
                          ? "bg-linear-to-r from-rose-100 to-pink-100 text-rose-600"
                          : "bg-linear-to-r from-gray-100 to-gray-200 text-gray-600"
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
          <span className="bg-linear-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
            Acciones Rápidas
          </span>
          <div className="ml-3 h-1 flex-1 bg-linear-to-r from-purple-100 via-violet-100 to-pink-100 rounded-full"></div>
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
              <div className="absolute -inset-0.5 bg-linear-to-br from-purple-200/40 via-violet-200/30 to-pink-200/40 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
              <Card className="relative bg-white/90 backdrop-blur-sm border border-purple-100/50 rounded-2xl overflow-hidden h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${item.color} shadow-lg`}>
                      {item.icon}
                    </div>
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      className="text-gray-400 group-hover:text-purple-500 transition-colors"
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
                    className="mt-6 text-sm font-medium bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center"
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
