import "server-only";
import { api, fetchAll } from "@/lib/api-client";
import type { Role } from "@/types/api";
import type { UserDto } from "@/types/models";

/** Usuarios de un rol (incluye los dados de baja, para que el Admin pueda reactivarlos). */
export const getUsersByRole = (role: Role) =>
  fetchAll<UserDto>("/api/users", { role, includeInactive: true });

export const getUserById = (id: string) => api.get<UserDto>(`/api/users/${id}`);

export const getCurrentUserProfile = () => api.get<UserDto>("/api/users/me");
