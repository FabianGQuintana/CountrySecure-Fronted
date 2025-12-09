import { getCurrentUser } from "@/auth";
import { redirect } from "next/navigation";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import MenuAdmin from "@/components/admin/navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Obtener usuario actual
  const user = await getCurrentUser();

  // Si no está autenticado -> login
  if (!user) {
    redirect("/login");
  }

  // Si no es Admin -> acceso denegado
  if (user.role !== "Admin") {
    redirect("/");
  }

  // Si pasa las verificaciones (es Admin) -> mostrar layout
  return (
    <SessionProviderWrapper>
      <div className="min-h-screen flex flex-col">
        {" "}
        <main className="flex-1 lg:ml-64 ">
          {children}
          <MenuAdmin />{" "}
        </main>{" "}
      </div>
    </SessionProviderWrapper>
  );
}
