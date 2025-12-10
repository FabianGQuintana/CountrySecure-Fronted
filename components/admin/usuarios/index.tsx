"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { BuscadorTablas } from "@/components/buscadorTablas";
import { Roles } from "@/components/roles";
import { Iusuario } from "@/types";
import {
  FiChevronUp,
  FiChevronDown,
  FiEye,
  FiUser,
  FiUserPlus,
  FiFilter,
  FiRefreshCw,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import {
  HiOutlineUserAdd,
  HiOutlineUserGroup,
  HiOutlineStatusOnline,
  HiOutlineStatusOffline,
} from "react-icons/hi";
import ModalRegisterUser from "./modalNewUser";
import { Estados } from "@/components/estados";
import { motion, AnimatePresence } from "framer-motion";

export function TablaUsuarios({ params = [] }: { params?: Iusuario[] }) {
  const [usuarios, setUsuarios] = useState<Iusuario[]>(params || []);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [columnaOrden, setColumnaOrden] = useState<keyof Iusuario>("email");
  const [modalOpen, setModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const usuariosPorPagina = 15;

  const refreshUsers = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/users?role=Resident`,
        {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      if (!response.ok) throw new Error("Error al refrescar usuarios");
      const data = await response.json();
      setUsuarios(data);
      return data;
    } catch (error) {
      console.error("Error en refreshUsers:", error);
      return [];
    } finally {
      setIsRefreshing(false);
    }
  };

  // Cargar usuarios inicialmente
  useEffect(() => {
    refreshUsers();
  }, []);

  // Filtrar usuarios por estado activo/inactivo
  const usuariosFiltradosPorEstado = useMemo(() => {
    if (filtroActivo === "all") return usuarios;
    return usuarios.filter((user) =>
      filtroActivo === "active" ? user.active : !user.active
    );
  }, [usuarios, filtroActivo]);

  // Memoizar usuarios filtrados y ordenados
  const usuariosFiltrados = useMemo(() => {
    const terminoBusqueda = filtro.toLowerCase();
    return usuariosFiltradosPorEstado
      .filter(
        (user) =>
          user.name?.toLowerCase().includes(terminoBusqueda) ||
          user.lastname?.toLowerCase().includes(terminoBusqueda) ||
          user.email?.toLowerCase().includes(terminoBusqueda)
      )
      .sort((a, b) => {
        const valorA = String(a[columnaOrden] || "").toLowerCase();
        const valorB = String(b[columnaOrden] || "").toLowerCase();
        return ordenAscendente
          ? valorA.localeCompare(valorB)
          : valorB.localeCompare(valorA);
      });
  }, [usuariosFiltradosPorEstado, filtro, columnaOrden, ordenAscendente]);

  // Paginación
  const {
    usuariosPagina,
    totalPaginas,
    indicePrimerUsuario,
    indiceUltimoUsuario,
  } = useMemo(() => {
    const indiceUltimo = paginaActual * usuariosPorPagina;
    const indicePrimer = indiceUltimo - usuariosPorPagina;
    return {
      usuariosPagina: usuariosFiltrados.slice(indicePrimer, indiceUltimo),
      totalPaginas: Math.ceil(usuariosFiltrados.length / usuariosPorPagina),
      indicePrimerUsuario: indicePrimer,
      indiceUltimoUsuario: indiceUltimo,
    };
  }, [paginaActual, usuariosPorPagina, usuariosFiltrados]);

  // Cambiar página con validación
  const cambiarPagina = useCallback(
    (numeroPagina: number) => {
      setPaginaActual(Math.max(1, Math.min(numeroPagina, totalPaginas)));
    },
    [totalPaginas]
  );

  // Generar rango de páginas para la paginación
  const generarRangoPaginas = useCallback(() => {
    const paginas = [];
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
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    return paginas;
  }, [paginaActual, totalPaginas]);

  // Ordenar por columna
  const ordenarPorColumna = useCallback(
    (columna: keyof Iusuario) => {
      if (columna === columnaOrden) {
        setOrdenAscendente(!ordenAscendente);
      } else {
        setColumnaOrden(columna);
        setOrdenAscendente(true);
      }
      setPaginaActual(1);
    },
    [columnaOrden, ordenAscendente]
  );

  // Toggle selección de usuario
  const toggleSeleccion = (id: string) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  // Toggle todos los usuarios de la página
  const toggleTodosSeleccionados = () => {
    if (seleccionados.length === usuariosPagina.length) {
      setSeleccionados([]);
    } else {
      const todosIds = usuariosPagina.map((user) => user.id);
      setSeleccionados(todosIds);
    }
  };

  // Función para cambiar estado del usuario
  const cambiarEstadoUsuario = async (id: string, nuevoEstado: boolean) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/users/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ active: nuevoEstado }),
        }
      );

      if (response.ok) {
        await refreshUsers();
        setMenuAbierto(null);
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  // Renderizar avatar del usuario
  const renderAvatar = (nombre: string, email: string) => (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md">
          <span className="text-white font-semibold text-sm">
            {nombre?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full border-2 border-white"></div>
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-800">{nombre}</div>
        <div className="text-xs text-gray-500">{email}</div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2"
            >
              Gestión de Usuarios
            </motion.h1>
            <p className="text-gray-500 flex items-center">
              <HiOutlineUserGroup className="mr-2" />
              {usuariosFiltrados.length} usuario
              {usuariosFiltrados.length !== 1 ? "s" : ""} en el sistema
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            {/* Botón Refrescar */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshUsers}
              disabled={isRefreshing}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all duration-300 shadow-sm"
            >
              <FiRefreshCw
                className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Actualizando..." : "Actualizar"}
            </motion.button>

            {/* Botón Nuevo Usuario */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalOpen(true)}
              className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <HiOutlineUserAdd className="mr-2" />
              Nuevo Usuario
            </motion.button>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <div className="relative">
              <BuscadorTablas
                placeholder="Buscar por nombre, apellido o email..."
                onBuscar={(termino) => {
                  setFiltro(termino);
                  setPaginaActual(1);
                }}
                valorInicial={filtro}
                delay={300}
              />
            </div>
          </div>

          {/* Filtros de estado */}
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFiltroActivo("all")}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-xl transition-all ${
                filtroActivo === "all"
                  ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <FiFilter className="mr-2" />
              Todos
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFiltroActivo("active")}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-xl transition-all ${
                filtroActivo === "active"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <HiOutlineStatusOnline className="mr-2" />
              Activos
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFiltroActivo("inactive")}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-xl transition-all ${
                filtroActivo === "inactive"
                  ? "bg-gradient-to-r from-rose-500 to-red-400 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <HiOutlineStatusOffline className="mr-2" />
              Inactivos
            </motion.button>
          </div>
        </div>

        {/* Modal para nuevo usuario */}
        <AnimatePresence>
          {modalOpen && (
            <ModalRegisterUser
              onSuccess={async () => {
                await refreshUsers();
                setModalOpen(false);
              }}
              onClose={() => setModalOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Contenido principal - Tabla */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header de la tabla con selección */}
        {seleccionados.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <FiUser className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">
                    {seleccionados.length} usuarios seleccionados
                  </h3>
                  <p className="text-sm text-blue-600">
                    Acciones en lote disponibles
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Lógica para activar múltiples usuarios
                    seleccionados.forEach((id) =>
                      cambiarEstadoUsuario(id, true)
                    );
                    setSeleccionados([]);
                  }}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  <FiCheckCircle className="mr-2" />
                  Activar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Lógica para desactivar múltiples usuarios
                    seleccionados.forEach((id) =>
                      cambiarEstadoUsuario(id, false)
                    );
                    setSeleccionados([]);
                  }}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-rose-500 to-red-400 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  <FiXCircle className="mr-2" />
                  Desactivar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSeleccionados([])}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-400 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  Limpiar
                </motion.button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        seleccionados.length === usuariosPagina.length &&
                        usuariosPagina.length > 0
                      }
                      onChange={toggleTodosSeleccionados}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors rounded-lg"
                  onClick={() => ordenarPorColumna("name")}
                >
                  <div className="flex items-center">
                    Usuario
                    <div className="ml-2">
                      {columnaOrden === "name" &&
                        (ordenAscendente ? (
                          <FiChevronUp className="w-4 h-4 text-blue-500" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 text-blue-500" />
                        ))}
                    </div>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors rounded-lg"
                  onClick={() => ordenarPorColumna("lastname")}
                >
                  <div className="flex items-center">
                    Apellido
                    <div className="ml-2">
                      {columnaOrden === "lastname" &&
                        (ordenAscendente ? (
                          <FiChevronUp className="w-4 h-4 text-blue-500" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 text-blue-500" />
                        ))}
                    </div>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors rounded-lg"
                  onClick={() => ordenarPorColumna("email")}
                >
                  <div className="flex items-center">
                    Contacto
                    <div className="ml-2">
                      {columnaOrden === "email" &&
                        (ordenAscendente ? (
                          <FiChevronUp className="w-4 h-4 text-blue-500" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 text-blue-500" />
                        ))}
                    </div>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors rounded-lg"
                  onClick={() => ordenarPorColumna("role")}
                >
                  <div className="flex items-center">
                    Rol
                    <div className="ml-2">
                      {columnaOrden === "role" &&
                        (ordenAscendente ? (
                          <FiChevronUp className="w-4 h-4 text-blue-500" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 text-blue-500" />
                        ))}
                    </div>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors rounded-lg"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>

            {/* CUERPO DE LA TABLA */}
            <tbody className="bg-white divide-y divide-gray-100">
              <AnimatePresence>
                {usuariosPagina.length > 0 ? (
                  usuariosPagina.map((usuario) => (
                    <motion.tr
                      key={usuario.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-cyan-50/30 transition-all duration-300"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={seleccionados.includes(usuario.id)}
                          onChange={() => toggleSeleccion(usuario.id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderAvatar(usuario.name, usuario.email)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {usuario.lastname}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {usuario.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {usuario.phone || "Sin teléfono"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Roles rol={usuario.role} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Estados estado={usuario.active} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-2">
                          <Link
                            href={`/admin/users/${usuario.id}/`}
                            className="relative group"
                          >
                            <div className="p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
                              <FiEye className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Ver detalles
                            </div>
                          </Link>

                          <div className="relative">
                            <button
                              onClick={() =>
                                setMenuAbierto(
                                  menuAbierto === usuario.id ? null : usuario.id
                                )
                              }
                              className="p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-300"
                            >
                              <FiMoreVertical className="w-4 h-4 text-gray-600" />
                            </button>

                            {/* Menú desplegable */}
                            {menuAbierto === usuario.id && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-10 overflow-hidden"
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      // Lógica para editar
                                      setMenuAbierto(null);
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                  >
                                    <FiEdit className="mr-3 text-blue-500" />
                                    Editar usuario
                                  </button>
                                  <button
                                    onClick={() =>
                                      cambiarEstadoUsuario(
                                        usuario.id,
                                        !usuario.active
                                      )
                                    }
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                                  >
                                    {usuario.active ? (
                                      <>
                                        <FiXCircle className="mr-3 text-rose-500" />
                                        Desactivar
                                      </>
                                    ) : (
                                      <>
                                        <FiCheckCircle className="mr-3 text-emerald-500" />
                                        Activar
                                      </>
                                    )}
                                  </button>
                                  <div className="border-t border-gray-100 my-1"></div>
                                  <button
                                    onClick={() => {
                                      // Lógica para eliminar
                                      setMenuAbierto(null);
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                                  >
                                    <FiTrash2 className="mr-3" />
                                    Eliminar usuario
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl">
                          <FiUser className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          No se encontraron usuarios
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md">
                          {filtro || filtroActivo !== "all"
                            ? "No hay usuarios que coincidan con tu búsqueda o filtro."
                            : "No hay usuarios registrados en el sistema."}
                        </p>
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setFiltro("");
                              setFiltroActivo("all");
                            }}
                            className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-xl hover:shadow-lg transition-shadow"
                          >
                            Limpiar filtros
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setModalOpen(true)}
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-shadow"
                          >
                            <FiUserPlus className="inline mr-2" />
                            Agregar usuario
                          </motion.button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pie de tabla con paginación */}
        {usuariosFiltrados.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-700">
                  Mostrando{" "}
                  <span className="font-semibold">
                    {indicePrimerUsuario + 1}
                  </span>{" "}
                  a{" "}
                  <span className="font-semibold">
                    {Math.min(indiceUltimoUsuario, usuariosFiltrados.length)}
                  </span>{" "}
                  de{" "}
                  <span className="font-semibold">
                    {usuariosFiltrados.length}
                  </span>{" "}
                  usuarios
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className={`p-2 rounded-lg ${
                    paginaActual === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-white hover:shadow-md"
                  }`}
                >
                  <FiChevronUp className="transform rotate-90 w-5 h-5" />
                </motion.button>

                {generarRangoPaginas().map((pageNum) => (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => cambiarPagina(pageNum)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium ${
                      paginaActual === pageNum
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                        : "text-gray-700 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                ))}

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  className={`p-2 rounded-lg ${
                    paginaActual === totalPaginas
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-white hover:shadow-md"
                  }`}
                >
                  <FiChevronUp className="transform -rotate-90 w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">
                Total Usuarios
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {usuarios.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <HiOutlineUserGroup className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Activos</p>
              <p className="text-2xl font-bold text-gray-800">
                {usuarios.filter((u) => u.active).length}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <HiOutlineStatusOnline className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium">
                Administradores
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {usuarios.filter((u) => u.role === "Admin").length}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <FiUser className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-red-50 p-5 rounded-2xl border border-rose-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rose-600 font-medium">Inactivos</p>
              <p className="text-2xl font-bold text-gray-800">
                {usuarios.filter((u) => !u.active).length}
              </p>
            </div>
            <div className="p-3 bg-rose-100 rounded-xl">
              <HiOutlineStatusOffline className="w-6 h-6 text-rose-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
