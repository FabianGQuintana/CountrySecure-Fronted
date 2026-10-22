// Alias de compatibilidad: los modelos de la API viven en types/models.ts y los enums en types/api.ts.
import type { EntryPermissionDto, OrderDto } from "./models";

export { OrderStatus, PermissionStatus, PermissionType, orderTypeLabel, permissionStatusToText } from "./api";

export type EntryPermissionResponseDto = EntryPermissionDto;
export type OrderResponseDto = OrderDto;

/** Un permiso de mantenimiento siempre trae el servicio asociado. */
export function isMaintenancePermission(p: EntryPermissionDto): boolean {
  return p.type === "Maintenance" && !!p.order;
}
