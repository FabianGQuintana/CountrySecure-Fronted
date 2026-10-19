import "server-only";
import { fetchAll } from "@/lib/api-client";
import type { PropertyDto } from "@/types/models";

/** Todas las propiedades, incluidas las dadas de baja (solo Admin). */
export const getProperties = () => fetchAll<PropertyDto>("/api/properties", { includeInactive: true });

/** Propiedades del usuario autenticado. */
export const getMyProperties = () => fetchAll<PropertyDto>("/api/properties/me");
