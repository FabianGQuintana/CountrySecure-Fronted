"use client";

import { useEffect, useId, type ReactNode } from "react";
import { FiX } from "react-icons/fi";
import { controlClass, primaryButtonClass as kitPrimary, secondaryButtonClass as kitSecondary } from "@/components/ui/form";

/** Modal accesible: cierra con Escape y con el botón, y enfoca el diálogo al abrir. */
export function Modal({
  title,
  onClose,
  children,
  maxWidth = "max-w-lg",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-overlay z-50 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`bg-card text-card-foreground border border-border rounded-2xl shadow-2xl p-6 sm:p-8 w-full ${maxWidth} relative max-h-[90vh] overflow-y-auto animate-pop`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <FiX size={22} />
        </button>
        <h2 id={titleId} className="text-2xl font-bold text-foreground mb-6 pr-8">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

// Clases compartidas por los formularios de los modales (mismo estilo que components/ui/form.tsx)
export const formInputClass = controlClass(false);
export const formLabelClass = "block text-sm font-medium text-foreground mb-1.5";
export const primaryButtonClass = kitPrimary;
export const secondaryButtonClass = kitSecondary;
