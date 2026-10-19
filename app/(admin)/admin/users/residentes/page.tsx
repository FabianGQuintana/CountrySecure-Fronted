export const dynamic = "force-dynamic";

import { ErrorState } from "@/components/ui/ErrorState";
import { UsersTable } from "@/features/users/components/UsersTable";
import { getUsersByRole } from "@/features/users/queries";
import { load } from "@/lib/load";

export default async function ResidentsPage() {
  const { data, error } = await load(() => getUsersByRole("Resident"));

  if (!data) return <ErrorState title="Error al cargar residentes" message={error} />;

  return <UsersTable role="Resident" initialUsers={data} />;
}
