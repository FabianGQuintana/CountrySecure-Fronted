import { z } from "zod";
import { LotState } from "@/types/api";

export const LOT_STATE_VALUES = Object.values(LotState) as [LotState, ...LotState[]];

// Mismas reglas que CreateLotValidator del backend
export const lotSchema = z.object({
  lotName: z.string().trim().min(1, "Ingresá el nombre del lote").max(100, "Máximo 100 caracteres"),
  blockName: z.string().trim().min(1, "Ingresá la manzana").max(100, "Máximo 100 caracteres"),
  lotState: z.enum(LOT_STATE_VALUES, { error: "Elegí un estado" }),
});

export type LotFormValues = z.input<typeof lotSchema>;
export type LotFormOutput = z.output<typeof lotSchema>;
