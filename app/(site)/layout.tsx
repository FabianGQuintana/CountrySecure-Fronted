import { ReactNode } from "react";
import Menu from "@/components/navbar";
import Footer from "@/components/footer";
import { auth } from "@/auth";
import { homeForRole } from "@/lib/routes";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  // La landing es pública y NO redirige: así el botón "Atrás" del navegador funciona.
  // Si hay sesión, el menú muestra un acceso directo al panel del rol.
  const user = await auth();
  const panelHref = user ? homeForRole(user.role) : undefined;

  return (
    <div className="bg-blue-800  min-h-screen flex flex-col">
      <Menu panelHref={panelHref} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
