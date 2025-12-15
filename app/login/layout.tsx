import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Obtener usuario actual
  const user = await getCurrentUser();

  // Si ya está autenticado, redirigir según su rol
  if (user) {
    // Redirigir según el rol del usuario
    switch (user.role) {
      case "Admin":
        redirect("/admin/");
      case "Security":
        redirect("/securiti/");
      case "Resident":
        redirect("/resident/dashboard");
      default:
        redirect("/");
    }
  }

  // Si no está autenticado, mostrar el formulario de login
  return <div>{children}</div>;
}
