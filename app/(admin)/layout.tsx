"use client";
import { SessionProvider } from "next-auth/react";
import MenuAdmin from "@/components/admin/navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 lg:ml-64 ">
          {children}
          <MenuAdmin />
        </main>
      </div>
    </SessionProvider>
  );
}
