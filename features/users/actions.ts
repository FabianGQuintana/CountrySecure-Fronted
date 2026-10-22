"use server";

import { api } from "@/lib/api-client";
import { runAction } from "@/lib/action";
import type { Role } from "@/types/api";
import type { UserDto } from "@/types/models";
import { getCurrentUserProfile, getUserById, getUsersByRole } from "./queries";
import type { ChangePasswordInput, CreateUserInput, UpdateUserInput } from "./schemas";

export const listUsers = async (role: Role) => runAction(() => getUsersByRole(role));

export const fetchUser = async (id: string) => runAction(() => getUserById(id));

export const fetchCurrentUser = async () => runAction(() => getCurrentUserProfile());

/** Solo Admin: da de alta una cuenta (POST /api/auth/register). */
export const createUser = async (data: CreateUserInput) =>
  runAction(() => api.post<{ success: boolean; message?: string; userId: string }>("/api/auth/register", data));

export const updateUser = async (id: string, data: UpdateUserInput) =>
  runAction(() => api.put<UserDto>(`/api/users/${id}`, data));

/** Edición del propio perfil. */
export const updateCurrentUser = async (data: UpdateUserInput) =>
  runAction(() => api.put<UserDto>("/api/users/me", data));

export const deactivateUser = async (id: string) => runAction(() => api.delete<UserDto>(`/api/users/${id}`));

export const restoreUser = async (id: string) => runAction(() => api.post<UserDto>(`/api/users/${id}/restore`));

export const changePassword = async (data: ChangePasswordInput) =>
  runAction(() => api.post<{ message: string }>("/api/auth/change-password", data));
