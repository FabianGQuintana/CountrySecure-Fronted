export const dynamic = "force-dynamic";

import { ErrorState } from "@/components/ui/ErrorState";
import { OrdersTable } from "@/features/orders/components/OrdersTable";
import { getOrders } from "@/features/orders/queries";
import { load } from "@/lib/load";

export default async function OrdersPage() {
  const { data, error } = await load(() => getOrders({ includeInactive: true }));

  if (!data) return <ErrorState title="Error al cargar los servicios" message={error} />;

  return <OrdersTable initialOrders={data} />;
}
