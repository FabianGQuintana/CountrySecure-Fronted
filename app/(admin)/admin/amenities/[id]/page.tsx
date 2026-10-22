export const dynamic = "force-dynamic";

import { ErrorState } from "@/components/ui/ErrorState";
import { AmenityDetail } from "@/features/amenities/components/AmenityDetail";
import { getAmenityById } from "@/features/amenities/queries";
import { load } from "@/lib/load";

export default async function AmenityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await load(() => getAmenityById(id));

  if (!data) return <ErrorState title="No se pudo cargar el amenity" message={error} />;

  return <AmenityDetail amenity={data} />;
}
