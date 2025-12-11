import { auth } from "@/auth";
import { FiAlertCircle } from "react-icons/fi";
import TablaOrders from "@/components/admin/order";
export default async function Order() {
  let orders: any[] | null = null;

  const session = await auth();

  try {
    const response = await fetch(`${process.env.API_HOST}/api/order`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      cache: "no-store",
    });
    orders = await response.json();
  } catch (err) {
    console.log("error", err);
  }

  if (!orders) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-700">
        <FiAlertCircle size={48} className="mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error al cargar órdenes</h2>
        <p>Inténtelo más tarde</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <TablaOrders />
    </div>
  );
}
