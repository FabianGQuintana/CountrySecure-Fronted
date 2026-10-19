import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

export default async function ResidentLayout({ children }: { children: React.ReactNode }) {
  const user = await auth();
  if (!user) redirect("/login");
  if (user.role !== "Resident") redirect("/");

  return (
    <AppShell role="Resident" className="p-4 sm:p-6 pt-16 lg:pt-6 bg-background overflow-x-hidden">
      {children}
    </AppShell>
  );
}
