import type { StatusTone } from "@/components/ui/StatusBadge";
import type { RequestDto } from "@/types/models";

export const REQUEST_STATUS: Record<string, { label: string; tone: StatusTone }> = {
  Pending: { label: "Pendiente", tone: "warning" },
  Completed: { label: "Resuelta", tone: "success" },
  Cancelled: { label: "Cancelada", tone: "neutral" },
};

/** Estado visible de una solicitud (una solicitud dada de baja se muestra como cancelada). */
export function requestStatusOf(r: Pick<RequestDto, "status" | "baseEntityStatus">) {
  if (r.baseEntityStatus === "Inactive") return REQUEST_STATUS.Cancelled;
  return REQUEST_STATUS[r.status] ?? REQUEST_STATUS.Pending;
}
