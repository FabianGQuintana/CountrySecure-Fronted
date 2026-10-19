import { z } from "zod";

// Mismas reglas que AmenityCreateValidator del backend
export const amenitySchema = z.object({
  amenityName: z.string().trim().min(1, "Ingresá el nombre").max(100, "Máximo 100 caracteres"),
  description: z.string().trim().min(1, "Ingresá una descripción").max(500, "Máximo 500 caracteres"),
  schedules: z.string().trim().min(1, "Ingresá los horarios").max(200, "Máximo 200 caracteres"),
  capacity: z.coerce
    .number({ error: "Ingresá la capacidad" })
    .int("Debe ser un número entero")
    .min(1, "Mínimo 1")
    .max(1000, "Máximo 1000"),
});

export type AmenityFormValues = z.input<typeof amenitySchema>;
export type AmenityFormOutput = z.output<typeof amenitySchema>;
