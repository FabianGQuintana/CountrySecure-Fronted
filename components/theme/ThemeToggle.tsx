"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./useTheme";

/** Interruptor Claro/Oscuro (se muestra en el menú lateral de los tres roles). */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      role="radiogroup"
      aria-label="Tema de la interfaz"
      className={cn("grid grid-cols-2 gap-1 rounded-xl bg-muted p-1 text-sm", className)}
    >
      {(
        [
          { value: "light", label: "Claro", Icon: Sun },
          { value: "dark", label: "Oscuro", Icon: Moon },
        ] as const
      ).map(({ value, label, Icon }) => {
        // Antes de hidratar (theme === null) ninguno aparece marcado
        const active = theme !== null && (value === "dark") === isDark;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(value)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg px-3 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon size={16} aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}
