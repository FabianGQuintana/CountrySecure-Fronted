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
  Jardineria = 1,
  Plomeria = 2,
  Electricidad = 3,
  Limpieza = 4,
  MantenimientoGeneral = 5,
  Piscina = 6,
  Seguridad = 7,
}
