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
export enum OrderStatus {
  Gardening = 1,
  Plumbing = 2,
  Electrical = 3,
  Cleaning = 4,
  GeneralMaintenance = 5,
  Pool = 6,
  Security = 7,
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

export enum LotState {
  Inactive = 0,
  Available = 1,
  Full = 2,
  Maintenance = 3,
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

export enum PermissionType {
  Visit = 1,
  Maintenance = 2,
}
