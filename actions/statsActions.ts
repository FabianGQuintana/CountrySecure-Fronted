"use server";

import { auth } from "@/auth";
import type { AdminStats, ResidentStats, SecurityStats } from "@/types/stats";

async function getStats<T>(path: "admin" | "resident" | "security"): Promise<T> {
  const session = await auth();
  if (!session?.accessToken) throw new Error("No autenticado");

  const response = await fetch(`${process.env.API_HOST}/api/stats/${path}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Error al obtener estadísticas (${response.status})`);
  return response.json();
}

export async function getAdminStats() {
  return getStats<AdminStats>("admin");
}

export async function getResidentStats() {
  return getStats<ResidentStats>("resident");
}

export async function getSecurityStats() {
  return getStats<SecurityStats>("security");
}
