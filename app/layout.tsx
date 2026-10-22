import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemedToaster } from "@/components/theme/ThemedToaster";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CountrySecure",
  description: "CountrySecure: gestión y control de acceso para barrios privados y comunidades cerradas.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: la clase `dark` la pone el script de tema antes de hidratar
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${inter.className} min-h-screen w-full`}>
        <main className="w-full">{children}</main>
        <ThemedToaster />
      </body>
    </html>
  );
}
