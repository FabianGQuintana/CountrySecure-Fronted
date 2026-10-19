"use server";

import { api } from "@/lib/api-client";
import { runAction } from "@/lib/action";
import type { PropertyDto } from "@/types/models";
import { getMyProperties, getProperties } from "./queries";

export interface PropertyInput {
  street: string;
  propertyNumber: number;
  lotId: string;
}

export const listProperties = async () => runAction(() => getProperties());

export const listMyProperties = async () => runAction(() => getMyProperties());

export const createProperty = async (data: PropertyInput) => runAction(() => api.post<PropertyDto>("/api/properties", data));

/** Asigna una propiedad a un residente (`userId`) o modifica sus datos. */
export const updateProperty = async (id: string, data: Partial<PropertyInput> & { userId?: string }) =>
  runAction(() => api.put<PropertyDto>(`/api/properties/${id}`, data));

export const deleteProperty = async (id: string) => runAction(() => api.delete<PropertyDto>(`/api/properties/${id}`));

export const restoreProperty = async (id: string) =>
  runAction(() => api.post<PropertyDto>(`/api/properties/${id}/restore`));
