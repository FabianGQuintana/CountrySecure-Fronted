import "server-only";
import { fetchAll } from "@/lib/api-client";
import type { RequestDto } from "@/types/models";

/** Todas las solicitudes de servicio, incluidas las canceladas (Admin). */
export const getAllRequests = () => fetchAll<RequestDto>("/api/requests", { includeInactive: true });
