
export enum PermissionType {
  Visit = 1,
  Maintenance = 2,
}

export enum PermissionStatus {
  Cancelled = 0,
  Pending = 1,
  Completed = 2,
  Expired = 3,
}
// Coincide con CountrySecure.Domain.Enums.OrderStatus
export enum OrderStatus {
  Gardening = 1,
  Plumbing = 2,
  Electrical = 3,
  Cleaning = 4,
  GeneralMaintenance = 5,
  Pool = 6,
  Security = 7,
}
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
  return p.type === PermissionType.Maintenance && !!p.order;
}
export const OrderStatusText: Record<OrderStatus, string> = {
  [OrderStatus.Gardening]: "Jardinería",
  [OrderStatus.Plumbing]: "Plomería",
  [OrderStatus.Electrical]: "Electricidad",
  [OrderStatus.Cleaning]: "Limpieza",
  [OrderStatus.GeneralMaintenance]: "Mantenimiento General",
  [OrderStatus.Pool]: "Pileta",
  [OrderStatus.Security]: "Seguridad",
}

export function orderStatusToText(
  status?: OrderStatus | number | string
): string {
  const key = Number(status) as OrderStatus
  return OrderStatusText[key] ?? "—"
}

export function permissionStatusToText(
  status: PermissionStatus
): string {
  switch (status) {
    case PermissionStatus.Pending:
      return "Pendiente"
    case PermissionStatus.Completed:
      return "Completado"
    case PermissionStatus.Cancelled:
      return "Cancelado"
    case PermissionStatus.Expired:
      return "Expirado"
    default:
      return "—"
  }
}

