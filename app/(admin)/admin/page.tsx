"use client";

import { Card, CardContent } from "@/components/UI/card";
import { FiUsers, FiHome, FiTool, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const kpis = [
    {
      title: "Usuarios activos",
      value: "1,245",
      icon: <FiUsers size={28} />,
      gradient: "bg-gradient-to-tr from-indigo-500 to-purple-600",
    },
    {
      title: "Reservas de amenities",
      value: "342",
      icon: <FiHome size={28} />,
      gradient: "bg-gradient-to-tr from-green-400 to-teal-500",
    },
    {
      title: "Servicios activos",
      value: "27",
      icon: <FiTool size={28} />,
      gradient: "bg-gradient-to-tr from-yellow-400 to-orange-500",
    },
    {
      title: "Crecimiento mensual",
      value: "+14%",
      icon: <FiTrendingUp size={28} />,
      gradient: "bg-gradient-to-tr from-pink-500 to-red-500",
    },
  ];

  const sections = [
    {
      title: "Administrar Usuarios",
      desc: "Alta, baja y modificación de usuarios.",
      btn: "Ir a Usuarios",
      icon: <FiUsers size={36} />,
    },
    {
      title: "Administrar Amenities",
      desc: "Control de reservas y espacios comunes.",
      btn: "Ir a Amenities",
      icon: <FiHome size={36} />,
    },
    {
      title: "Administrar Servicios",
      desc: "Configuración de servicios disponibles.",
      btn: "Ir a Servicios",
      icon: <FiTool size={36} />,
    },
  ];

  return (
    <div className="w-full min-h-screen p-10 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Bienvenido al Panel Admin
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Gestioná todo desde un solo lugar con estilo moderno.
        </p>{" "}
      </div>
      {/* KPIs modernos tipo widgets */}
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
      {/* Secciones principales modernas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {sections.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.04, translateY: -4 }}
          >
            <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-3xl hover:shadow-pink-500/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-pink-400">{item.icon}</div>
                  <h2 className="text-2xl font-bold">{item.title}</h2>
                </div>
                <p className="text-slate-300 mb-6">{item.desc}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="w-full py-2 rounded-xl bg-linear-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-pink-500/60 transition-all"
                >
                  {item.btn}
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// "use client";

// import { Card, CardContent } from "@/components/UI/card";
// import {
//   FiUsers,
//   FiHome,
//   FiTool,
//   FiTrendingUp,
//   FiCalendar,
//   FiDollarSign,
//   FiCheckCircle,
//   FiBarChart2,
//   FiSettings,
//   FiBell,
//   FiSearch,
//   FiChevronRight,
// } from "react-icons/fi";
// import { motion } from "framer-motion";
// import { useState } from "react";

// export default function AdminDashboard() {
//   const [activeFilter, setActiveFilter] = useState("Hoy");

//   const kpis = [
//     {
//       title: "Usuarios Activos",
//       value: "1,245",
//       change: "+12.5%",
//       icon: <FiUsers size={24} />,
//       gradient: "from-blue-500 to-cyan-400",
//       trend: "up",
//       details: "Últimos 30 días",
//     },
//     {
//       title: "Reservas Activas",
//       value: "342",
//       change: "+8.2%",
//       icon: <FiCalendar size={24} />,
//       gradient: "from-emerald-500 to-teal-400",
//       trend: "up",
//       details: "Esta semana",
//     },
//     {
//       title: "Servicios Activos",
//       value: "27",
//       change: "+3.7%",
//       icon: <FiTool size={24} />,
//       gradient: "from-amber-500 to-orange-400",
//       trend: "up",
//       details: "Total registrados",
//     },
//     {
//       title: "Ingresos Mensuales",
//       value: "$42.8K",
//       change: "+14.2%",
//       icon: <FiDollarSign size={24} />,
//       gradient: "from-purple-500 to-pink-400",
//       trend: "up",
//       details: "Comparado con mes anterior",
//     },
//   ];

//   const quickActions = [
//     {
//       title: "Nuevo Usuario",
//       desc: "Agregar usuario al sistema",
//       icon: <FiUsers size={20} />,
//       color: "bg-blue-500",
//       link: "#",
//     },
//     {
//       title: "Crear Reserva",
//       desc: "Nueva reserva de amenity",
//       icon: <FiHome size={20} />,
//       color: "bg-emerald-500",
//       link: "#",
//     },
//     {
//       title: "Reportes",
//       desc: "Generar reportes financieros",
//       icon: <FiBarChart2 size={20} />,
//       color: "bg-purple-500",
//       link: "#",
//     },
//     {
//       title: "Configuración",
//       desc: "Ajustes del sistema",
//       icon: <FiSettings size={20} />,
//       color: "bg-slate-600",
//       link: "#",
//     },
//   ];

//   const sections = [
//     {
//       title: "Administrar Usuarios",
//       desc: "Gestión completa de usuarios, permisos y acceso.",
//       btn: "Ir a Usuarios",
//       icon: <FiUsers size={28} />,
//       count: "1,245",
//       progress: 75,
//       color: "text-blue-400",
//     },
//     {
//       title: "Administrar Amenities",
//       desc: "Control de reservas, espacios comunes y disponibilidad.",
//       btn: "Ir a Amenities",
//       icon: <FiHome size={28} />,
//       count: "342",
//       progress: 60,
//       color: "text-emerald-400",
//     },
//     {
//       title: "Administrar Servicios",
//       desc: "Configuración de servicios, precios y disponibilidad.",
//       btn: "Ir a Servicios",
//       icon: <FiTool size={28} />,
//       count: "27",
//       progress: 45,
//       color: "text-amber-400",
//     },
//   ];

//   const recentActivities = [
//     {
//       id: 1,
//       user: "María González",
//       action: "Reservó el salón de eventos",
//       time: "Hace 10 min",
//       icon: <FiCalendar className="text-blue-500" />,
//     },
//     {
//       id: 2,
//       user: "Carlos Ruiz",
//       action: "Registró un nuevo pago",
//       time: "Hace 25 min",
//       icon: <FiDollarSign className="text-emerald-500" />,
//     },
//     {
//       id: 3,
//       user: "Admin",
//       action: "Actualizó configuraciones del sistema",
//       time: "Hace 1 hora",
//       icon: <FiSettings className="text-purple-500" />,
//     },
//     {
//       id: 4,
//       user: "Ana López",
//       action: "Solicitó nuevo servicio",
//       time: "Hace 2 horas",
//       icon: <FiTool className="text-amber-500" />,
//     },
//   ];

//   const timeFilters = ["Hoy", "Esta semana", "Este mes", "Este año"];

//   return (
//     <div className="w-full min-h-screen p-6 md:p-8 bg-linear-to-br from-slate-50 to-slate-100 text-slate-800">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
//             Panel de Administración
//           </h1>
//           <p className="text-slate-600 mt-2">
//             Bienvenido de nuevo, Administrador. Aquí está el resumen de hoy.
//           </p>
//         </div>

//         <div className="flex items-center gap-4 w-full md:w-auto">
//           <div className="relative flex-1 md:flex-none">
//             <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Buscar..."
//               className="pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
//             />
//           </div>
//           <button className="p-2.5 bg-white rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors relative">
//             <FiBell size={20} className="text-slate-700" />
//             <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//               3
//             </span>
//           </button>
//         </div>
//       </div>

//       {/* Time Filter */}
//       <div className="flex gap-2 mb-8">
//         {timeFilters.map((filter) => (
//           <button
//             key={filter}
//             onClick={() => setActiveFilter(filter)}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               activeFilter === filter
//                 ? "bg-blue-600 text-white"
//                 : "bg-white text-slate-700 hover:bg-slate-100"
//             }`}
//           >
//             {filter}
//           </button>
//         ))}
//       </div>

//       {/* KPIs Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
//         {kpis.map((item, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.1 }}
//             whileHover={{ y: -5, transition: { duration: 0.2 } }}
//           >
//             <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-slate-200 overflow-hidden transition-all duration-300">
//               <CardContent className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <p className="text-slate-500 text-sm font-medium">
//                       {item.title}
//                     </p>
//                     <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
//                       {item.value}
//                     </h2>
//                   </div>
//                   <div
//                     className={`p-3 rounded-xl bg-linear-to-br ${item.gradient} text-white shadow-md`}
//                   >
//                     {item.icon}
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <span
//                       className={`text-sm font-medium ${
//                         item.trend === "up"
//                           ? "text-emerald-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {item.change}
//                     </span>
//                     <span className="text-slate-500 text-sm">
//                       {item.details}
//                     </span>
//                   </div>
//                   <div
//                     className={`w-10 h-6 rounded-full flex items-center justify-center ${
//                       item.trend === "up"
//                         ? "bg-emerald-100 text-emerald-600"
//                         : "bg-red-100 text-red-600"
//                     }`}
//                   >
//                     <FiTrendingUp size={14} />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
//         {/* Quick Actions */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="lg:col-span-1"
//         >
//           <Card className="bg-white rounded-2xl shadow-lg border border-slate-200 h-full">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold text-slate-900">
//                   Acciones Rápidas
//                 </h2>
//                 <FiChevronRight className="text-slate-400" />
//               </div>

//               <div className="space-y-4">
//                 {quickActions.map((action, i) => (
//                   <motion.button
//                     key={i}
//                     whileHover={{ x: 5 }}
//                     className="flex items-center gap-4 p-4 w-full rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
//                   >
//                     <div
//                       className={`p-3 rounded-lg ${action.color} text-white`}
//                     >
//                       {action.icon}
//                     </div>
//                     <div className="text-left flex-1">
//                       <h3 className="font-semibold text-slate-900">
//                         {action.title}
//                       </h3>
//                       <p className="text-sm text-slate-500">{action.desc}</p>
//                     </div>
//                   </motion.button>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Main Sections */}
//         <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {sections.map((item, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 + i * 0.1 }}
//               whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
//               className="md:col-span-1"
//             >
//               <Card className="bg-white rounded-2xl shadow-lg border border-slate-200 h-full overflow-hidden">
//                 <CardContent className="p-6 h-full flex flex-col">
//                   <div className="flex items-center justify-between mb-4">
//                     <div
//                       className={`p-3 rounded-xl ${item.color} bg-opacity-10`}
//                     >
//                       {item.icon}
//                     </div>
//                     <span className="text-2xl font-bold text-slate-900">
//                       {item.count}
//                     </span>
//                   </div>

//                   <h2 className="text-xl font-bold text-slate-900 mb-2">
//                     {item.title}
//                   </h2>
//                   <p className="text-slate-600 mb-6 grow">{item.desc}</p>

//                   <div className="mb-6">
//                     <div className="flex justify-between text-sm text-slate-500 mb-1">
//                       <span>Progreso</span>
//                       <span>{item.progress}%</span>
//                     </div>
//                     <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
//                       <div
//                         className={`h-full rounded-full ${item.color.replace(
//                           "text-",
//                           "bg-"
//                         )}`}
//                         style={{ width: `${item.progress}%` }}
//                       ></div>
//                     </div>
//                   </div>

//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.98 }}
//                     className={`w-full py-3 rounded-xl font-semibold text-white ${item.color.replace(
//                       "text-",
//                       "bg-"
//                     )} shadow-md hover:shadow-lg transition-all`}
//                   >
//                     {item.btn}
//                   </motion.button>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.6 }}
//       >
//         <Card className="bg-white rounded-2xl shadow-lg border border-slate-200">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold text-slate-900">
//                 Actividad Reciente
//               </h2>
//               <button className="text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors">
//                 Ver todo
//               </button>
//             </div>

//             <div className="space-y-4">
//               {recentActivities.map((activity) => (
//                 <div
//                   key={activity.id}
//                   className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
//                 >
//                   <div className="p-2.5 bg-slate-100 rounded-lg">
//                     {activity.icon}
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-medium text-slate-900">
//                       <span className="font-semibold">{activity.user}</span>{" "}
//                       {activity.action}
//                     </h3>
//                     <p className="text-sm text-slate-500">{activity.time}</p>
//                   </div>
//                   <FiChevronRight className="text-slate-400" />
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Footer note */}
//       <div className="mt-8 text-center text-slate-500 text-sm">
//         <p>Actualizado hace 5 minutos • Datos en tiempo real</p>
//       </div>
//     </div>
//   );
// }
