import { auth } from "@/auth";
import { TablaUsuarios } from "@/components/admin/usuarios";
import { FiAlertCircle } from "react-icons/fi";

export default async function Page() {
  let usuarios: any[] | null = null; //el backend me devuelve un array de usuarios, por eso la variable usuarios es un []

  try {
    const session = await auth();
    const response = await fetch(
      `${process.env.API_HOST}/api/users?role=Security`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      }
    );

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
      {/* <TablaUsuarios params={usuarios} /> */}
      <TablaUsuarios role="Security" params={usuarios} />
    </div>
  );
}
