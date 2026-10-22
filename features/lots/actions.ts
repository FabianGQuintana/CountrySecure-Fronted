"use server";

import { api } from "@/lib/api-client";
import { runAction } from "@/lib/action";
import type { LotState } from "@/types/api";
import type { LotDto } from "@/types/models";
import { getLots } from "./queries";

export interface LotInput {
  lotName: string;
  blockName: string;
  lotState: LotState;
}

export const listLots = async () => runAction(() => getLots());

export const createLot = async (data: LotInput) => runAction(() => api.post<LotDto>("/api/lots", data));

export const deleteLot = async (id: string) => runAction(() => api.delete<LotDto>(`/api/lots/${id}`));

export const restoreLot = async (id: string) => runAction(() => api.post<LotDto>(`/api/lots/${id}/restore`));
