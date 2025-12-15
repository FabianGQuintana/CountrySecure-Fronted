
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import MenuSecurity from "@/components/Security/MenuSecurity";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Obtener usuario actual
  const user = await auth();

  // Si no está autenticado -> login
  if (!user) {
    redirect("/login");
  }

  // Si no es Security -> acceso denegado
  if (user.role !== "Security") {
    redirect("/");
  }

  // Si pasa las verificaciones (es Security) -> mostrar layout
  return (
    <SessionProviderWrapper>
      <div className="min-h-screen flex flex-col">
        {" "}
        <MenuSecurity/>{" "}
        <main className="flex-1 lg:ml-64 ">{children}</main>{" "}
      </div>
    </SessionProviderWrapper>
  );
}
