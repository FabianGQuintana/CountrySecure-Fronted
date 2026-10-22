import { StatusBadge, type StatusTone } from "@/components/ui/StatusBadge";

const ROLES: Record<string, { label: string; tone: StatusTone }> = {
  Admin: { label: "Administrador", tone: "primary" },
  Resident: { label: "Residente", tone: "info" },
  Security: { label: "Seguridad", tone: "neutral" },
};

export const Roles = ({ rol }: { rol: string }) => {
  const role = ROLES[rol] ?? { label: rol, tone: "neutral" as const };
  return <StatusBadge tone={role.tone}>{role.label}</StatusBadge>;
};
