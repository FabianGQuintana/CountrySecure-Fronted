export const dynamic = "force-dynamic";

import { ErrorState } from "@/components/ui/ErrorState";
import { PropertiesTable } from "@/features/properties/components/PropertiesTable";
import { getLots } from "@/features/lots/queries";
import { getProperties } from "@/features/properties/queries";
import { getUsersByRole } from "@/features/users/queries";
import { load } from "@/lib/load";

export default async function PropertiesPage() {
  const { data, error } = await load(async () => {
    const [properties, lots, residents] = await Promise.all([getProperties(), getLots(), getUsersByRole("Resident")]);
    return { properties, lots, residents };
  });

  if (!data) return <ErrorState title="Error al cargar las propiedades" message={error} />;

  return <PropertiesTable initialProperties={data.properties} lots={data.lots} residents={data.residents} />;
}
