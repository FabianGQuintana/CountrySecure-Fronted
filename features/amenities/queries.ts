import "server-only";
import { api, fetchAll } from "@/lib/api-client";
import type { AmenityDto } from "@/types/models";

/** Amenities; con `includeInactive` (solo Admin) también los dados de baja. */
export const getAmenities = (options: { includeInactive?: boolean } = {}) =>
  fetchAll<AmenityDto>("/api/amenities", { includeInactive: options.includeInactive });

export const getAmenityById = (id: string) => api.get<AmenityDto>(`/api/amenities/${id}`);
