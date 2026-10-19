export const dynamic = "force-dynamic";

import { ErrorState } from "@/components/ui/ErrorState";
import { UsersTable } from "@/features/users/components/UsersTable";
import { getUsersByRole } from "@/features/users/queries";
import { load } from "@/lib/load";

export default async function SecurityStaffPage() {
  const { data, error } = await load(() => getUsersByRole("Security"));

  if (!data) return <ErrorState title="Error al cargar el personal de seguridad" message={error} />;

  return <UsersTable role="Security" initialUsers={data} />;
}
