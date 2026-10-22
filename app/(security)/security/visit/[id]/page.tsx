export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import ModalVisitDetails from "@/components/Security/ModalVisitDetails";
import { getPermissionById } from "@/features/entry-permissions/queries";
import { ErrorState } from "@/components/ui/ErrorState";
import { load } from "@/lib/load";

export default async function VisitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: permission, error } = await load(() => getPermissionById(id));

  if (!permission) {
    // 404 de la API → página de no encontrado; cualquier otro error se muestra
    if (error && /no encontrad|not found/i.test(error)) notFound();
    return <ErrorState tone="dark" title="No se pudo cargar el permiso" message={error} />;
  }

  return <ModalVisitDetails permission={permission} />;
}
