import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

/** Estado vacío común: se muestra cuando una lista o búsqueda no tiene resultados. */
export function EmptyState({
  message = "No hay resultados.",
  className,
}: {
  message?: string;
  /** @deprecated El color sigue al tema global (claro/oscuro). */
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-12 text-center text-muted-foreground", className)}>
      <Inbox size={36} className="opacity-60" aria-hidden />
      <p className="text-sm">{message}</p>
    </div>
  );
}
