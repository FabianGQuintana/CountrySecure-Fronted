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
        <div className="shrink-0 h-10 w-10 rounded-full bg-linear-to-br from-purple-500 to-violet-400 flex items-center justify-center shadow-md">
          <span className="text-white font-semibold text-sm">
            {nombre?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-linear-to-br from-fuchsia-500 to-pink-400 rounded-full border-2 border-white"></div>
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-800">{nombre}</div>
        <div className="text-xs text-gray-500">{email}</div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-purple-50/80 via-white/90 to-pink-50/80 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent mb-2"
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
              className="flex items-center px-4 py-2 bg-linear-to-r from-purple-100/80 to-violet-100/80 text-purple-700 rounded-xl hover:from-purple-200 hover:to-violet-200 transition-all duration-300 shadow-sm border border-purple-200/50"
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
              className="flex items-center px-5 py-2.5 bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 text-white rounded-xl hover:from-purple-700 hover:via-violet-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
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
                  ? "bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-purple-50/50 border border-purple-200/50"
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
                  ? "bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-400 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-emerald-50/50 border border-emerald-200/50"
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
                  ? "bg-linear-to-r from-rose-500 via-pink-500 to-red-400 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-rose-50/50 border border-rose-200/50"
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
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-purple-100/50">
        {/* Header de la tabla con selección */}
        {seleccionados.length > 0 && (
          <div className="bg-linear-to-r from-purple-50/90 via-violet-50/90 to-pink-50/90 px-6 py-4 border-b border-purple-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-linear-to-r from-purple-100 to-violet-100 rounded-lg mr-3">
                  <FiUser className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-800">
                    {seleccionados.length} usuarios seleccionados
                  </h3>
                  <p className="text-sm text-purple-600">
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
                  className="flex items-center px-4 py-2 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-400 text-white rounded-lg hover:shadow-lg transition-shadow"
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
                  className="flex items-center px-4 py-2 bg-linear-to-r from-rose-500 via-pink-500 to-red-400 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  <FiXCircle className="mr-2" />
                  Desactivar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSeleccionados([])}
                  className="flex items-center px-4 py-2 bg-linear-to-r from-purple-400 via-violet-400 to-pink-400 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  Limpiar
                </motion.button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-purple-100/30">
            <thead className="bg-linear-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80">
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
                      className="h-4 w-4 text-purple-600 rounded border-purple-300 focus:ring-purple-500"
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider cursor-pointer hover:bg-purple-100/50 transition-colors rounded-lg"
                  onClick={() => ordenarPorColumna("name")}
                >
                  <div className="flex items-center">
                    Usuario
                    <div className="ml-2">
                      {columnaOrden === "name" &&
                        (ordenAscendente ? (
                          <FiChevronUp className="w-4 h-4 text-purple-500" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 text-purple-500" />
                        ))}
                    </div>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider cursor-pointer hover:bg-purple-100/50 transition-colors rounded-lg"
                  onClick={() => ordenarPorColumna("lastname")}
                >
                  <div className="flex items-center">
                    Apellido
                    <div className="ml-2">
                      {columnaOrden === "lastname" &&
                        (ordenAscendente ? (
                          <FiChevronUp className="w-4 h-4 text-purple-500" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 text-purple-500" />
                        ))}
                    </div>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider cursor-pointer hover:bg-purple-100/50 transition-colors rounded-lg"
                  onClick={() => ordenarPorColumna("email")}
                >
                  <div className="flex items-center">
                    Contacto
                    <div className="ml-2">
                      {columnaOrden === "email" &&
                        (ordenAscendente ? (
                          <FiChevronUp className="w-4 h-4 text-purple-500" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 text-purple-500" />
                        ))}
                    </div>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider cursor-pointer hover:bg-purple-100/50 transition-colors rounded-lg"
                  onClick={() => ordenarPorColumna("role")}
                >
                  <div className="flex items-center">
                    Rol
                    <div className="ml-2">
                      {columnaOrden === "role" &&
                        (ordenAscendente ? (
                          <FiChevronUp className="w-4 h-4 text-purple-500" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 text-purple-500" />
                        ))}
                    </div>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider cursor-pointer hover:bg-purple-100/50 transition-colors rounded-lg"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-purple-700 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>

            {/* CUERPO DE LA TABLA */}
            <tbody className="bg-white/50 divide-y divide-purple-100/30">
              <AnimatePresence>
                {usuariosPagina.length > 0 ? (
                  usuariosPagina.map((usuario) => (
                    <motion.tr
                      key={usuario.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="hover:bg-linear-to-r hover:from-purple-50/30 hover:via-violet-50/30 hover:to-pink-50/30 transition-all duration-300"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={seleccionados.includes(usuario.id)}
                          onChange={() => toggleSeleccion(usuario.id)}
                          className="h-4 w-4 text-purple-600 rounded border-purple-300 focus:ring-purple-500"
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
                            <div className="p-2 bg-linear-to-r from-purple-50 to-violet-50 rounded-lg hover:from-purple-100 hover:to-violet-100 transition-all duration-300">
                              <FiEye className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-purple-600 to-violet-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
                              className="p-2 bg-linear-to-r from-purple-50 to-violet-50 rounded-lg hover:from-purple-100 hover:to-violet-100 transition-all duration-300"
                            >
                              <FiMoreVertical className="w-4 h-4 text-purple-600" />
                            </button>

                            {/* Menú desplegable */}
                            {menuAbierto === usuario.id && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-purple-100/50 z-10 overflow-hidden"
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      // Lógica para editar
                                      setMenuAbierto(null);
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-linear-to-r hover:from-purple-50 hover:to-violet-50 transition-colors"
                                  >
                                    <FiEdit className="mr-3 text-purple-500" />
                                    Editar usuario
                                  </button>
                                  <button
                                    onClick={() =>
                                      cambiarEstadoUsuario(
                                        usuario.id,
                                        !usuario.active
                                      )
                                    }
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-linear-to-r hover:from-emerald-50 hover:to-teal-50 transition-colors"
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
                                  <div className="border-t border-purple-100/30 my-1"></div>
                                  <button
                                    onClick={() => {
                                      // Lógica para eliminar
                                      setMenuAbierto(null);
                                    }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-rose-600 hover:bg-linear-to-r hover:from-rose-50 hover:to-red-50 transition-colors"
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
                        <div className="mb-4 p-6 bg-linear-to-br from-purple-100/50 to-violet-100/50 rounded-2xl">
                          <FiUser className="w-16 h-16 text-purple-400" />
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
                            className="px-5 py-2.5 bg-linear-to-r from-purple-500 via-violet-500 to-pink-400 text-white rounded-xl hover:shadow-lg transition-shadow"
                          >
                            Limpiar filtros
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setModalOpen(true)}
                            className="px-5 py-2.5 bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 text-white rounded-xl hover:shadow-lg transition-shadow"
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
          <div className="bg-linear-to-r from-purple-50/80 via-violet-50/80 to-pink-50/80 px-6 py-4 border-t border-purple-200/50">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-purple-700">
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
                      ? "text-purple-300 cursor-not-allowed"
                      : "text-purple-700 hover:bg-white hover:shadow-md"
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
                        ? "bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 text-white shadow-lg"
                        : "text-purple-700 hover:bg-white hover:shadow-md"
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
                      ? "text-purple-300 cursor-not-allowed"
                      : "text-purple-700 hover:bg-white hover:shadow-md"
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
        <div className="bg-linear-to-br from-purple-50/90 via-violet-50/90 to-pink-50/90 p-5 rounded-2xl border border-purple-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Total Usuarios
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {usuarios.length}
              </p>
            </div>
            <div className="p-3 bg-linear-to-r from-purple-100 to-violet-100 rounded-xl">
              <HiOutlineUserGroup className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-emerald-50/90 via-teal-50/90 to-cyan-50/90 p-5 rounded-2xl border border-emerald-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Activos</p>
              <p className="text-2xl font-bold text-gray-800">
                {usuarios.filter((u) => u.active).length}
              </p>
            </div>
            <div className="p-3 bg-linear-to-r from-emerald-100 to-teal-100 rounded-xl">
              <HiOutlineStatusOnline className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-amber-50/90 via-orange-50/90 to-yellow-50/90 p-5 rounded-2xl border border-amber-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium">
                Administradores
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {usuarios.filter((u) => u.role === "Admin").length}
              </p>
            </div>
            <div className="p-3 bg-linear-to-r from-amber-100 to-orange-100 rounded-xl">
              <FiUser className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-rose-50/90 via-pink-50/90 to-red-50/90 p-5 rounded-2xl border border-rose-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rose-600 font-medium">Inactivos</p>
              <p className="text-2xl font-bold text-gray-800">
                {usuarios.filter((u) => !u.active).length}
              </p>
            </div>
            <div className="p-3 bg-linear-to-r from-rose-100 to-pink-100 rounded-xl">
              <HiOutlineStatusOffline className="w-6 h-6 text-rose-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
