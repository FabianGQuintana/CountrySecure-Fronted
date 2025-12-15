import type React from "react"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  // Obtener usuario actual
  const user = await getCurrentUser()

  // Si ya está autenticado, redirigir según su rol
  if (user) {
    switch (user.role) {
      case "Admin":
        redirect("/admin/")
      case "Security":
        redirect("/security/")
      case "Resident":
        redirect("/resident/")
      default:
        redirect("/")
    }
  }

  // Si no está autenticado, mostrar el formulario de login sin sidebar
  return <div>{children}</div>
}
