import { auth } from "@/auth"
import { Clock, CheckCircle, AlertTriangle } from "lucide-react"
import VisitCard from "@/components/Security/VisitCard"

interface KpiCardProps {
  title: string
  value: number
  icon: React.ElementType
  colorClass: string
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, colorClass }) => (
  <div className={`p-6 rounded-xl shadow-lg ${colorClass} transition-all hover:shadow-2xl hover:scale-105 duration-300`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">{title}</h3>
        <p className="text-4xl font-bold text-white mt-2">{value}</p>
      </div>
      <Icon className="h-12 w-12 text-white/70" />
    </div>
  </div>
)

export default async function SecurityPage() {

  const session = await auth();

  let visitPermissions: any[] = [];

  try {
    const response = await fetch(
      `${process.env.API_HOST}/api/entrypermissions/today`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    if (!response.ok) throw new Error("error al obtener los permisos de entrada");
    const json = await response.json();

    visitPermissions = Array.isArray(json)
      ? json
      : json.data ?? json.permissions ?? [];

    // console.log("=== DATOS DEL BACKEND ===");
    // console.log("Total de permisos:", visitPermissions?.length);
    // console.log("Primer permiso:", JSON.stringify(visitPermissions?.[0], null, 2));
  } catch (error) {
    console.error(error);
  }

  if (!visitPermissions || visitPermissions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Visitas Hoy</h1>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 text-center border border-purple-500/20">
            <p className="text-gray-300 text-lg">No hay permisos de entrada programados para hoy.</p>
          </div>
        </div>
      </div>
    )
  }

  // Calcular KPIs dinámicamente desde el backend
  const totalVisits = visitPermissions.length

  const now = new Date()

  const activeVisits = visitPermissions.filter((p) => {
    const from = new Date(p.validFrom)
    const to = new Date(p.validTo)
    return now >= from && now <= to
  }).length

  const pendingVisits = visitPermissions.filter((p) => {
    return new Date(p.validFrom) > now
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
            Visitas programadas para hoy
          </h1>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="Permisos Hoy"
            value={totalVisits}
            icon={Clock}
            colorClass="bg-gradient-to-br from-purple-600 to-purple-800"
          />
          <KpiCard
            title="Visitas Activas"
            value={activeVisits}
            icon={CheckCircle}
            colorClass="bg-gradient-to-br from-emerald-600 to-teal-700"
          />
          <KpiCard
            title="Próximas Entradas"
            value={pendingVisits}
            icon={AlertTriangle}
            colorClass="bg-gradient-to-br from-amber-500 to-orange-600"
          />
        </div>

        {/* Cards Grid */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-purple-500 rounded-full"></span>
            Permisos de Entrada Programados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visitPermissions.map((permission) => (
              <VisitCard key={permission.id} permission={permission} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}