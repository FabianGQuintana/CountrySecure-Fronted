"use server";

import { api } from "@/lib/api-client";
import { runAction } from "@/lib/action";
import type { PermissionType } from "@/types/api";
import type { EntryPermissionDto } from "@/types/models";
import {
  getAllHistory,
  getAllPermissions,
  getPermissionById,
  getPermissionHistory,
  getTodayPermissions,
  validateQr,
} from "./queries";

export interface CreatePermissionInput {
  permissionType: PermissionType;
  description?: string | null;
  validFrom: string;
  validTo: string;
  visitId: string;
  userId: string;
  orderId?: string | null;
}

export const createPermission = async (data: CreatePermissionInput) =>
  runAction(() => api.post<EntryPermissionDto>("/api/entry-permissions", data));

export const fetchPermission = async (id: string) => runAction(() => getPermissionById(id));

/** Permisos de tipo visita (visitas de familiares y amigos). */
export const listVisitPermissions = async () => runAction(() => getAllPermissions({ type: "Visit" }));

/** Historial completo de ingresos efectivos. */
export const listPermissionHistory = async () => runAction(() => getAllHistory());

/** Permisos de tipo mantenimiento (servicios/proveedores). */
export const listMaintenancePermissions = async () =>
  runAction(() => getAllPermissions({ type: "Maintenance" }));

export const fetchTodayPermissions = async (page: number, pageSize: number) =>
  runAction(() => getTodayPermissions(page, pageSize));

export const fetchPermissionHistory = async (query: { page: number; pageSize: number; search?: string; type?: string }) =>
  runAction(() => getPermissionHistory(query));

export const validateQrCode = async (code: string) => runAction(() => validateQr(code));

export const checkInPermission = async (id: string) =>
  runAction(() => api.patch<EntryPermissionDto>(`/api/entry-permissions/${id}/check-in`));

export const checkOutPermission = async (id: string) =>
  runAction(() => api.patch<EntryPermissionDto>(`/api/entry-permissions/${id}/check-out`));
