// "use client"
// import type React from "react"
// import { useState, useCallback, useEffect } from "react"
// import VisitCard from "./VisitCard"
// import type { EntryPermission } from "./data/mockData"
// import ModalVisitDetails from "./ModalVisitDetails"
// import { Clock, CheckCircle, AlertTriangle } from "lucide-react"
// import { mockPermissions } from "./data/mockData"

// interface KpiCardProps {
//   title: string
//   value: number
//   icon: React.ElementType
//   colorClass: string
// }

// const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, colorClass }) => (
//   <div
//     className={`p-5 rounded-lg shadow-md ${colorClass} transition-shadow hover:shadow-xl bg-white border border-gray-100`}
//   >
//     <div className="flex items-center justify-between">
//       <div>
//         <h3 className="text-sm font-medium text-muted-foreground uppercase">{title}</h3>
//         <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
//       </div>
//       <Icon className="h-8 w-8 text-teal-600/70" />
//     </div>
//   </div>
// )

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5021"

// interface MainViewProps {
//   guardId?: string
// }

// const MainView: React.FC<MainViewProps> = ({ guardId }) => {
//   const [permissions, setPermissions] = useState<EntryPermission[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [selectedPermission, setSelectedPermission] = useState<EntryPermission | null>(null)

//   const fetchPermissions = useCallback(async () => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       const url = `${API_BASE_URL}/api/entrypermissions/today`
//       const controller = new AbortController()
//       const timeoutId = setTimeout(() => controller.abort(), 10000)

//       const response = await fetch(url, {
//         signal: controller.signal,
//         credentials: "include",
//       })

//       clearTimeout(timeoutId)

//       if (!response.ok) {
//         throw new Error(`Error ${response.status}: Fallo al cargar los permisos.`)
//       }

//       const rawData = await response.json()
//       setPermissions(rawData as EntryPermission[])
//     } catch (err) {
//       const isAbortError = err instanceof Error && (err.name === "AbortError" || err.message?.includes("aborted"))

//       if (isAbortError) {
//         setError("La conexión al backend tardó demasiado (timeout). Usando datos de prueba.")
//       } else {
//         const errorMsg = err instanceof Error ? err.message : "Error desconocido"
//         setError(`No se pudo conectar con el backend. Usando datos de prueba.`)
//       }

//       setPermissions(mockPermissions as EntryPermission[])
//     } finally {
//       setIsLoading(false)
//     }
//   }, [])

//   const handleViewDetails = (permission: EntryPermission) => {
//     setSelectedPermission(permission)
//   }

//   const totalVisits = permissions.length

//   const activeVisits = permissions.filter((p) => {
//     return p.entryTime !== null && p.departureTime === null
//   }).length

//   const pendingVisits = permissions.filter((p) => {
//     return p.entryTime === null
//   }).length

//   useEffect(() => {
//     fetchPermissions()
//   }, [fetchPermissions])

//   if (isLoading) {
//     return (
//       <div className="p-8 text-center">
//         <div className="text-lg text-teal-600 mb-4">Cargando permisos del día...</div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       <h1 className="text-3xl font-bold text-foreground">Tablero Principal - Visitas Hoy</h1>

//       {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//         <KpiCard title="Permisos Hoy" value={totalVisits} icon={Clock} colorClass="bg-card" />
//         <KpiCard title="Visitas Activas" value={activeVisits} icon={CheckCircle} colorClass="bg-card" />
//         <KpiCard title="Próximas Entradas" value={pendingVisits} icon={AlertTriangle} colorClass="bg-card" />
//       </div>

//       <div>
//         <h2 className="text-2xl font-semibold mb-4 text-foreground border-b pb-2">Permisos de Entrada Programados</h2>
//         {permissions.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {permissions.map((permission) => (
//               <VisitCard key={permission.id} permission={permission} onViewDetails={handleViewDetails} />
//             ))}
//           </div>
//         ) : (
//           <p className="text-muted-foreground italic text-lg p-4 bg-gray-100 rounded-lg">
//             No hay permisos de entrada programados para hoy.
//           </p>
//         )}
//       </div>

//       {selectedPermission && (
//         <ModalVisitDetails
//           permission={selectedPermission}
//           onClose={() => setSelectedPermission(null)}
//           onSuccess={fetchPermissions}
//           guardId={guardId}
//         />
//       )}
//     </div>
//   )
// }

// export default MainView
