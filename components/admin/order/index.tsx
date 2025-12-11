// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { FiRefreshCcw, FiSearch } from "react-icons/fi";
// import { useSession } from "next-auth/react";
// import { Estados } from "@/components/estados";
// import { IOrder, OrderStatus } from "@/types";
// export default function TablaOrders() {
//   const router = useRouter();

//   // Estados
//   const [orders, setOrders] = useState<IOrder[]>([]);
//   const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const { data: session } = useSession();
//   const OrderTypeLabels: Record<string, string> = {
//     Jardineria: "Jardinería",
//     Plomeria: "Plomería",
//     Electricidad: "Electricidad",
//     Limpieza: "Limpieza",
//     MantenimientoGeneral: "Mantenimiento General",
//     Piscina: "Piscina",
//     Seguridad: "Seguridad",
//   };

//   // Paginación
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 7;

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_HOST}/api/order`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session?.user.accessToken}`,
//           },
//           cache: "no-store",
//         }
//       );
//       const data = await response.json();

//       setOrders(data);
//       setFilteredOrders(data);
//     } catch (error) {
//       console.error("Error cargando órdenes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Buscar por descripción o proveedor
//   const handleSearch = (value: string) => {
//     setSearch(value);

//     const filtered = orders.filter(
//       (o) =>
//         o.description.toLowerCase().includes(value.toLowerCase()) ||
//         o.supplierName.toLowerCase().includes(value.toLowerCase())
//     );

//     setFilteredOrders(filtered);
//     setCurrentPage(1);
//   };

//   // Cargar datos al inicio
//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // Paginación
//   const indexLast = currentPage * itemsPerPage;
//   const indexFirst = indexLast - itemsPerPage;
//   const currentItems = filteredOrders.slice(indexFirst, indexLast);

//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

//   const goToEdit = (id: string) => {
//     router.push(`/admin/orders/${id}`);
//   };
//   const getOrderTypeName = (type: any) => {
//     if (!type) return "Desconocido";

//     // si viene como string
//     if (typeof type === "string") {
//       return OrderTypeLabels[type] ?? "Desconocido";
//     }

//     // Por si la api devuelve numeros
//     const numeric = Number(type);
//     return OrderTypeLabels[OrderStatus[numeric]] ?? "Desconocido";
//   };
//   return (
//     <div className="p-5">
//       <h1 className="text-2xl font-bold mb-4">Servicios/Proveedores</h1>

//       {/* Buscador y Refresh */}
//       <div className="flex items-center gap-3 mb-4">
//         <div className="flex items-center gap-2 border rounded px-3 py-2 w-80">
//           <FiSearch />
//           <input
//             type="text"
//             className="outline-none w-full"
//             placeholder="Buscar por descripción o proveedor..."
//             value={search}
//             onChange={(e) => handleSearch(e.target.value)}
//           />
//         </div>

//         <button
//           onClick={fetchOrders}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//         >
//           <FiRefreshCcw /> Recargar
//         </button>
//       </div>

//       {/* Tabla */}
//       <div className="border rounded-lg overflow-hidden shadow">
//         {loading ? (
//           <p className="p-4 text-center">Cargando órdenes...</p>
//         ) : filteredOrders.length === 0 ? (
//           <p className="p-4 text-center">No se encontraron órdenes.</p>
//         ) : (
//           <table className="w-full text-left">
//             <thead className="bg-gray-100 border-b">
//               <tr>
//                 <th className="p-3">Descripción</th>
//                 <th className="p-3">Proveedor</th>
//                 <th className="p-3">Tipo</th>
//                 <th className="p-3">Estado</th>
//                 <th className="p-3 text-center">Acciones</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.map((order) => (
//                 <tr key={order.id} className="border-b hover:bg-gray-50">
//                   <td className="p-3">{order.description}</td>
//                   <td className="p-3">{order.supplierName}</td>
//                   <td className="p-3">{getOrderTypeName(order.orderType)}</td>
//                   <Estados estado={order.status} />
//                   <td className="p-3 text-center">
//                     <button
//                       className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
//                       onClick={() => goToEdit(order.id)}
//                     >
//                       Más
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Paginación */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-5 gap-3">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//             className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-40"
//           >
//             Anterior
//           </button>

//           <span className="px-3 py-1">
//             Página {currentPage} de {totalPages}
//           </span>

//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-40"
//           >
//             Siguiente
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiRefreshCcw,
  FiSearch,
  FiEye,
  FiFilter,
  FiTool,
  FiTruck,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiList,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import {
  HiOutlineDocumentText,
  HiOutlineStatusOnline,
  HiOutlineStatusOffline,
} from "react-icons/hi";
import { useSession } from "next-auth/react";
import { Estados } from "@/components/estados";
import { IOrder } from "@/types";

