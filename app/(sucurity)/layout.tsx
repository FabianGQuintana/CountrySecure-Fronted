"use client";

import { SessionProvider } from "next-auth/react";
import Menu from "@/components/navbar";
import Footer from "@/components/footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        {/* 
        <Footer /> */}
      </div>
    </SessionProvider>
  );
}
