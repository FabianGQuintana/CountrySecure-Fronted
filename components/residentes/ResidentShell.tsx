"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import ResidentSidebar from "./sideBar/ResidentSidebar"

export default function ResidentShell({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="h-screen flex w-full overflow-hidden">

            {/* Botón hamburguesa (solo mobile) */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-indigo-600 text-white shadow"
            >
                ☰
            </button>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                    "md:translate-x-0 md:static md:block"
                )}
            >
                <ResidentSidebar onClose={() => setSidebarOpen(false)} />
            </aside>

            {/* Contenido */}
            <main className="flex-1 p-4 sm:p-6 bg-background overflow-y-auto overflow-x-hidden">
                {children}
            </main>
        </div>
    )
}
