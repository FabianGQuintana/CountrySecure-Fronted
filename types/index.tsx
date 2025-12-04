export interface Iusuario {
  id: string;
  name: string;
  lastname: string;
  dni: number;
  phone: string;
  email: string;
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
