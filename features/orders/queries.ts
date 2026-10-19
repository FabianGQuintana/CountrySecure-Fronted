import "server-only";
import { api, fetchAll } from "@/lib/api-client";
import type { OrderStatus } from "@/types/api";
import type { OrderDto } from "@/types/models";

/** Servicios; con `includeInactive` (solo Admin) también los dados de baja. */
export const getOrders = (options: { includeInactive?: boolean; type?: OrderStatus } = {}) =>
  fetchAll<OrderDto>("/api/orders", { includeInactive: options.includeInactive, type: options.type });

export const getOrderById = (id: string) => api.get<OrderDto>(`/api/orders/${id}`);
