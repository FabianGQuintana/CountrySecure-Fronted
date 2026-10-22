import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

export default async function ResidentLayout({ children }: { children: React.ReactNode }) {
  const user = await auth();
  if (!user) redirect("/login");
  if (user.role !== "Resident") redirect("/");

  return (
    <AppShell role="Resident" className="overflow-x-hidden">
      {children}
    </AppShell>
  );
}
