import { TablaUsuarios } from "@/components/admin/usuarios";
import { FiAlertCircle } from "react-icons/fi";

export default async function Page() {
  let usuarios: any[] | null = null; //el backend me devuelve un array de usuarios, por eso la variable usuarios es un []

  try {
    const response = await fetch(`${process.env.API_HOST}/api/users`, {
      method: "GET", // cuando es un get no es necesario aclarar
      next: { revalidate: 0 }, // evita el cache
    });

    if (!response.ok) throw new Error("Error al obtener usuarios");

    usuarios = await response.json();
  } catch (error) {
    console.error("Error fetch usuarios:", error);
  }

  if (!usuarios) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-700">
        <FiAlertCircle size={48} className="mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error al cargar usuarios</h2>
        <p>Inténtelo más tarde</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <TablaUsuarios params={usuarios} />
    </div>
  );
}
