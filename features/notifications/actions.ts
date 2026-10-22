"use server";

import { api } from "@/lib/api-client";
import { runAction } from "@/lib/action";
import type { NotificationDto, PagedResult } from "@/types/models";

/** Avisos recientes y cantidad sin leer (una sola llamada para la campana). */
export const fetchNotifications = async () =>
  runAction(async () => {
    const [page, unread] = await Promise.all([
      api.get<PagedResult<NotificationDto>>("/api/notifications", { page: 1, pageSize: 15 }),
      api.get<{ count: number }>("/api/notifications/unread-count"),
    ]);
    return { items: page.items, unread: unread.count };
  });

export const markNotificationRead = async (id: string) => runAction(() => api.patch<void>(`/api/notifications/${id}/read`));

export const markAllNotificationsRead = async () => runAction(() => api.post<void>("/api/notifications/read-all"));
