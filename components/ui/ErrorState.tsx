import { AlertCircle } from "lucide-react";

/** Estado de error común para las páginas que no pudieron cargar sus datos. */
export function ErrorState({
  title = "No se pudieron cargar los datos",
  message = "Inténtalo más tarde.",
  tone = "light",
}: {
  title?: string;
  message?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center py-24 text-center ${tone === "dark" ? "text-rose-400" : "text-red-700"}`}
    >
      <AlertCircle size={48} className="mb-4" aria-hidden />
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className={tone === "dark" ? "text-slate-400" : "text-gray-600"}>{message}</p>
    </div>
  );
}
