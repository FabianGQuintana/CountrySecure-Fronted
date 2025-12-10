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
