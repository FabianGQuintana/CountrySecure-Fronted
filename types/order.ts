
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

// DTO para crear (CreateOrderDto)
export interface CreateOrderDto {
  description: string;
  supplierName: string;
  orderType: OrderStatus;
  requestIds?: string[];
  entryPermissionIds?: string[];
}

// DTO de respuesta (OrderResponseDto)
export interface OrderResponseDto {
  id: string;
  description: string;
  supplierName: string;
  orderType: OrderStatus;
  status: string;
  requests?: string[];
  entryPermissions?: string[];
}



export const OrderStatusText: Record<OrderStatus, string> = {
  [OrderStatus.Gardening]: "Jardinería",
  [OrderStatus.Plumbing]: "Plomería",
  [OrderStatus.Electrical]: "Electricidad",
  [OrderStatus.Cleaning]: "Limpieza",
  [OrderStatus.GeneralMaintenance]: "Mantenimiento General",
  [OrderStatus.Pool]: "Pileta",
  [OrderStatus.Security]: "Seguridad",
};

export function orderStatusToText(
  status?: OrderStatus | number | string
): string {
  const key = Number(status) as OrderStatus;
  return OrderStatusText[key] ?? "—";
}