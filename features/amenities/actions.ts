"use server";

import { api } from "@/lib/api-client";
import { runAction } from "@/lib/action";
import type { AmenityDto } from "@/types/models";
import { getAmenities, getAmenityById } from "./queries";

export interface AmenityInput {
  amenityName: string;
  description: string;
  schedules: string;
  capacity: number;
}

/** Amenities activos (selector de reservas del residente). */
export const listAmenities = async () => runAction(() => getAmenities());

/** Todos, incluidos los dados de baja (tabla de administración). */
export const listAllAmenities = async () => runAction(() => getAmenities({ includeInactive: true }));

export const fetchAmenity = async (id: string) => runAction(() => getAmenityById(id));

export const createAmenity = async (data: AmenityInput) => runAction(() => api.post<AmenityDto>("/api/amenities", data));

export const updateAmenity = async (id: string, data: Partial<AmenityInput>) =>
  runAction(() => api.put<AmenityDto>(`/api/amenities/${id}`, data));

export const deleteAmenity = async (id: string) => runAction(() => api.delete<AmenityDto>(`/api/amenities/${id}`));

export const restoreAmenity = async (id: string) => runAction(() => api.post<AmenityDto>(`/api/amenities/${id}/restore`));
