"use server";

import { api } from "@/lib/api-client";
import { runAction } from "@/lib/action";
import type { TurnDto } from "@/types/models";
import { getAllTurns, getMyTurns } from "./queries";

export interface CreateTurnInput {
  amenityId: string;
  startTime: string;
  endTime: string;
}

export const createTurn = async (data: CreateTurnInput) => runAction(() => api.post<TurnDto>("/api/turns", data));

export const listMyTurns = async () => runAction(() => getMyTurns());

/** Todas las reservas (Admin). */
export const listAllTurns = async () => runAction(() => getAllTurns());

/** Cancela una reserva propia (baja lógica; el backend la marca como Cancelled). */
export const cancelTurn = async (id: string) => runAction(() => api.delete<TurnDto>(`/api/turns/${id}`));
