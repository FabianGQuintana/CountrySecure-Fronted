import { ErrorState } from "@/components/ui/ErrorState";
import { AdminRequestsTable } from "@/features/requests/components/AdminRequestsTable";
import { getAllRequests } from "@/features/requests/queries";
import { load } from "@/lib/load";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  const { data, error } = await load(() => getAllRequests());
  if (!data) return <ErrorState title="Error al cargar las solicitudes" message={error} />;
  return <AdminRequestsTable initialRequests={data} />;
}
