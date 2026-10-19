import NotificationBell from "@/components/layout/NotificationBell";
import Sidebar from "@/components/layout/Sidebar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/routes";

/** Estructura común de los paneles: menú lateral por rol + contenido. */
export default function AppShell({
  role,
  className,
  children,
}: {
  role: Role;
  /** Fondo y colores del área de contenido */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <SessionProviderWrapper>
      <div className="min-h-screen flex">
        <Sidebar role={role} />
        {role === "Resident" && <NotificationBell />}
        <main className={cn("flex-1 min-w-0 min-h-screen", className)}>{children}</main>
      </div>
    </SessionProviderWrapper>
  );
}
