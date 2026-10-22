export const dynamic = "force-dynamic";

import { ErrorState } from "@/components/ui/ErrorState";
import { OrderDetail } from "@/features/orders/components/OrderDetail";
import { getOrderById } from "@/features/orders/queries";
import { load } from "@/lib/load";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await load(() => getOrderById(id));

  if (!data) return <ErrorState title="No se pudo cargar el servicio" message={error} />;

  return <OrderDetail order={data} />;
}
