import { z } from "zod";
import { OrderStatus } from "@/types/api";

export const ORDER_TYPE_VALUES = Object.values(OrderStatus) as [OrderStatus, ...OrderStatus[]];

// Mismas reglas que CreateOrderValidator / UpdateOrderValidator del backend
export const orderSchema = z.object({
  supplierName: z.string().trim().min(1, "Ingresá el nombre del proveedor").max(200, "Máximo 200 caracteres"),
  description: z.string().trim().min(1, "Ingresá una descripción").max(500, "Máximo 500 caracteres"),
  orderType: z.enum(ORDER_TYPE_VALUES, { error: "Elegí el tipo de servicio" }),
});

export type OrderInput = z.output<typeof orderSchema>;
export type OrderFormValues = z.input<typeof orderSchema>;
