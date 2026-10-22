"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu, Pencil, X } from "lucide-react";
import { AvatarPicker } from "@/components/avatar/AvatarPicker";
import { UserAvatar } from "@/components/avatar/avatars";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NAVIGATION, isActivePath } from "@/lib/navigation";
import { ROLE_PREFIX, type Role } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Menú lateral único para los tres roles. Lo que cambia entre ellos vive en `lib/navigation.ts`.
 * En escritorio es una columna fija; en móvil es un panel que se abre con el botón de menú.
 * Incluye el interruptor de tema Claro/Oscuro y el selector de avatar (al tocar el avatar).
 */
export default function Sidebar({ role }: { role: Role }) {
  const nav = NAVIGATION[role];
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const fullName = [session?.user?.name, session?.user?.lastname].filter(Boolean).join(" ");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-3 rounded-xl bg-primary text-primary-foreground shadow-lg"
        aria-label="Abrir menú"
      >
        <Menu size={22} />
      </button>

      {open && <div className="lg:hidden fixed inset-0 z-40 bg-overlay" onClick={() => setOpen(false)} aria-hidden />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-sidebar text-sidebar-foreground border-r border-border shadow-xl lg:shadow-none",
          "transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-muted"
          aria-label="Cerrar menú"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 p-6 border-b border-border">
          {/* El avatar abre el selector: disponible para los tres roles */}
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            disabled={!session}
            className="group relative rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Cambiar avatar"
            title="Cambiar avatar"
          >
            <UserAvatar
              avatar={session?.user?.avatar}
              name={session?.user?.name}
              lastname={session?.user?.lastname}
              className="shadow-lg shadow-primary/20"
            />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm group-hover:text-primary">
              <Pencil size={11} aria-hidden />
            </span>
          </button>
          <Link
            href={nav.homeHref}
            onClick={() => setOpen(false)}
            className="min-w-0 leading-tight rounded-lg hover:opacity-80 transition-opacity"
          >
            <p className="text-foreground font-semibold truncate">{fullName || "Country Secure"}</p>
            <p className="text-xs text-primary">{nav.subtitle}</p>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-5">
          {nav.sections.map((section, i) => (
            <div key={section.title ?? i} className="space-y-1">
              {section.title && (
                <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const active = isActivePath(pathname, item.href, ROLE_PREFIX[role]);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      active
                        ? "bg-primary-soft text-primary-soft-foreground"
                        : "hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon size={19} className={active ? "text-primary" : "text-muted-foreground"} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-danger-soft hover:text-danger hover:border-danger/40 transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {pickerOpen && (
        <AvatarPicker
          current={session?.user?.avatar}
          name={session?.user?.name}
          lastname={session?.user?.lastname}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  );
}
