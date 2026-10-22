"use client";

import { FiX } from "react-icons/fi";
import { createOrder } from "../actions";
import { OrderForm } from "./OrderForm";

export function CreateOrderModal({ onClose, onSuccess }: { onClose: () => void; onSuccess?: () => void | Promise<void> }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-overlay z-50 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-labelledby="create-order-title">
      <div className="bg-card rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative">
        <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <FiX size={24} />
        </button>
        <h2 id="create-order-title" className="text-2xl font-bold text-foreground mb-6">
          Nuevo servicio
        </h2>

        <OrderForm
          submitLabel="Crear servicio"
          submittingLabel="Creando..."
          onCancel={onClose}
          onSubmit={async (values) => {
            const result = await createOrder(values);
            if (!result.ok) return { ok: false, error: result.error };
            onClose();
            await onSuccess?.();
            return { ok: true };
          }}
        />
      </div>
    </div>
  );
}
