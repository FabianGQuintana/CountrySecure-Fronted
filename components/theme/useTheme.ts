"use client";

import { useCallback, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

// El estado real vive en la clase de <html>: así todos los toggles y pestañas quedan sincronizados.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY && (e.newValue === "light" || e.newValue === "dark")) {
      document.documentElement.classList.toggle("dark", e.newValue === "dark");
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");
// En el servidor no se conoce la elección del usuario
const getServerSnapshot = (): Theme | null => null;

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Modo privado o storage bloqueado: el tema igual se aplica en esta pestaña
    }
  }, []);

  return { theme, setTheme };
}
