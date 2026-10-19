import { z } from "zod";

// Mismas reglas que CreatePropertyValidator del backend
export const propertySchema = z.object({
  street: z.string().trim().min(1, "Ingresá la calle").max(150, "Máximo 150 caracteres"),
  propertyNumber: z.coerce
    .number({ error: "Ingresá el número" })
    .int("Debe ser un número entero")
    .min(1, "Debe ser mayor a 0")
    .max(99999, "Número demasiado grande"),
  lotId: z.string().min(1, "Elegí un lote"),
});

export type PropertyFormValues = z.input<typeof propertySchema>;
export type PropertyFormOutput = z.output<typeof propertySchema>;
