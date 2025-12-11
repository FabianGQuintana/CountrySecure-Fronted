"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  FiChevronUp,
  FiChevronDown,
  FiPlus,
  FiSearch,
  FiCalendar,
  FiUsers,
  FiMoreVertical,
  FiEye,
} from "react-icons/fi";
import Link from "next/link";
import { BuscadorTablas } from "@/components/buscadorTablas";
import ModalNewAmenity from "./modalNewAmenities";
import { IamenitiesRegister } from "@/types";
import { useSession } from "next-auth/react";
import { Estados } from "@/components/estados";

export function TablaAmenities({
  params = [],
}: {
  params?: IamenitiesRegister[];
}) {
  const { data: session, status } = useSession();
  const [amenities, setAmenities] = useState<IamenitiesRegister[]>(
    params || []
  );
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [columnaOrden, setColumnaOrden] =
    useState<keyof IamenitiesRegister>("amenityName");
  const amenitiesPorPagina = 8;
  const [modalOpen, setModalOpen] = useState(false);
  const [vistaTarjetas, setVistaTarjetas] = useState(true);

  // Función para refrescar amenities usando token de sesión
  const refresAmenities = useCallback(async () => {
    if (!session) return [];
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/Amenity`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      if (!response.ok) throw new Error("Error al refrescar amenities");
      const data: IamenitiesRegister[] = await response.json();
      setAmenities(data);
      return data;
    } catch (error) {
      console.error("Error en refresAmenities:", error);
      return [];
    }
  }, [session]);

  useEffect(() => {
    if (status === "authenticated") {
      refresAmenities();
    }
  }, [status, refresAmenities]);

  // Filtrado y ordenamiento
  const amenitiesFiltradas = useMemo(() => {
    const terminoBusqueda = filtro.toLowerCase();
    return amenities
      .filter(
        (a) =>
          (a.amenityName?.toLowerCase() || "").includes(terminoBusqueda) ||
          (a.description?.toLowerCase() || "").includes(terminoBusqueda) ||
          (a.status?.toLowerCase() || "").includes(terminoBusqueda)
      )
      .sort((a, b) => {
        const valorA = String(a[columnaOrden] || "").toLowerCase();
        const valorB = String(b[columnaOrden] || "").toLowerCase();
        return ordenAscendente
          ? valorA.localeCompare(valorB)
          : valorB.localeCompare(valorA);
      });
  }, [amenities, filtro, columnaOrden, ordenAscendente]);

  // Paginación
  const {
    amenitiesPagina,
    totalPaginas,
    indicePrimerAmenity,
    indiceUltimoAmenity,
  } = useMemo(() => {
    const indiceUltimo = paginaActual * amenitiesPorPagina;
    const indicePrimero = indiceUltimo - amenitiesPorPagina;
    return {
      amenitiesPagina: amenitiesFiltradas.slice(indicePrimero, indiceUltimo),
      totalPaginas: Math.ceil(amenitiesFiltradas.length / amenitiesPorPagina),
      indicePrimerAmenity: indicePrimero,
      indiceUltimoAmenity: indiceUltimo,
    };
  }, [paginaActual, amenitiesPorPagina, amenitiesFiltradas]);

  const cambiarPagina = useCallback(
    (numeroPagina: number) => {
      setPaginaActual(Math.max(1, Math.min(numeroPagina, totalPaginas)));
    },
    [totalPaginas]
  );

  const generarRangoPaginas = useCallback(() => {
    const paginas: number[] = [];
    const paginasAMostrar = 5;
    let inicio = 1;
    let fin = totalPaginas;

    if (totalPaginas > paginasAMostrar) {
      if (paginaActual <= Math.ceil(paginasAMostrar / 2)) {
        fin = paginasAMostrar;
      } else if (
        paginaActual >=
        totalPaginas - Math.floor(paginasAMostrar / 2)
      ) {
        inicio = totalPaginas - paginasAMostrar + 1;
      } else {
        inicio = paginaActual - Math.floor(paginasAMostrar / 2);
        fin = paginaActual + Math.floor(paginasAMostrar / 2);
      }
    }

    for (let i = inicio; i <= fin; i++) paginas.push(i);
    return paginas;
  }, [paginaActual, totalPaginas]);

  const ordenarPorColumna = useCallback(
    (columna: keyof IamenitiesRegister) => {
      if (columna === columnaOrden) setOrdenAscendente(!ordenAscendente);
      else {
        setColumnaOrden(columna);
        setOrdenAscendente(true);
      }
      setPaginaActual(1);
    },
    [columnaOrden, ordenAscendente]
  );

  if (status === "loading")
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!session || session.user.role !== "Admin")
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <FiChevronUp className="w-8 h-8 text-red-600 transform rotate-90" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700">
          Acceso restringido
        </h3>
        <p className="text-gray-500">No tienes permisos para ver esta página</p>
      </div>
    );

  return (
    <div className="w-full h-max bg-linear-to-br from-gray-50 to-gray-100/30 min-h-screen p-4 sm:p-6">
      {/* Encabezado */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-8 bg-lienar-to-b from-blue-600 to-indigo-500 rounded-full"></div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Gestión de Amenities
              </h2>
            </div>
            <p className="text-sm text-gray-600 ml-5">
              <span className="font-semibold text-blue-700">
                {amenitiesFiltradas.length}
              </span>{" "}
              amenity
              {amenitiesFiltradas.length !== 1 ? "s" : ""} encontrado
              {amenitiesFiltradas.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            {/* Selector de vista */}
            <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setVistaTarjetas(true)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  vistaTarjetas
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Tarjetas
              </button>
              <button
                onClick={() => setVistaTarjetas(false)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  !vistaTarjetas
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Lista
              </button>
            </div>

            {/* Buscador */}
            <div className="relative w-full sm:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <BuscadorTablas
                  placeholder="Buscar amenities..."
                  onBuscar={(termino) => {
                    setFiltro(termino);
                    setPaginaActual(1);
                  }}
                  valorInicial={filtro}
                  delay={300}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Botón Nuevo */}
            <button
              className="px-6 py-3 bg-lienar-to-r from-blue-600 to-indigo-600 text-black rounded-xl hover:from-blue-700 hover:bg-blue-600 hover:to-indigo-700 cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium group"
              onClick={() => setModalOpen(true)}
            >
              <FiPlus className="w-5 h-5 text-black group-hover:rotate-90 transition-transform duration-300" />
              Nueva Amenity
            </button>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <ModalNewAmenity
            onSuccess={async () => {
              await refresAmenities();
              setModalOpen(false);
            }}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>

      {/* Vista de Tarjetas */}
      {vistaTarjetas ? (
        <div className="mb-8">
          {/* Grid de tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {amenitiesPagina.length > 0 ? (
              amenitiesPagina.map((amenity) => (
                <div
                  key={amenity.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50 group hover:-translate-y-1"
                >
                  {/* Cabecera de la tarjeta con gradiente */}
                  <div className="h-2 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                  <div className="p-6">
                    {/* Título y estado */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span className="text-blue-700 font-bold text-xl">
                              {amenity.amenityName?.[0]?.toUpperCase() || "A"}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg truncate">
                              {amenity.amenityName || "Sin nombre"}
                            </h3>
                            <div className="mt-1">
                              <Estados estado={amenity.status} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <FiMoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    {/* Descripción */}
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                      {amenity.description || "Sin descripción disponible"}
                    </p>

                    {/* Información detallada */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600">
                            Horarios
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {amenity.schedules || "No especificado"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FiUsers className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm text-gray-600">
                            Capacidad
                          </span>
                        </div>
                        <span className="font-bold text-gray-900 text-lg">
                          {amenity.capacity || "N/A"}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            {amenity.capacity ? "personas" : ""}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-6 pt-5 border-t border-gray-200/50 flex justify-center">
                      <Link
                        href={`/admin/amenities/${amenity.id}/`}
                        className="flex items-center text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded-full hover:bg-indigo-50"
                        title="Ver detalles"
                      >
                        <span className="mr-1">Más</span>
                        <FiEye className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-24 h-24 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                    <FiSearch className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No se encontraron amenities
                  </h3>
                  <p className="text-gray-500 text-center">
                    Intenta con otros términos de búsqueda o crea una nueva
                    amenity
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Vista de Tabla (mantenida del código anterior) */
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-200/50 mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100/50">
                <tr>
                  {[
                    "amenityName",
                    "description",
                    "schedules",
                    "capacity",
                    "status",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100/70 transition-all duration-200 group"
                      onClick={() =>
                        ordenarPorColumna(col as keyof IamenitiesRegister)
                      }
                    >
                      <div className="flex items-center gap-2">
                        {col === "amenityName"
                          ? "Nombre"
                          : col === "description"
                          ? "Descripción"
                          : col === "schedules"
                          ? "Horarios"
                          : col === "capacity"
                          ? "Capacidad"
                          : "Estado"}
                        <div className="flex flex-col">
                          <FiChevronUp
                            className={`h-3 w-3 -mb-1 transition-all ${
                              columnaOrden === col && ordenAscendente
                                ? "text-blue-600"
                                : "text-gray-300 group-hover:text-gray-400"
                            }`}
                          />
                          <FiChevronDown
                            className={`h-3 w-3 transition-all ${
                              columnaOrden === col && !ordenAscendente
                                ? "text-blue-600"
                                : "text-gray-300 group-hover:text-gray-400"
                            }`}
                          />
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200/60">
                {amenitiesPagina.length > 0 ? (
                  amenitiesPagina.map((amenity) => (
                    <tr
                      key={amenity.id}
                      className="hover:bg-linear-to-r hover:from-blue-50/30 hover:to-indigo-50/20 transition-all duration-200 group"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10 rounded-lg bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                            <span className="text-blue-700 font-bold text-lg">
                              {amenity.amenityName?.[0]?.toUpperCase() || "A"}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {amenity.amenityName || "-"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {amenity.description || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                          <span className="text-sm font-medium text-amber-800">
                            {amenity.schedules || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-semibold text-gray-900 mr-2">
                            {amenity.capacity ?? "-"}
                          </div>
                          {amenity.capacity && (
                            <span className="text-xs text-gray-500">
                              personas
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="transform scale-110">
                          <Estados estado={amenity.status} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <FiSearch className="w-10 h-10 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700">
                            No se encontraron amenities
                          </h3>
                          <p className="text-gray-500 mt-1">
                            Intenta con otros términos de búsqueda
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Paginación (común para ambas vistas) */}
      {amenitiesFiltradas.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-600 mb-4 sm:mb-0">
              Mostrando{" "}
              <span className="font-semibold text-gray-900">
                {indicePrimerAmenity + 1}
              </span>{" "}
              a{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(indiceUltimoAmenity, amenitiesFiltradas.length)}
              </span>{" "}
              de{" "}
              <span className="font-semibold text-blue-700">
                {amenitiesFiltradas.length}
              </span>{" "}
              amenities
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <FiChevronUp className="transform rotate-90 h-4 w-4 text-gray-600" />
              </button>

              {generarRangoPaginas().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => cambiarPagina(pageNum)}
                  className={`min-w-10 h-10 rounded-lg transition-all duration-200 font-medium ${
                    paginaActual === pageNum
                      ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <FiChevronUp className="transform -rotate-90 h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Barra de progreso */}
          {totalPaginas > 1 && (
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${(paginaActual / totalPaginas) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Página {paginaActual}</span>
                <span>de {totalPaginas}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
