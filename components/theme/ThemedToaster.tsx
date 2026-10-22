"use client";

import { Toaster } from "sonner";
import { useTheme } from "./useTheme";

/** Toasts que siguen el tema elegido (sonner no lee la clase `dark` por su cuenta). */
export function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster richColors position="top-center" theme={theme ?? "light"} />;
}
