import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FiUser, FiHome, FiKey, FiCalendar, FiTool } from "react-icons/fi";
import { auth } from "@/auth";
import { api } from "@/lib/api-client";
import { load } from "@/lib/load";
import type { ResidentStats } from "@/types/stats";

// Server Component: el nombre sale de la sesión del servidor (sin esperar a useSession) y las
// métricas se transmiten por streaming, así el panel aparece apenas llega el HTML.

const SECTIONS = [
  { title: "Mi Perfil", desc: "Ver y modificar tus datos personales.", href: "/resident/profile", icon: <FiUser size={32} /> },
  { title: "Amenities", desc: "Reservá salas, gimnasios y espacios comunes.", href: "/resident/amenities", icon: <FiHome size={32} /> },
  { title: "Permisos de Ingreso", desc: "Registrá visitas y gestioná permisos.", href: "/resident/permits", icon: <FiKey size={32} /> },
  { title: "Mis Reservas", desc: "Consultá y cancelá tus turnos reservados.", href: "/resident/reservations", icon: <FiCalendar size={32} /> },
  { title: "Solicitudes", desc: "Pedí servicios de mantenimiento a la administración.", href: "/resident/requests", icon: <FiTool size={32} /> },
];

function formatLastActivity(stats: ResidentStats | null) {
  if (!stats) return "—";
  if (!stats.lastActivityAt) return "Sin actividad";
  const date = new Date(stats.lastActivityAt);
  if (date.toDateString() === new Date().toDateString()) return "Hoy";
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

function Kpis({ stats }: { stats: ResidentStats | null }) {
  const value = (n?: number) => (stats ? String(n ?? 0) : "—");
  const kpis = [
    { title: "Mis próximas reservas", value: value(stats?.upcomingReservations), icon: <FiCalendar size={28} />, color: "bg-info" },
    { title: "Permisos de ingreso activos", value: value(stats?.activePermits), icon: <FiKey size={28} />, color: "bg-success" },
    { title: "Amenities disponibles", value: value(stats?.availableAmenities), icon: <FiHome size={28} />, color: "bg-warning" },
    { title: "Última actividad", value: formatLastActivity(stats), icon: <FiUser size={28} />, color: "bg-primary" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
      {kpis.map((item, i) => (
        <div
          key={item.title}
          className="relative group animate-fade-up transition-[translate] duration-200 hover:-translate-y-1"
          style={{ animationDelay: `${(i + 1) * 0.1}s` }}
        >
          {/* Glow suave */}
          <div
            className={`absolute -inset-0.5 bg-linear-to-br ${item.color} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}
          ></div>

          <Card className="relative bg-card border border-border rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-linear-to-br ${item.color} bg-opacity-20`}>{item.icon}</div>
                <div className="text-muted-foreground text-sm font-medium">{item.value}</div>
              </div>
              <h3 className="text-muted-foreground text-sm font-medium">{item.title}</h3>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

async function LiveKpis() {
  const { data, error } = await load(() => api.get<ResidentStats>("/api/stats/resident"));
  return (
    <>
      {error && <p className="-mt-8 mb-6 text-sm text-danger">No se pudieron cargar las métricas: {error}</p>}
      <Kpis stats={data ?? null} />
    </>
  );
}

export default async function ResidentDashboard() {
  // El acceso por rol lo garantizan proxy.ts y el layout del grupo de rutas.
  const user = await auth();

  return (
    <div className="flex bg-background">
      {/* CONTENEDOR PRINCIPAL */}
      <div className="w-full p-10 text-foreground">
        {/* HEADER */}
        <div className="mb-12 flex flex-col">
          <h1 className="text-4xl font-bold animate-fade-down">
            Hola,{" "}
            <span className="text-primary">
              {user?.name || "Residente"}
            </span>
          </h1>
          <p className="text-muted-foreground text-lg mt-2">Panel de Residente</p>
        </div>

        {/* KPIs */}
        <Suspense fallback={<Kpis stats={null} />}>
          <LiveKpis />
        </Suspense>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {SECTIONS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative group block animate-pop transition-[scale,translate] duration-200 hover:scale-[1.03] hover:-translate-y-1"
              style={{ animationDelay: `${(i + 1) * 0.1}s` }}
            >
              <div className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500 bg-muted"></div>

              <Card className="relative bg-card border border-border rounded-2xl shadow p-6 h-full">
                <CardContent className="h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-info-soft text-info shadow-lg">{item.icon}</div>
                    <div className="text-muted-foreground group-hover:text-info transition group-hover:rotate-90">→</div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm grow">{item.desc}</p>

                  <div className="mt-6 text-sm font-medium text-primary flex items-center transition-[translate] group-hover:translate-x-1">
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
