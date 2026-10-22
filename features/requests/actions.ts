"use server";

import { api, fetchAll } from "@/lib/api-client";
import { runAction } from "@/lib/action";
import type { RequestDto } from "@/types/models";

export interface CreateRequestInput {
  orderId: string;
  details: string;
  location: string;
}

/** Solicitudes del residente autenticado. */
export const listMyRequests = async () => runAction(() => fetchAll<RequestDto>("/api/requests/me"));

/** Nueva solicitud: el solicitante es siempre el usuario del token. */
export const createRequest = async (data: CreateRequestInput) =>
  runAction(() => api.post<RequestDto>("/api/requests", data));

export const cancelRequest = async (id: string) => runAction(() => api.delete<RequestDto>(`/api/requests/${id}`));

/** Todas las solicitudes de los residentes, incluidas las canceladas (Admin). */
export const listAllRequests = async () => runAction(() => fetchAll<RequestDto>("/api/requests", { includeInactive: true }));

/** La administración resuelve o rechaza una solicitud pendiente. */
export const setRequestStatus = async (id: string, status: "Completed" | "Cancelled") =>
  runAction(() => api.put<RequestDto>(`/api/requests/${id}`, { status }));
