export const dynamic = "force-dynamic";
import { auth } from "@/auth";
import ServicesCardsPage from "@/components/Security/services/index";
import { FiAlertCircle } from "react-icons/fi";

export default async function ServicesPage() {
  let Orders: any[] | null = null;

  const session = await auth();

  try {
    const response = await fetch(
      `${process.env.API_HOST}/api/order/paged`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) throw new Error("Error al obtener Servicios");

    Orders = await response.json();
  } catch (error) {
    console.error("Error fetch Servicios:", error);
  }

  if (!Orders) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-700">
        <FiAlertCircle size={48} className="" />
        <h2 className="text-2xl font-bold mb-2">
          Error al cargar Servicios
        </h2>
        <p>Inténtelo más tarde</p>
      </div>
    );
  }

  return (
    <div className="in-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <ServicesCardsPage params={Orders} />
    </div>
  );
}
