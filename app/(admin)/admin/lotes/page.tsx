export const dynamic = "force-dynamic";

import { ErrorState } from "@/components/ui/ErrorState";
import { LotsTable } from "@/features/lots/components/LotsTable";
import { getLots } from "@/features/lots/queries";
import { load } from "@/lib/load";

export default async function LotsPage() {
  const { data, error } = await load(() => getLots());

  if (!data) return <ErrorState title="Error al cargar los lotes" message={error} />;

  return <LotsTable initialLots={data} />;
}
