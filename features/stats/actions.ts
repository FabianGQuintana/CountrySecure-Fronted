"use server";

import { api } from "@/lib/api-client";
import { runAction } from "@/lib/action";
import type { AdminStats, ResidentStats, SecurityStats } from "@/types/stats";

export const fetchAdminStats = async () => runAction(() => api.get<AdminStats>("/api/stats/admin"));

export const fetchResidentStats = async () => runAction(() => api.get<ResidentStats>("/api/stats/resident"));

export const fetchSecurityStats = async () => runAction(() => api.get<SecurityStats>("/api/stats/security"));
