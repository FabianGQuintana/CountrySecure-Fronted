import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

export default async function SecurityLayout({ children }: { children: React.ReactNode }) {
  const user = await auth();
  if (!user) redirect("/login");
  if (user.role !== "Security") redirect("/");

  return (
    <AppShell
      role="Security"
      className="bg-slate-900 text-gray-200 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800"
    >
      {children}
    </AppShell>
  );
}
