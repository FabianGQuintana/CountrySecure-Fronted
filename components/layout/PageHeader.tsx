import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Encabezado común de las páginas de los paneles: título, descripción y acciones a la derecha. */
export function PageHeader({
  title,
  description,
  icon,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="flex min-w-0 items-start gap-4">
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">{icon}</div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

/** Contenedor de página con ancho máximo y padding uniformes. */
export function PageContainer({ children, className, size = "default" }: { children: ReactNode; className?: string; size?: "narrow" | "default" | "wide" }) {
  const width = size === "narrow" ? "max-w-3xl" : size === "wide" ? "max-w-7xl" : "max-w-5xl";
  return <div className={cn("mx-auto w-full px-4 py-8 sm:px-6 lg:px-10", width, className)}>{children}</div>;
}
