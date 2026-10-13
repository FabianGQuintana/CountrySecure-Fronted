export const dynamic = "force-dynamic";

import { FiAlertCircle } from "react-icons/fi";
import { getAllPermissions } from "@/actions/securityActions";
import PermissionsTable, { type ApiPermission } from "@/components/Security/PermissionsTable";

export default async function PermissionsPage() {
  let permissions: ApiPermission[] | null = null;

  try {
    permissions = await getAllPermissions();
  } catch (error) {
    console.error("Error al obtener permisos:", error);
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Permisos de Ingreso</h1>
        <p className="text-slate-400 mt-1">
          Todos los permisos creados por los residentes para visitas y proveedores.
        </p>
      </div>

      {permissions ? (
        <PermissionsTable permissions={permissions} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-rose-400">
          <FiAlertCircle size={40} className="mb-3" />
          <p className="font-semibold">No se pudieron cargar los permisos</p>
          <p className="text-sm text-slate-400">Inténtelo más tarde</p>
        </div>
      )}
    </div>
  );
}
