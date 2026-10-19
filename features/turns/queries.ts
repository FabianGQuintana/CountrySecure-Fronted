import "server-only";
import { fetchAll } from "@/lib/api-client";
import type { TurnDto } from "@/types/models";

/** Reservas del usuario autenticado. */
export const getMyTurns = () => fetchAll<TurnDto>("/api/turns/me");

/** Todas las reservas (Admin). */
export const getAllTurns = () => fetchAll<TurnDto>("/api/turns");
