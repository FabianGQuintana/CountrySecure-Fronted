import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
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
    <html lang="es">
      <body
        className={`${inter.className} min-h-screen w-full`}
      >
        <main className="w-full">{children}</main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
