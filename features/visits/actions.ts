"use server";

import { api } from "@/lib/api-client";
import { runAction } from "@/lib/action";
import type { PagedResult, VisitDto } from "@/types/models";

export interface VisitInput {
  nameVisit: string;
  lastNameVisit: string;
  dniVisit: number;
}

export const createVisit = async (data: VisitInput) => runAction(() => api.post<VisitDto>("/api/visits", data));

/** Busca visitantes por DNI exacto (el DNI es único, así que devuelve 0 o 1). */
export const findVisitsByDni = async (dni: number) =>
  runAction(async () => (await api.get<PagedResult<VisitDto>>("/api/visits", { dni })).items);
