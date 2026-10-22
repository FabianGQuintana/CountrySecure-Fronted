"use server";

import { api } from "@/lib/api-client";
import { runAction } from "@/lib/action";
import type { OrderDto } from "@/types/models";
import { getOrderById, getOrders } from "./queries";
import type { OrderInput } from "./schemas";

/** Servicios activos (para los selectores del residente y del guardia). */
export const listOrders = async () => runAction(() => getOrders());

/** Todos los servicios, incluidos los dados de baja (tabla de administración). */
export const listAllOrders = async () => runAction(() => getOrders({ includeInactive: true }));

export const fetchOrder = async (id: string) => runAction(() => getOrderById(id));

export const createOrder = async (data: OrderInput) => runAction(() => api.post<OrderDto>("/api/orders", data));

export const updateOrder = async (id: string, data: Partial<OrderInput>) =>
  runAction(() => api.put<OrderDto>(`/api/orders/${id}`, data));

export const deleteOrder = async (id: string) => runAction(() => api.delete<OrderDto>(`/api/orders/${id}`));

export const restoreOrder = async (id: string) => runAction(() => api.post<OrderDto>(`/api/orders/${id}/restore`));
