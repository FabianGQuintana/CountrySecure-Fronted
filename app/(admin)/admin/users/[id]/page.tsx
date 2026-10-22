export const dynamic = "force-dynamic";

import { ErrorState } from "@/components/ui/ErrorState";
import { UserDetail } from "@/features/users/components/UserDetail";
import { getUserById } from "@/features/users/queries";
import { load } from "@/lib/load";

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await load(() => getUserById(id));

  if (!data) return <ErrorState title="No se pudo cargar el usuario" message={error} />;

  return <UserDetail user={data} />;
}
