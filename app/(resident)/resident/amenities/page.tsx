import { Sparkles } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/ui/ErrorState";
import { getAmenities } from "@/features/amenities/queries";
import { ReserveAmenityForm } from "@/features/turns/components/ReserveAmenityForm";
import { load } from "@/lib/load";

export const dynamic = "force-dynamic";

export default async function ReserveAmenityPage() {
  const { data, error } = await load(() => getAmenities());

  return (
    <PageContainer size="narrow">
      <PageHeader
        icon={<Sparkles size={24} aria-hidden />}
        title="Reservar amenity"
        description="Elegí el espacio, el día y el horario. Te confirmamos al instante."
      />
      {data ? <ReserveAmenityForm amenities={data} /> : <ErrorState title="No se pudieron cargar los amenities" message={error} />}
    </PageContainer>
  );
}
