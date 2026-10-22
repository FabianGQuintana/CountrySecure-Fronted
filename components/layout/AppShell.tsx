import NotificationBell from "@/components/layout/NotificationBell";
import Sidebar from "@/components/layout/Sidebar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/routes";

/** Estructura común de los paneles: menú lateral por rol + barra superior + contenido. */
export default function AppShell({
  role,
  className,
  children,
}: {
  role: Role;
  /** Clases extra del área de contenido */
  className?: string;
  children: React.ReactNode;
}) {
  const hasBell = role === "Resident";

  return (
    <SessionProviderWrapper>
      <div className="min-h-screen flex bg-background">
        <Sidebar role={role} />
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Barra superior: en móvil deja lugar al botón de menú; en escritorio solo existe si hay avisos */}
          <header
            className={cn(
              "sticky top-0 z-20 flex h-16 shrink-0 items-center justify-end gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6 lg:px-10",
              !hasBell && "lg:hidden"
            )}
          >
            {hasBell && <NotificationBell />}
          </header>
          <main className={cn("min-w-0 flex-1", className)}>{children}</main>
        </div>
      </div>
    </SessionProviderWrapper>
  );
}
