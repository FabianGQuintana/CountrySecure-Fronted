import { auth } from "@/auth";
import { FiAlertCircle } from "react-icons/fi";
import { Estados } from "@/components/estados";

export default async function Order() {
  let lotes: any[] | null = null;

  const session = await auth();

  try {
    const response = await fetch(`${process.env.API_HOST}/api/turn/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      cache: "no-store",
    });
    lotes = await response.json();
  } catch (err) {
    console.log("error", err);
  }

  if (!lotes) {
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
      <h1 className="text-2xl font-bold mb-4">Lotes</h1>

      <table className="w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Manzana</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {lotes.map((lote) => (
            <tr key={lote.lotId} className="border-t">
              <td className="p-2">{lote.lotName}</td>
              <td className="p-2">{lote.blockName}</td>
              <td className="p-2">{lote.lotState}</td>
              {/* <td className="p-2">{lote.status}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