export default function TablaOrders() {
  const router = useRouter();
  const { data: session } = useSession();

  // Estados
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const itemsPerPage = 8;

  const OrderTypeLabels: Record<string, string> = {
    Jardineria: "Jardinería",
    Plomeria: "Plomería",
    Electricidad: "Electricidad",
    Limpieza: "Limpieza",
    MantenimientoGeneral: "Mantenimiento General",
    Piscina: "Piscina",
    Seguridad: "Seguridad",
  };

  const fetchOrders = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/order`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
          cache: "no-store",
        }
      );
      const data = await response.json();
      setOrders(data);
      applyFilters(data, search, statusFilter);
    } catch (error) {
      console.error("Error cargando órdenes:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Aplicar filtros combinados
  const applyFilters = (
    ordersList: IOrder[],
    searchTerm: string,
    status: string
  ) => {
    let filtered = ordersList;

    // Filtro por estado
    if (status !== "all") {
      filtered = filtered.filter((order) =>
        status === "active" ? order.status : !order.status
      );
    }

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    applyFilters(orders, value, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    applyFilters(orders, search, status);
  };

  // Cargar datos al inicio
  useEffect(() => {
    fetchOrders();
  }, []);

  // Paginación
  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentItems = filteredOrders.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const goToEdit = (id: string) => {
    router.push(`/admin/orders/${id}`);
  };

  const getOrderTypeName = (type: any) => {
    if (!type) return "Desconocido";
    if (typeof type === "string") {
      return OrderTypeLabels[type] ?? "Desconocido";
    }
    const numeric = Number(type);
    return OrderTypeLabels[numeric.toString()] ?? "Desconocido";
  };

  // Obtener estadísticas de órdenes
  const getOrderStats = () => {
    const activeOrders = orders.filter((o) => o.status).length;
    const pendingOrders = orders.filter((o) => !o.status).length;
    const uniqueTypes = Array.from(
      new Set(orders.map((o) => o.orderType))
    ).length;

    return { activeOrders, pendingOrders, uniqueTypes };
  };

  const stats = getOrderStats();

  return (
    <div className="min-h-screen  p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Gestión de Servicios
            </h1>
            <p className="text-gray-500 flex items-center">
              <HiOutlineDocumentText className="mr-2" />
              Control centralizado de solicitudes de servicio
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchOrders}
              disabled={isRefreshing}
              className="flex items-center px-4 py-2 bg-linear-to-r from-gray-200 to-gray-300 text-gray-700 rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all duration-300 shadow-sm"
            >
              <FiRefreshCcw
                className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Actualizando..." : "Actualizar"}
            </motion.button>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                placeholder="Buscar por descripción o proveedor..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStatusFilter("all")}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl transition-all ${
                statusFilter === "all"
                  ? "bg-linear-to-r from-gray-800 to-gray-700 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <FiFilter className="mr-2" />
              Todos
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStatusFilter("active")}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl transition-all ${
                statusFilter === "active"
                  ? "bg-linear-to-r from-emerald-500 to-teal-400 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <HiOutlineStatusOnline className="mr-2" />
              Activos
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStatusFilter("inactive")}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl transition-all ${
                statusFilter === "inactive"
                  ? "bg-linear-to-r from-amber-500 to-orange-400 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <HiOutlineStatusOffline className="mr-2" />
              Inactivos
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-b-fuchsia-700">
          {/* Tabla */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-500">Cargando servicios...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mb-4 p-4 bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl inline-block">
                  <FiAlertCircle className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No se encontraron servicios
                </h3>
                <p className="text-gray-500 mb-6">
                  {search || statusFilter !== "all"
                    ? "Intenta ajustar tus filtros de búsqueda"
                    : "No hay servicios registrados en el sistema"}
                </p>
                {(search || statusFilter !== "all") && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("all");
                      applyFilters(orders, "", "all");
                    }}
                    className="px-5 py-2.5 bg-linear-to-r from-gray-600 to-gray-500 text-white rounded-xl hover:shadow-lg transition-shadow"
                  >
                    Limpiar filtros
                  </motion.button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <HiOutlineDocumentText className="mr-2" />
                        Descripción del Servicio
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiUser className="mr-2" />
                        Proveedor
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiTool className="mr-2" />
                        Categoría
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <HiOutlineStatusOnline className="mr-2" />
                        Estado
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  <AnimatePresence>
                    {currentItems.map((order) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="hover:bg-linear-to-r hover:from-blue-50/30 hover:to-cyan-50/30 transition-all duration-300"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <div className="bg-linear-to-br from-blue-50 to-blue-100 p-3 rounded-lg mr-4">
                              <HiOutlineDocumentText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 mb-1">
                                {order.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-linear-to-br from-gray-100 to-gray-200 rounded-lg mr-3">
                              <FiTruck className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.supplierName}
                              </div>
                              <div className="text-xs text-gray-500">
                                Proveedor asignado
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-linear-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-100">
                            {getOrderTypeName(order.orderType)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Estados estado={order.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => goToEdit(order.id)}
                            className="inline-flex items-center px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-400 text-white rounded-xl hover:shadow-lg transition-shadow text-sm font-medium"
                          >
                            <FiEye className="mr-2" />
                            Ver Detalles
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && filteredOrders.length > 0 && (
            <div className="bg-linear-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-gray-700">
                    Mostrando{" "}
                    <span className="font-semibold">{indexFirst + 1}</span> a{" "}
                    <span className="font-semibold">
                      {Math.min(indexLast, filteredOrders.length)}
                    </span>{" "}
                    de{" "}
                    <span className="font-semibold">
                      {filteredOrders.length}
                    </span>{" "}
                    servicios
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className={`p-2.5 rounded-lg ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-700 hover:bg-white hover:shadow-md border border-gray-200"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </motion.button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                          currentPage === pageNum
                            ? "bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                            : "text-gray-700 hover:bg-white hover:shadow-md border border-gray-200"
                        }`}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={`p-2.5 rounded-lg ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-700 hover:bg-white hover:shadow-md border border-gray-200"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
