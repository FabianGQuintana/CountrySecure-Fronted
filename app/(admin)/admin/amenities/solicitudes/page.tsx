export const dynamic = "force-dynamic";

import { ErrorState } from "@/components/ui/ErrorState";
import { AdminTurnsTable } from "@/features/turns/components/AdminTurnsTable";
import { getAllTurns } from "@/features/turns/queries";
import { load } from "@/lib/load";

export default async function TurnsPage() {
  const { data, error } = await load(() => getAllTurns());

  if (!data) return <ErrorState title="Error al cargar las reservas" message={error} />;

  return <AdminTurnsTable initialTurns={data} />;
}
