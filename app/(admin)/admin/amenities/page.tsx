export const dynamic = "force-dynamic";

import { ErrorState } from "@/components/ui/ErrorState";
import { AmenitiesTable } from "@/features/amenities/components/AmenitiesTable";
import { getAmenities } from "@/features/amenities/queries";
import { load } from "@/lib/load";

export default async function AmenitiesPage() {
  const { data, error } = await load(() => getAmenities({ includeInactive: true }));

  if (!data) return <ErrorState title="Error al cargar los amenities" message={error} />;

  return <AmenitiesTable initialAmenities={data} />;
}
