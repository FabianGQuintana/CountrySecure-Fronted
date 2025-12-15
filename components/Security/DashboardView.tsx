// "use client"
// import type React from "react"
// import { useState, useEffect } from "react"
// import { fetchTodayPermissions } from "@/actions/securityActions"
// import { type EntryPermission, PermissionType } from "./data/mockData"
// import { Users, Clock, CheckCircle, Car, AlertTriangle } from "lucide-react"

// interface KpiCardProps {
//   title: string
//   value: number
//   icon: React.ElementType
//   color: string
// }

// const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, color }) => (
//   <div className={`p-6 bg-white rounded-xl shadow-lg border-l-4 ${color} transition duration-300 hover:shadow-xl`}>
//     <div className="flex justify-between items-center">
//       <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
//       <Icon className={`h-6 w-6 text-gray-400`} />
//     </div>
//     <p className="text-4xl font-extrabold text-gray-900 mt-2">{value}</p>
//   </div>
// )

// const DashboardView: React.FC = () => {
//   const [permissions, setPermissions] = useState<EntryPermission[]>([])
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const loadData = async () => {
//       setIsLoading(true)
//       try {
//         const data = await fetchTodayPermissions()
//         setPermissions(data)
//       } catch (error) {
//         console.error("Error al cargar datos del Dashboard:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     loadData()
//   }, [])

//   // ----------------------------------------------------
//   // Lógica de Cálculo de KPIs
//   // ----------------------------------------------------
//   const totalPending = permissions.filter((p) => p.status === "Pending").length

//   // Los permisos 'Completed' que AÚN no tienen DepartureTime se consideran ACTIVO/Dentro
//   const totalActive = permissions.filter((p) => p.status !== "Pending" && p.entryTime && !p.departureTime).length

//   const totalVisitors = permissions.filter((p) => p.type === PermissionType.VISIT && p.status !== "Cancelled").length
//   const totalMaintenance = permissions.filter(
//     (p) => p.type === PermissionType.MAINTENANCE && p.status !== "Cancelled",
//   ).length

//   const totalVehicles = permissions.filter(
//     (p) => p.visitor?.vehiclePlate && p.status !== "Cancelled" && !p.departureTime,
//   ).length

//   // ----------------------------------------------------
//   // Renderizado
//   // ----------------------------------------------------
//   return (
//     <div className="space-y-8">
//       <h1 className="text-4xl font-bold text-gray-900">Dashboard de Seguridad</h1>
//       <p className="text-lg text-muted-foreground">Resumen de los movimientos y estados clave del día.</p>

//       {isLoading ? (
//         <div className="text-center p-10 text-xl text-teal-600">Cargando datos en tiempo real...</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <KpiCard title="Visitas Activas (Dentro)" value={totalActive} icon={Clock} color="border-l-teal-600" />
//           <KpiCard title="Próximas Entradas" value={totalPending} icon={Users} color="border-l-amber-500" />
//           <KpiCard title="Total Visitas / Día" value={totalVisitors} icon={CheckCircle} color="border-l-blue-500" />
//           <KpiCard title="Vehículos en Lote" value={totalVehicles} icon={Car} color="border-l-red-500" />
//           <KpiCard
//             title="Servicios/Mantenimiento"
//             value={totalMaintenance}
//             icon={AlertTriangle}
//             color="border-l-purple-500"
//           />
//         </div>
//       )}

//       {/* Puedes añadir gráficos o listados rápidos aquí */}
//     </div>
//   )
// }

// export default DashboardView
