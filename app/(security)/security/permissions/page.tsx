export const dynamic = "force-dynamic";

import { ErrorState } from "@/components/ui/ErrorState";
import PermissionsTable from "@/components/Security/PermissionsTable";
import { getAllPermissions } from "@/features/entry-permissions/queries";
import { load } from "@/lib/load";

export default async function PermissionsPage() {
  const { data, error } = await load(() => getAllPermissions());

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Permisos de Ingreso</h1>
        <p className="text-slate-400 mt-1">Todos los permisos creados por los residentes para visitas y proveedores.</p>
      </div>

      {data ? <PermissionsTable permissions={data} /> : <ErrorState tone="dark" title="No se pudieron cargar los permisos" message={error} />}
    </div>
  );
}
