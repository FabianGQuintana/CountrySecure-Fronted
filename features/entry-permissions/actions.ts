"use server";

import { api } from "@/lib/api-client";
import { runAction } from "@/lib/action";
import type { PassType, PermissionType, ScanAction, VehicleType } from "@/types/api";
import type { EntryPermissionDto, ScanResultDto } from "@/types/models";
import {
  getAllHistory,
  getAllPermissions,
  getMyPermissions,
  getPass,
  getSync,
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
  companionsCount?: number;
  vehicleType?: VehicleType;
  vehiclePlate?: string | null;
  vehicleModel?: string | null;
  passType?: PassType;
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

/** Pases del residente (incluye los cancelados). */
export const listMyPermissions = async () => runAction(() => getMyPermissions());

export const fetchPass = async (id: string) => runAction(() => getPass(id));

/** El residente cancela un pase que todavía no se usó. */
export const cancelPermission = async (id: string) =>
  runAction(() => api.delete<EntryPermissionDto>(`/api/entry-permissions/${id}`));

/**
 * Escanea un pase en la guardia. Un rechazo NO es un error de la acción: llega como resultado
 * (success = false) con el motivo, para mostrarlo en pantalla roja.
 */
export const scanPass = async (input: { token: string; action?: ScanAction; offline?: boolean; scannedAt?: string }) =>
  runAction(() => api.post<ScanResultDto>("/api/entry-permissions/scan", input));

/** Descarga la lista de pases del día para la caché de la guardia. */
export const syncPasses = async () => runAction(() => getSync());
