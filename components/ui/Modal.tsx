"use client";

import { useEffect, useId, type ReactNode } from "react";
import { FiX } from "react-icons/fi";

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
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full ${maxWidth} relative max-h-[90vh] overflow-y-auto`}>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
          <FiX size={24} />
        </button>
        <h2 id={titleId} className="text-2xl font-bold text-gray-800 mb-6">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

export const formInputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed";
export const formLabelClass = "block text-sm font-medium text-gray-700 mb-1";
export const primaryButtonClass =
  "px-5 py-2.5 rounded-lg text-white font-medium bg-linear-to-r from-purple-600 via-violet-600 to-pink-500 hover:shadow-lg disabled:opacity-50";
export const secondaryButtonClass = "px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50";
