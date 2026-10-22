import { Suspense } from "react";
import Link from "next/link";
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
import { auth } from "@/auth";
import { api } from "@/lib/api-client";
import { load } from "@/lib/load";
import type { AdminStats } from "@/types/stats";
import LiveClock from "./LiveClock";

// Server Component: el nombre sale de la sesión del servidor (sin esperar a useSession) y las
// métricas se transmiten por streaming; solo el reloj es un componente de cliente.

const GRADIENT_TEXT = "text-primary";

const QUICK_ACTIONS = [
  {
    title: "Gestión de Usuarios",
    desc: "Administrar permisos y usuarios",
    icon: <FiUsers size={32} />,
    href: "/admin/users/residentes",
    color: "bg-primary",
  },
  {
    title: "Amenities",
    desc: "Ver y administrar reservas",
    icon: <FiCalendar size={32} />,
    href: "/admin/amenities",
    color: "bg-primary",
  },
  {
    title: "Servicios",
    desc: "Configurar servicios disponibles",
    icon: <FiTool size={32} />,
    href: "/admin/orders",
    color: "bg-primary",
  },
  {
    title: "Lotes y Propiedades",
    desc: "Administrar lotes y viviendas",
    icon: <FiHome size={32} />,
    href: "/admin/propiedades",
    color: "bg-primary",
  },
  {
    title: "Personal de Seguridad",
    desc: "Control de acceso",
    icon: <FiShield size={32} />,
    href: "/admin/users/seguridad",
    color: "bg-primary",
  },
  {
    title: "Reservas de Amenities",
    desc: "Ver los turnos reservados",
    icon: <FiPackage size={32} />,
    href: "/admin/reservas",
    color: "bg-danger",
  },
];

function Kpis({ stats }: { stats: AdminStats | null }) {
  const value = (n?: number) => (stats ? String(n ?? 0) : "—");
  const kpis = [
    {
      title: "Residentes Activos",
      value: value(stats?.totalResidents),
      change: `${stats?.inactiveUsers ?? 0} inactivos`,
      icon: <FiUsers size={28} />,
      color: "bg-primary",
      trend: "neutral",
    },
    {
      title: "Próximas Reservas",
      value: value(stats?.upcomingReservations),
      change: `${stats?.reservationsToday ?? 0} hoy`,
      icon: <FiCalendar size={28} />,
      color: "bg-primary",
      trend: "up",
    },
    {
      title: "Servicios Activos",
      value: value(stats?.activeOrders),
      change: `${stats?.pendingRequests ?? 0} solicitudes`,
      icon: <FiTool size={28} />,
      color: "bg-primary",
      trend: "neutral",
    },
    {
      title: "Propiedades Ocupadas",
      value: value(stats?.occupiedProperties),
      change: `de ${stats?.totalProperties ?? 0}`,
      icon: <FiHome size={28} />,
      color: "bg-primary",
      trend: "neutral",
    },
    {
      title: "Permisos de Hoy",
      value: value(stats?.permitsToday),
      change: `${stats?.visitorsInside ?? 0} adentro`,
      icon: <FiBarChart2 size={28} />,
      color: "bg-primary",
      trend: "up",
    },
    {
      title: "Personal de Seguridad",
      value: value(stats?.totalSecurityStaff),
      change: `${stats?.totalAmenities ?? 0} amenities`,
      icon: <FiShield size={28} />,
      color: "bg-danger",
      trend: "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
      {kpis.map((item, i) => (
        <div
          key={item.title}
          className="relative group animate-fade-up transition-[translate] duration-200 hover:-translate-y-1"
          style={{ animationDelay: `${(i + 1) * 0.1}s` }}
        >
          <div
            className={`absolute -inset-0.5 bg-linear-to-br ${item.color} rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500`}
          ></div>
          <Card className="relative bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-linear-to-br ${item.color} bg-opacity-25 shadow-inner`}>
                  {item.icon}
                </div>
                <div
                  className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    item.trend === "up"
                      ? "text-primary bg-background"
                      : "text-muted-foreground bg-muted"
                  }`}
                >
                  {item.change}
                </div>
              </div>
              <h3 className="text-muted-foreground text-sm font-medium mb-1">{item.title}</h3>
              <div className="text-2xl font-bold text-foreground">{item.value}</div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

async function LiveKpis() {
  const { data } = await load(() => api.get<AdminStats>("/api/stats/admin"));
  return (
    <>
      {!data && <p className="-mt-4 mb-4 text-sm text-danger">No se pudieron cargar las métricas</p>}
      <Kpis stats={data ?? null} />
    </>
  );
}

export default async function AdminDashboard() {
  // El acceso por rol lo garantizan proxy.ts y el layout del grupo de rutas.
  const user = await auth();
  const fullName = `${user?.name || ""} ${user?.lastname || ""}`.trim() || "Usuario";

  return (
    <div className="min-h-screen text-foreground p-4 md:p-8 bg-background">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 animate-fade-down">
              Hola, <span className={GRADIENT_TEXT}>{fullName}</span>
            </h1>
            <p className="text-muted-foreground text-lg">Panel de Administración</p>
          </div>
          <div className="mt-4 md:mt-0 animate-pop" style={{ animationDelay: "0.3s" }}>
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-5 shadow-lg">
              <LiveClock className={GRADIENT_TEXT} />
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className={GRADIENT_TEXT}>Métricas Principales</span>
          <div className="ml-3 h-1 flex-1 rounded-full bg-background"></div>
        </h2>
        <Suspense fallback={<Kpis stats={null} />}>
          <LiveKpis />
        </Suspense>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className={GRADIENT_TEXT}>Acciones Rápidas</span>
          <div className="ml-3 h-1 flex-1 rounded-full bg-background"></div>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {QUICK_ACTIONS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative group block animate-pop transition-[scale,translate] duration-200 hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98]"
              style={{ animationDelay: `${(i + 1) * 0.1}s` }}
            >
              <div className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500 bg-primary-soft"></div>
              <Card className="relative bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${item.color} shadow-lg`}>{item.icon}</div>
                    <div className="text-muted-foreground group-hover:text-primary transition group-hover:rotate-90">→</div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm grow">{item.desc}</p>
                  <div className="mt-6 text-sm font-medium flex items-center transition-[translate] group-hover:translate-x-1 text-primary">
                    Acceder <span className="ml-2">↗</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
