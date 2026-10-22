import { redirect } from "next/navigation";

// Ruta vieja de las reservas de amenities (se mantiene por enlaces guardados)
export default function LegacyTurnsPage() {
  redirect("/admin/reservas");
}
