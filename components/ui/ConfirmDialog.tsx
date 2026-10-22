"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";
import { dangerButtonClass, primaryButtonClass, secondaryButtonClass } from "@/components/ui/form";

interface ConfirmOptions {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Acción destructiva (cancelar, dar de baja): el botón se muestra en rojo */
  danger?: boolean;
}

/**
 * Reemplazo de `window.confirm()` con el estilo del sistema (y modo oscuro).
 *
 *   const [confirm, confirmDialog] = useConfirm();
 *   if (!(await confirm({ title: "¿Cancelar la reserva?", danger: true }))) return;
 *   ...
 *   return <>{confirmDialog}...</>;
 */
export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = useCallback((value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOptions(null);
  }, []);

  const dialog = options ? (
    <Modal title={options.title} onClose={() => close(false)} maxWidth="max-w-md">
      {options.message && <div className="-mt-2 mb-6 text-sm text-muted-foreground">{options.message}</div>}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" className={secondaryButtonClass} onClick={() => close(false)}>
          {options.cancelLabel ?? "Volver"}
        </button>
        <button
          type="button"
          autoFocus
          className={options.danger ? dangerButtonClass : primaryButtonClass}
          onClick={() => close(true)}
        >
          {options.confirmLabel ?? "Confirmar"}
        </button>
      </div>
    </Modal>
  ) : null;

  return [confirm, dialog] as const;
}
