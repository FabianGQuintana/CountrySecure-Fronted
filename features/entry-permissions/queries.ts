import "server-only";
import { api, fetchAll, type Query } from "@/lib/api-client";
import type { EntryPermissionDto, GateCheckDto, PagedResult } from "@/types/models";

export const getPermissionById = (id: string) => api.get<EntryPermissionDto>(`/api/entry-permissions/${id}`);

/** Una página de permisos (Seguridad/Admin ven todos; un residente solo los suyos). */
export const getPermissionsPage = (query: Query = {}) =>
  api.get<PagedResult<EntryPermissionDto>>("/api/entry-permissions", query);

/** Todos los permisos que cumplen el filtro (recorre las páginas). */
export const getAllPermissions = (query: Query = {}) => fetchAll<EntryPermissionDto>("/api/entry-permissions", query);

export const getTodayPermissions = (page: number, pageSize: number) =>
  api.get<PagedResult<EntryPermissionDto>>("/api/entry-permissions/today", { page, pageSize });

export const getPermissionHistory = (query: { page: number; pageSize: number; search?: string; type?: string }) =>
  api.get<PagedResult<EntryPermissionDto>>("/api/entry-permissions/history", query);

export const validateQr = (code: string) => api.get<GateCheckDto>("/api/entry-permissions/validate", { code });

/** Historial completo de ingresos (recorre las páginas), para filtrar por fecha/tipo en el cliente. */
export const getAllHistory = () => fetchAll<EntryPermissionDto>("/api/entry-permissions/history");
