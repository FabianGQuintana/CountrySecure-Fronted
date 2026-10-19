import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PassCard } from "@/components/pass/PassCard";
import type { PassDto } from "@/types/models";

// Es un enlace privado compartido por WhatsApp o email: que no lo indexe ningún buscador
export const metadata: Metadata = {
  title: "Pase de ingreso | CountrySecure",
  robots: { index: false, follow: false },
};

const API_URL = (process.env.API_HOST ?? "").replace(/\/$/, "");

async function loadPass(token: string): Promise<PassDto | null> {
  try {
    const response = await fetch(`${API_URL}/api/passes/${encodeURIComponent(token)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return (await response.json()) as PassDto;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Error ")) throw error;
    throw new Error("No se pudo conectar con el servidor.");
  }
}

export default async function PublicPassPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const pass = await loadPass(token);
  if (!pass) notFound();

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-violet-50 via-purple-50 to-indigo-100 px-4 py-10">
      <PassCard pass={pass} />
    </div>
  );
}
