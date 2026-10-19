// Modelos de respuesta de la API (JSON en camelCase). Un cambio de contrato en el backend debe reflejarse acá.
import type { LotState, OrderStatus, PassType, PermissionStatus, PermissionType, RequestStatus, Role, ScanOutcome, ScanReason, TurnStatus, VehicleType } from "./api";

// ---- Paginación ----
export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Estado de auditoría derivado de DeletedAt en el backend
export type AuditStatus = "Active" | "Inactive";

// ---- Usuarios ----
export interface UserDto {
  id: string;
  name: string;
  lastname: string;
  dni: number;
  phone: string;
  email: string;
  active: boolean;
  isBlocked?: boolean;
  blockReason?: string | null;
  role: Role;
}

// ---- Amenities y reservas ----
export interface AmenityDto {
  id: string;
  amenityName: string;
  description: string;
  schedules: string;
  capacity: number;
  status: AuditStatus;
  createdAt: string;
  lastModifiedAt?: string | null;
}

export interface TurnDto {
  id: string;
  createdAt: string;
  createdBy: string;
  startTime: string;
  endTime: string;
  status: AuditStatus;
  turnStatus: TurnStatus;
  amenityId: string;
  userId: string;
  amenity?: { id: string; name: string } | null;
  user?: { id: string; fullName: string } | null;
}

// ---- Lotes y propiedades ----
export interface LotDto {
  lotId: string;
  lotName: string;
  blockName: string;
  status: AuditStatus;
  lotState: LotState;
  createdAt: string;
}

export interface PropertyDto {
  propertyId: string;
  street: string;
  propertyNumber: number;
  propertyStatus: string;
  statusAuditoria: AuditStatus;
  createdAt: string;
  lotName?: string | null;
  ownerName?: string | null;
}

// ---- Servicios y solicitudes ----
export interface OrderDto {
  id: string;
  description: string;
  supplierName: string;
  orderType: OrderStatus;
  status: AuditStatus;
  requests?: string[] | null;
  entryPermissions?: string[] | null;
}

export interface RequestDto {
  id: string;
  details: string;
  location: string;
  status: RequestStatus;
  baseEntityStatus: AuditStatus;
  createdAt: string;
  user: { id: string; name: string; lastname: string; email: string };
  order: { id: string; supplierName: string; description: string; orderType: OrderStatus };
}

// ---- Visitantes y permisos de ingreso ----
export interface VisitDto {
  visitId: string;
  nameVisit: string;
  lastNameVisit: string;
  dniVisit: number;
  visitStatus: AuditStatus;
  isBlocked?: boolean;
  blockReason?: string | null;
}

export interface EntryPermissionDto {
  id: string;
  qrCodeValue: string;
  type: PermissionType;
  status: PermissionStatus;
  passType: PassType;
  companionsCount: number;
  vehicleType: VehicleType;
  vehiclePlate?: string | null;
  vehicleModel?: string | null;
  validFrom: string;
  validTo?: string | null;
  entryTime?: string | null;
  departureTime?: string | null;
  baseEntityStatus: AuditStatus;
  createdAt: string;
  createdBy: string;
  resident: { id: string; name: string; lastname: string; dni: number; phone: string; email: string };
  visitor: { id: string; nameVisit: string; lastNameVisit: string; dniVisit: number };
  order?: { id: string; supplierName: string; description?: string | null; orderType: OrderStatus; status: AuditStatus } | null;
  checkInGuard?: { id: string; name: string; lastname: string; dni: number } | null;
  checkOutGuard?: { id: string; name: string; lastname: string; dni: number } | null;
}

export interface GateCheckDto {
  permissionId: string;
  entryTime?: string | null;
  departureTime?: string | null;
  visitorFullName: string;
  visitorDni: number;
  residentFullName: string;
  checkResultStatus: string;
  message?: string | null;
}

/** Pase digital: lo que muestra la guardia al escanear y lo que ve la visita en el enlace público. */
export interface PassDto {
  permissionId: string;
  /** Contenido del QR (token firmado). */
  token: string;
  status: PermissionStatus;
  passType: PassType;
  residentName: string;
  destination: string;
  visitorName: string;
  visitorDni: number;
  companionsCount: number;
  vehicleType: VehicleType;
  vehiclePlate?: string | null;
  vehicleModel?: string | null;
  validFrom: string;
  validTo?: string | null;
  description?: string | null;
}

export interface ScanResultDto {
  success: boolean;
  outcome: ScanOutcome;
  reason: ScanReason;
  message: string;
  scannedAt: string;
  pass?: PassDto | null;
}
