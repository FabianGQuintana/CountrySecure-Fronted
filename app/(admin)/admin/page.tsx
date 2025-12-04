"use client";

import { Card, CardContent } from "@/components/UI/card";

import { FiUsers, FiHome, FiTool, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  return (
    <div className="w-full min-h-screen p-10 bg-lienar-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Bienvenido al Panel Admin
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Gestioná todo desde un solo lugar.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {[
          {
            title: "Usuarios activos",
            value: "1,245",
            icon: <FiUsers size={32} />,
          },
          {
            title: "Reservas de amenities",
            value: "342",
            icon: <FiHome size={32} />,
          },
          {
            title: "Servicios activos",
            value: "27",
            icon: <FiTool size={32} />,
          },
          {
            title: "Crecimiento mensual",
            value: "+14%",
            icon: <FiTrendingUp size={32} />,
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700 shadow-xl rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400">{item.title}</p>
                    <h2 className="text-3xl font-bold mt-1">{item.value}</h2>
                  </div>
                  <div className="text-slate-300">{item.icon}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Secciones principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[
          {
            title: "Administrar Usuarios",
            desc: "Alta, baja y modificación de usuarios.",
            btn: "Ir a Usuarios",
            icon: <FiUsers size={40} />,
          },
          {
            title: "Administrar Amenities",
            desc: "Control de reservas y espacios comunes.",
            btn: "Ir a Amenities",
            icon: <FiHome size={40} />,
          },
          {
            title: "Administrar Servicios",
            desc: "Configuración de servicios disponibles.",
            btn: "Ir a Servicios",
            icon: <FiTool size={40} />,
          },
        ].map((item, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03 }}>
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700 shadow-xl rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-slate-300">{item.icon}</div>
                  <h2 className="text-2xl font-bold">{item.title}</h2>
                </div>
                <p className="text-slate-400">{item.desc}</p>
                {/* <Button className="mt-6 w-full">{item.btn}</Button> */}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
