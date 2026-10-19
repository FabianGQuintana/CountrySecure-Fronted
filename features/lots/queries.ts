import "server-only";
import { fetchAll } from "@/lib/api-client";
import type { LotDto } from "@/types/models";

/** Lotes, incluidos los dados de baja (solo Admin). */
export const getLots = () => fetchAll<LotDto>("/api/lots", { includeInactive: true });
