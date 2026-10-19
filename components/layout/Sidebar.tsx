"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { NAVIGATION, isActivePath } from "@/lib/navigation";
import { ROLE_PREFIX, type Role } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Menú lateral único para los tres roles. Lo que cambia entre ellos vive en `lib/navigation.ts`.
 * En escritorio es una columna fija; en móvil es un panel que se abre con el botón de menú.
 */
export default function Sidebar({ role }: { role: Role }) {
  const nav = NAVIGATION[role];
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const fullName = [session?.user?.name, session?.user?.lastname].filter(Boolean).join(" ");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-3 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
        aria-label="Abrir menú"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} aria-hidden />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-slate-900 text-slate-300 border-r border-purple-500/20 shadow-xl",
          "transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-800"
          aria-label="Cerrar menú"
        >
          <X size={20} />
        </button>

        <Link
          href={nav.homeHref}
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 p-6 border-b border-slate-800 hover:bg-slate-800/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="text-white font-semibold truncate">{fullName || "Country Secure"}</p>
            <p className="text-xs text-purple-400">{nav.subtitle}</p>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto p-4 space-y-5">
          {nav.sections.map((section, i) => (
            <div key={section.title ?? i} className="space-y-1">
              {section.title && (
                <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
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
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors",
                      active
                        ? "bg-purple-500/15 border-purple-500/30 text-white"
                        : "border-transparent hover:bg-slate-800/60 hover:text-white"
                    )}
                  >
                    <Icon size={19} className={active ? "text-purple-400" : "text-slate-400"} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-purple-500/30 text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
