import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "outline" | "secondary"

type BadgeProps = {
  children: React.ReactNode
  className?: string
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-transparent bg-background text-white",
  outline: "bg-transparent",
  secondary: "border-transparent bg-muted text-foreground",
}

export function Badge({ children, className, variant = "outline" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}