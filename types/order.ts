
import type { OrderStatus, PermissionStatus, PermissionType } from "./api";
export { OrderStatus, PermissionStatus, PermissionType, orderTypeLabel, permissionStatusToText } from "./api";

export interface EntryPermissionUserDto {
  id: string;
  name: string;
  lastname: string;
  dni: number;
  phone: string;
  email: string;
}
export interface EntryPermissionVisitDto {
  id: string;
  nameVisit: string;
  lastNameVisit: string;
  dniVisit: number;
}
export interface EntryPermissionOrderDto {
  id: string;
  supplierName: string;
  description?: string | null;
  orderType: OrderStatus;
}


export interface EntryPermissionResponseDto {
  id: string;

  qrCodeValue: string;

  type: PermissionType;
  status: PermissionStatus;

  validFrom: string;          // DateTime → ISO string
  validTo: string;            // DateTime → ISO string
  entryTime?: string | null;
  departureTime?: string | null;


  baseEntityStatus: string;
  createdAt: string;
  createdBy: string;

  resident: EntryPermissionUserDto;
  visitor: EntryPermissionVisitDto;

  // 🔥 SOLO para Maintenance (puede venir null en Visit)
  order: EntryPermissionOrderDto;
}
export function isMaintenancePermission(
  p: EntryPermissionResponseDto
): boolean {
  return p.type === "Maintenance" && !!p.order;
}
export type OrderResponseDto = {
  id: string
  description: string
  supplierName: string
  orderType: OrderStatus
  status: string
  requests?: string[]
  entryPermissions?: string[]
}

