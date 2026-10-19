// Contrato de enums con la API.
//
// El backend serializa TODOS los enums como texto (JsonStringEnumConverter) y los acepta por nombre,
// así que el front los maneja como strings. No usar números ni `enum` de TypeScript acá.

// ---- Tipo de servicio (Order.OrderType) ----
export const OrderStatus = {
  Gardening: "Gardening",
  Plumbing: "Plumbing",
  Electrical: "Electrical",
  Cleaning: "Cleaning",
  GeneralMaintenance: "GeneralMaintenance",
  Pool: "Pool",
  Security: "Security",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const ORDER_TYPE_LABELS: Record<OrderStatus, string> = {
  Gardening: "Jardinería",
  Plumbing: "Plomería",
  Electrical: "Electricidad",
  Cleaning: "Limpieza",
  GeneralMaintenance: "Mantenimiento General",
  Pool: "Piscina",
  Security: "Seguridad",
};

export function orderTypeLabel(value: unknown): string {
  return ORDER_TYPE_LABELS[value as OrderStatus] ?? "Desconocido";
}

// ---- Tipo de permiso de ingreso ----
export const PermissionType = {
  Visit: "Visit",
  Maintenance: "Maintenance",
} as const;
export type PermissionType = (typeof PermissionType)[keyof typeof PermissionType];

export const PERMISSION_TYPE_LABELS: Record<PermissionType, string> = {
  Visit: "Visita",
  Maintenance: "Mantenimiento",
};

// ---- Estado de un permiso de ingreso ----
export const PermissionStatus = {
  Cancelled: "Cancelled",
  Pending: "Pending",
  Completed: "Completed",
  Expired: "Expired",
} as const;
export type PermissionStatus = (typeof PermissionStatus)[keyof typeof PermissionStatus];

export const PERMISSION_STATUS_LABELS: Record<PermissionStatus, string> = {
  Cancelled: "Cancelado",
  Pending: "Pendiente",
  Completed: "Completado",
  Expired: "Expirado",
};

export function permissionStatusToText(status: unknown): string {
  return PERMISSION_STATUS_LABELS[status as PermissionStatus] ?? "—";
}

// ---- Estado de un lote ----
export const LotState = {
  Inactive: "Inactive",
  Available: "Available",
  Full: "Full",
  Maintenance: "Maintenance",
} as const;
export type LotState = (typeof LotState)[keyof typeof LotState];

export const LOT_STATE_LABELS: Record<LotState, string> = {
  Inactive: "Inactivo",
  Available: "Disponible",
  Full: "Completo",
  Maintenance: "Mantenimiento",
};

// ---- Estado de una reserva (Turn) ----
export type TurnStatus = "Pending" | "Completed" | "Cancelled";

// ---- Estado de una solicitud (Request) ----
export type RequestStatus = "Pending" | "Completed" | "Cancelled";

// ---- Roles ----
export type { Role } from "@/lib/routes";
