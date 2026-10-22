import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "info" | "primary" | "neutral";

const TONES: Record<StatusTone, string> = {
  success: "bg-success-soft text-success border-success/25",
  warning: "bg-warning-soft text-warning border-warning/25",
  danger: "bg-danger-soft text-danger border-danger/25",
  info: "bg-info-soft text-info border-info/25",
  primary: "bg-primary-soft text-primary-soft-foreground border-primary/25",
  neutral: "bg-muted text-muted-foreground border-border",
};

/** Pastilla de estado con los colores semánticos de la paleta (se adapta a claro/oscuro). */
export function StatusBadge({ tone, children, className }: { tone: StatusTone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", TONES[tone], className)}>
      {children}
    </span>
  );
}
