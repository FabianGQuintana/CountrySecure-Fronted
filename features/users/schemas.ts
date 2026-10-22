import { z } from "zod";

// Mismas reglas que los validadores del backend (RegisterUserValidator / UpdateUserValidator / ChangePasswordValidator)
export const passwordRules = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .regex(/[A-Z]/, "Debe incluir una mayúscula")
  .regex(/[a-z]/, "Debe incluir una minúscula")
  .regex(/[0-9]/, "Debe incluir un número")
  .regex(/^[a-zA-Z0-9!@#$%^&*()_+=[\]{};:<>|./?-]*$/, "Contiene caracteres no permitidos");

export const ROLE_OPTIONS = [
  { value: "Resident", label: "Residente" },
  { value: "Security", label: "Seguridad" },
  { value: "Admin", label: "Administrador" },
] as const;

const nameRule = z.string().trim().min(2, "Mínimo 2 caracteres").max(50, "Máximo 50 caracteres");
const phoneRule = z.string().trim().regex(/^[0-9]+$/, "Solo números").min(7, "Mínimo 7 dígitos").max(15, "Máximo 15 dígitos");
const emailRule = z.string().trim().min(1, "Ingresá un email").email("Email inválido");
const roleRule = z.enum(["Resident", "Security", "Admin"], { error: "Elegí un rol" });

export const createUserSchema = z.object({
  name: nameRule,
  lastname: nameRule,
  dni: z.coerce
    .number({ error: "Ingresá un DNI válido" })
    .int("El DNI debe ser un número entero")
    .min(1_000_000, "DNI demasiado corto")
    .max(60_000_000, "DNI demasiado largo"),
  phone: phoneRule,
  email: emailRule,
  password: passwordRules,
  role: roleRule,
});

export const updateUserSchema = z.object({
  name: nameRule,
  lastname: nameRule,
  dni: z.coerce
    .number({ error: "Ingresá un DNI válido" })
    .int("El DNI debe ser un número entero")
    .min(1_000_000, "DNI demasiado corto")
    .max(99_999_999, "DNI demasiado largo"),
  phone: phoneRule,
  email: emailRule,
  role: roleRule,
});

// Edición del propio perfil (el DNI y el rol no se pueden cambiar)
export const profileSchema = updateUserSchema.pick({ name: true, lastname: true, phone: true, email: true });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Ingresá tu contraseña actual"),
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, "Confirmá la nueva contraseña"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { path: ["confirmPassword"], message: "Las contraseñas no coinciden" })
  .refine((v) => v.newPassword !== v.currentPassword, { path: ["newPassword"], message: "Debe ser distinta de la actual" });

// "Form values" = lo que escribe el usuario (strings); "Input" = datos validados y convertidos
export type CreateUserFormValues = z.input<typeof createUserSchema>;
export type CreateUserInput = z.output<typeof createUserSchema>;
export type UpdateUserFormValues = z.input<typeof updateUserSchema>;
export type UpdateUserInput = Partial<z.output<typeof updateUserSchema>>;
export type ChangePasswordFormValues = z.input<typeof changePasswordSchema>;
export type ChangePasswordInput = Pick<z.output<typeof changePasswordSchema>, "currentPassword" | "newPassword">;

export type ProfileFormValues = z.input<typeof profileSchema>;
