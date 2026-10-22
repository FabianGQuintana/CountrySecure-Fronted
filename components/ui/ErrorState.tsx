import { AlertCircle } from "lucide-react";

/** Estado de error común para las páginas que no pudieron cargar sus datos. */
export function ErrorState({
  title = "No se pudieron cargar los datos",
  message = "Inténtalo más tarde.",
}: {
  title?: string;
  message?: string;
  /** @deprecated El color sigue al tema global (claro/oscuro). */
  tone?: "light" | "dark";
}) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center py-24 text-center text-danger">
      <AlertCircle size={48} className="mb-4" aria-hidden />
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
