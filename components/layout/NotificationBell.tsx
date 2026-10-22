"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, LogIn, LogOut } from "lucide-react";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "@/features/notifications/actions";
import type { NotificationDto } from "@/types/models";

const POLL_MS = 15_000;

const timeFormat = new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" });

/**
 * Campana de avisos del residente ("Tu visita ... ha ingresado al barrio"). Consulta cada 15 segundos
 * mientras la pestaña está visible, así el aviso llega casi en tiempo real sin conexiones persistentes.
 */
export default function NotificationBell() {
  const [items, setItems] = useState<NotificationDto[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const knownIds = useRef<Set<string> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [toastText, setToastText] = useState<string | null>(null);

  const load = useCallback(async () => {
    const result = await fetchNotifications();
    if (!result.ok) return;
    setItems(result.data.items);
    setUnread(result.data.unread);

    // Aviso emergente solo para avisos nuevos (no para los que ya estaban al abrir la página)
    const ids = new Set(result.data.items.map((n) => n.id));
    if (knownIds.current) {
      const fresh = result.data.items.find((n) => !n.read && !knownIds.current!.has(n.id));
      if (fresh) setToastText(fresh.message);
    }
    knownIds.current = ids;
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial y sondeo periódico
    load();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, POLL_MS);
    const onVisible = () => document.visibilityState === "visible" && void load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  useEffect(() => {
    if (!toastText) return;
    const t = setTimeout(() => setToastText(null), 8000);
    return () => clearTimeout(t);
  }, [toastText]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => containerRef.current && !containerRef.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const read = async (n: NotificationDto) => {
    if (n.read) return;
    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    setUnread((c) => Math.max(0, c - 1));
    await markNotificationRead(n.id);
  };

  const readAll = async () => {
    setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    setUnread(0);
    await markAllNotificationsRead();
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={unread > 0 ? `Avisos: ${unread} sin leer` : "Avisos"}
        aria-expanded={open}
        className="relative rounded-full bg-card p-2.5 text-primary ring-1 ring-border hover:bg-primary-soft"
      >
        <Bell size={22} aria-hidden />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-danger px-1.5 text-center text-xs font-bold leading-5 text-on-status">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {toastText && !open && (
        <div role="status" className="absolute right-0 top-14 w-72 rounded-xl bg-success p-4 text-sm font-medium text-on-status shadow-xl">
          {toastText}
        </div>
      )}

      {open && (
        <div className="absolute right-0 top-14 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-card shadow-2xl ring-1 ring-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-semibold text-foreground">Avisos</h2>
            {unread > 0 && (
              <button type="button" onClick={readAll} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                <CheckCheck size={16} aria-hidden /> Marcar todo como leído
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">No tenés avisos.</p>
          ) : (
            <ul className="max-h-96 divide-y divide-border overflow-y-auto">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => read(n)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted ${n.read ? "" : "bg-primary-soft/60"}`}
                  >
                    {n.type === "VisitCheckOut" ? (
                      <LogOut size={18} className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden />
                    ) : (
                      <LogIn size={18} className="mt-0.5 shrink-0 text-success" aria-hidden />
                    )}
                    <span className="min-w-0">
                      <span className="block text-sm text-foreground">{n.message}</span>
                      <span className="block text-xs text-muted-foreground">{timeFormat.format(new Date(n.createdAt))}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
