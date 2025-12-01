"use client";
import MenuResidente from "@/components/residentes/navbar";
import { Menu } from "lucide-react";
import { SessionProvider } from "next-auth/react";

export default function ResidenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
          <MenuResidente />
        </main>

        {/* <Footer /> */}
      </div>
    </SessionProvider>
  );
}
