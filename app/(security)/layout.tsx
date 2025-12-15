
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
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
      <div className="min-h-screen flex">

        {/* Menú lateral */}
        <aside className="w-64 bg-gray-900 text-white p-6 hidden lg:block">
          <h2 className="text-xl font-semibold mb-6">Security</h2>

          <nav className="flex flex-col gap-4">
            <Link href="/security/visits" className="hover:text-blue-300">
              Visitas
            </Link>

            <Link href="/security/services" className="hover:text-blue-300">
              Servicios
            </Link>

            <Link href="/security/permissions" className="hover:text-blue-300">
              Permisos
            </Link>
          </nav>
        </aside>

        {/* Contenido dinámico */}
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </SessionProviderWrapper>
  );
}
