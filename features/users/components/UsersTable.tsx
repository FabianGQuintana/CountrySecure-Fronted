"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { FiCheckCircle, FiEye, FiRefreshCw, FiUserPlus, FiXCircle } from "react-icons/fi";
import { Estados } from "@/components/estados";
import { Roles } from "@/components/roles";
import { DataTable, type Column, type TableFilter } from "@/components/ui/DataTable";
import type { Role } from "@/types/api";
import type { UserDto } from "@/types/models";
import { deactivateUser, listUsers, restoreUser } from "../actions";
import { CreateUserModal } from "./CreateUserModal";

const FILTERS: TableFilter<UserDto>[] = [
  { value: "all", label: "Todos", predicate: () => true },
  { value: "active", label: "Activos", predicate: (u) => u.active },
  { value: "inactive", label: "Inactivos", predicate: (u) => !u.active },
];

const iconButton = "p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition disabled:opacity-50";

export function UsersTable({ role, initialUsers }: { role: Role; initialUsers: UserDto[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    const result = await listUsers(role);
    if (result.ok) {
      setUsers(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setIsRefreshing(false);
  }, [role]);

  const setActive = useCallback(
    async (user: UserDto, active: boolean) => {
      if (user.active === active) return;
      const result = await (active ? restoreUser(user.id) : deactivateUser(user.id));
      if (!result.ok) setError(`${user.email}: ${result.error}`);
    },
    []
  );

  const columns: Column<UserDto>[] = [
    {
      key: "user",
      header: "Usuario",
      sortValue: (u) => u.name,
      cell: (u) => (
        <div className="flex items-center gap-3">
          <div className="shrink-0 h-10 w-10 rounded-full bg-linear-to-br from-purple-500 to-violet-400 flex items-center justify-center shadow-md" aria-hidden>
            <span className="text-white font-semibold text-sm">{u.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <div className="font-semibold text-gray-800">{u.name}</div>
            <div className="text-xs text-gray-500">DNI {u.dni}</div>
          </div>
        </div>
      ),
    },
    { key: "lastname", header: "Apellido", sortValue: (u) => u.lastname, cell: (u) => <span className="font-medium text-gray-900">{u.lastname}</span> },
    {
      key: "contact",
      header: "Contacto",
      sortValue: (u) => u.email,
      cell: (u) => (
        <>
          <div className="text-gray-900">{u.email}</div>
          <div className="text-xs text-gray-500">{u.phone || "Sin teléfono"}</div>
        </>
      ),
    },
    { key: "role", header: "Rol", sortValue: (u) => u.role, cell: (u) => <Roles rol={u.role} /> },
    { key: "status", header: "Estado", sortValue: (u) => Number(u.active), cell: (u) => <Estados estado={u.active} /> },
    {
      key: "actions",
      header: "Acciones",
      align: "right",
      cell: (u) => (
        <div className="flex justify-end items-center gap-2">
          <Link href={`/admin/users/${u.id}`} className={iconButton} aria-label={`Ver detalles de ${u.name} ${u.lastname}`} title="Ver detalles">
            <FiEye className="w-4 h-4" />
          </Link>
          <button
            type="button"
            className={iconButton}
            title={u.active ? "Desactivar" : "Activar"}
            aria-label={u.active ? `Desactivar a ${u.name}` : `Activar a ${u.name}`}
            onClick={async () => {
              await setActive(u, !u.active);
              await refresh();
            }}
          >
            {u.active ? <FiXCircle className="w-4 h-4 text-rose-500" /> : <FiCheckCircle className="w-4 h-4 text-emerald-500" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-purple-50/80 via-white/90 to-pink-50/80 p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 bg-clip-text text-transparent mb-1">
            {role === "Security" ? "Personal de Seguridad" : "Gestión de Residentes"}
          </h1>
          <p className="text-gray-500">{users.length} usuario{users.length !== 1 ? "s" : ""} en el sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={refresh}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 bg-purple-100/80 text-purple-700 rounded-xl hover:bg-purple-200 transition disabled:opacity-50"
          >
            <FiRefreshCw className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Actualizando..." : "Actualizar"}
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center px-5 py-2.5 text-white rounded-xl font-medium bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 hover:shadow-lg transition"
          >
            <FiUserPlus className="mr-2" />
            Nuevo usuario
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      <DataTable
        data={users}
        columns={columns}
        getRowId={(u) => u.id}
        itemLabel="usuario"
        pageSize={15}
        searchPlaceholder="Buscar por nombre, apellido, DNI o email..."
        getSearchText={(u) => `${u.name} ${u.lastname} ${u.email} ${u.dni}`}
        filters={FILTERS}
        initialSort={{ key: "lastname", direction: "asc" }}
        emptyMessage="No hay usuarios que coincidan."
        isLoading={isRefreshing && users.length === 0}
        selectable
        rowClassName={(u) => (u.active ? undefined : "opacity-60")}
        bulkActions={(selected, clear) => (
          <>
            <button
              type="button"
              className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:shadow-lg"
              onClick={async () => {
                await Promise.all(selected.map((u) => setActive(u, true)));
                clear();
                await refresh();
              }}
            >
              <FiCheckCircle className="mr-2" /> Activar
            </button>
            <button
              type="button"
              className="flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:shadow-lg"
              onClick={async () => {
                await Promise.all(selected.map((u) => setActive(u, false)));
                clear();
                await refresh();
              }}
            >
              <FiXCircle className="mr-2" /> Desactivar
            </button>
            <button type="button" className="px-4 py-2 border border-purple-300 rounded-lg text-purple-700" onClick={clear}>
              Limpiar
            </button>
          </>
        )}
      />

      {modalOpen && <CreateUserModal onClose={() => setModalOpen(false)} onSuccess={refresh} />}
    </div>
  );
}
