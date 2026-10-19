import type { OrderStatus, LotState } from "./api";
export * from "./api";

import { inter } from "@/app/fonts";

export interface Iusuario {
  id: string;
  name: string;
  lastname: string;
  dni: number;
  phone: string;
  email: string;
  active: boolean;
  password: string;
  role: string;
}

export interface IusuarioRegister {
  name: string;
  lastname: string;
  dni: number;
  phone: string;
  email: string;
  password: string;
  role: string;
}
export interface IusuarioRegisterForm {
  onClose: () => void;
  onSuccess?: () => void;
}

export interface IamenitiesRegister {
  id: string;
  amenityName: string;
  description: string;
  schedules: string;
  capacity: number;
  status: string;
}
export interface Iamenities {
  AmenityName: string;
  Description: string;
  Schedules: string;
  Capacity: number;
}
export interface IAmenitiesRegisterForm {
  onClose: () => void;
  onSuccess?: () => void;
}

export interface IOrderRegister {
  description: string;
  supplierName: string;
  orderType: OrderStatus;
  requestIds?: string[];
  entryPermissionIds?: string[];
}
export interface IOrder {
  id: string;
  description: string;
  supplierName: string;
  orderType: OrderStatus;
  requestIds?: string[];
  entryPermissionIds?: string[];
  status: string;
}
export interface IOrderRegisterForm {
  onClose: () => void;
  onSuccess?: () => void;
}

export interface IloteRegister {
  lotName: string;
  blockName: string;
  lotState: LotState;
}


export interface IloteRegisterForm {
  onClose: () => void;
  onSuccess?: () => void;
}
export interface ILoteForm {
  lotName: string;
  blockName: string;
  lotStatus: LotState;
}

  export interface IPropiedadRegister {
    Street: string;
    PropertyNumber: number;
    LotId: string;
  }

// Respuesta de GET /api/property/me (PropertyResponseDto)
export interface IPropiedadResidente {
  propertyId: string;
  street: string;
  propertyNumber: number;
  propertyStatus: string;
  statusAuditoria: string;
  lotName?: string | null;
  ownerName?: string | null;
}
