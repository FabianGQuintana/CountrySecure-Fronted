"use client";
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { BuscadorTablas } from "@/components/buscadorTablas";
import { Roles } from "@/components/roles";
import { Iusuario } from "@/types";
import { FiChevronUp, FiChevronDown, FiEye, FiUser } from "react-icons/fi";
import ModalRegisterUser from "./modalNewUser";
import { Estados } from "@/components/estados";

export function TablaUsuarios({ params = [] }: { params?: Iusuario[] }) {
  const [usuarios, setUsuarios] = useState<Iusuario[]>(params || []);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [columnaOrden, setColumnaOrden] = useState<keyof Iusuario>("email");
  const usuariosPorPagina = 15;
  const [modalOpen, setModalOpen] = useState(false); //para abrir el modal

  const refreshUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/users?role=Resident`,
        {
          method: "GET",
          next: { revalidate: 0 }, // evita cache en server actions
        }
      );

      if (!response.ok) throw new Error("Error al refrescar usuarios");

      const data = await response.json();
      return data; // devolvemos el array
    } catch (error) {
      console.error("Error en refreshUsers:", error);
      return []; // fallback
    }
  };

  // Memoizar usuarios filtrados y ordenados
  const usuariosFiltrados = useMemo(() => {
    const terminoBusqueda = filtro.toLowerCase();
    return usuarios
      .filter(
        (user) =>
          user.name.toLowerCase().includes(terminoBusqueda) ||
          user.lastname.toLowerCase().includes(terminoBusqueda) ||
          user.email.toLowerCase().includes(terminoBusqueda)
      )
      .sort((a, b) => {
        const valorA = String(a[columnaOrden]).toLowerCase();
        const valorB = String(b[columnaOrden]).toLowerCase();
        return ordenAscendente
          ? valorA.localeCompare(valorB)
          : valorB.localeCompare(valorA);
      });
  }, [usuarios, filtro, columnaOrden, ordenAscendente]);

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

  // Renderizar avatar del usuario
  const renderAvatar = (nombre: string) => (
    <div className="shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-linear-to-br from-indigo-100 to-blue-100 flex items-center justify-center shadow-sm">
      <span className="text-indigo-600 font-medium text-sm sm:text-base">
        {nombre.charAt(0).toUpperCase()}
      </span>
    </div>
  );

  return (
    <div className="w-full h-max">
      <div
        className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row
                              justify-between items-start sm:items-center gap-3
                              "
      >
        <div className="items-center">
          <h2 className=" text-lg sm:text-2xl font-bold text-gray-800">
            Gestión de Usuarios
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {usuariosFiltrados.length} usuario
            {usuariosFiltrados.length !== 1 ? "s" : ""}
            encontrado{usuariosFiltrados.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Botón Agregar Usuario */}
        <div className="mt-4 flex justify-center">
          <button
            className="px-10 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-500 cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            + Nuevo Usuario
          </button>
        </div>

        {modalOpen && (
          <ModalRegisterUser
            onSuccess={async () => {
              // refrescamos datos desde el backend
              const nuevos = await refreshUsers();
              setUsuarios(nuevos);

              // cerramos modal después de actualizar
              setModalOpen(false);
            }}
            onClose={() => setModalOpen(false)}
          />
        )}

        <div className="relative w-full sm:w-64">
          <BuscadorTablas
            placeholder="Buscar usuarios..."
            onBuscar={(termino) => {
              setFiltro(termino);
              setPaginaActual(paginaActual);
            }}
            valorInicial={filtro}
            delay={300}
          />
        </div>
      </div>

      {/* Contenido principal - Tabla responsiva */}
      <div className="overflow-x-auto sm:overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200/60">
          <thead className="bg-gray-50/80">
            <tr>
              <th
                scope="col"
                className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/60 transition-colors"
                onClick={() => ordenarPorColumna("name")}
              >
                <div className="flex items-center">
                  <span className="hidden sm:inline">Nombre</span>
                  <span className="sm:hidden">Nom.</span>
                  {columnaOrden === "name" && (
                    <span className="ml-1">
                      {ordenAscendente ? (
                        <FiChevronUp className="h-3 w-3" />
                      ) : (
                        <FiChevronDown className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/60 transition-colors"
                onClick={() => ordenarPorColumna("lastname")}
              >
                <div className="flex items-center">
                  <span className="hidden sm:inline">Apellido</span>
                  <span className="sm:hidden">Ape.</span>
                  {columnaOrden === "lastname" && (
                    <span className="ml-1">
                      {ordenAscendente ? (
                        <FiChevronUp className="h-3 w-3" />
                      ) : (
                        <FiChevronDown className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/60 transition-colors"
                onClick={() => ordenarPorColumna("email")}
              >
                <div className="flex items-center">
                  Email
                  {columnaOrden === "email" && (
                    <span className="ml-1">
                      {ordenAscendente ? (
                        <FiChevronUp className="h-3 w-3" />
                      ) : (
                        <FiChevronDown className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>

              <th
                scope="col"
                className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/60 transition-colors"
                onClick={() => ordenarPorColumna("role")}
              >
                <div className="flex items-center">
                  Rol
                  {columnaOrden === "role" && (
                    <span className="ml-1">
                      {ordenAscendente ? (
                        <FiChevronUp className="h-3 w-3" />
                      ) : (
                        <FiChevronDown className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/60 transition-colors"
                onClick={() => ordenarPorColumna("role")}
              >
                <div className="flex items-center">
                  Estado
                  {columnaOrden === "role" && (
                    <span className="ml-1">
                      {ordenAscendente ? (
                        <FiChevronUp className="h-3 w-3" />
                      ) : (
                        <FiChevronDown className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-2 sm:px-4 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>

          {/* CUERPO DE LA TABLA (ACA VAN LOS DATOS DE LOS USUARIOS) */}
          <tbody className="bg-white divide-y divide-gray-200/60">
            {usuariosPagina.length > 0 ? (
              usuariosPagina.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="hover:bg-gray-50/80 transition-colors duration-150"
                >
                  <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {renderAvatar(usuario.name)}
                      <div className="ml-2 sm:ml-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">
                          {usuario.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[100px] sm:max-w-none">
                          {usuario.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 truncate max-w-20 sm:max-w-none">
                      {usuario.lastname}
                    </div>
                  </td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 truncate max-w-[120px] sm:max-w-none">
                      {usuario.email}
                    </div>
                  </td>

                  <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <Roles rol={usuario.role} />
                  </td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                    <Estados estado={usuario.active} />
                  </td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-1">
                      <Link
                        href={`/admin/users/${usuario.id}/`}
                        className="flex items-center text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded-full hover:bg-indigo-50"
                        title="Ver detalles"
                      >
                        <span className="mr-1">Más</span>
                        <FiEye className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 p-4 bg-gray-100 rounded-full">
                      <FiUser className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">
                      No se encontraron usuarios
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Intenta ajustar tu búsqueda o filtro
                    </p>
                    <button
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center"
                      onClick={() => setFiltro("")}
                    >
                      Limpiar búsqueda
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pie de tabla con paginación */}
      {usuariosFiltrados.length > 0 && (
        <div className="bg-gray-50/80 px-3 sm:px-6 py-2 sm:py-3 flex flex-col xs:flex-row items-center justify-between border-t border-gray-200">
          <div className="mb-2 xs:mb-0">
            <p className="text-xs sm:text-sm text-gray-700">
              Mostrando{" "}
              <span className="font-medium">{indicePrimerUsuario + 1}</span> a{" "}
              <span className="font-medium">
                {Math.min(indiceUltimoUsuario, usuariosFiltrados.length)}
              </span>{" "}
              de <span className="font-medium">{usuariosFiltrados.length}</span>{" "}
              usuarios
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className={`p-1 sm:p-1.5 rounded-md ${
                paginaActual === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              title="Página anterior"
            >
              <FiChevronUp className="transform rotate-90 h-3 w-3 sm:h-4 sm:w-4" />
            </button>

            {generarRangoPaginas().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => cambiarPagina(pageNum)}
                className={`text-xs sm:text-sm w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center ${
                  paginaActual === pageNum
                    ? "bg-indigo-600 text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className={`p-1 sm:p-1.5 rounded-md ${
                paginaActual === totalPaginas
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              title="Página siguiente"
            >
              <FiChevronUp className="transform -rotate-90 h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
