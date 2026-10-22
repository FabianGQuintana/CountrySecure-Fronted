import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

export default async function SecurityLayout({ children }: { children: React.ReactNode }) {
  const user = await auth();
  if (!user) redirect("/login");
  if (user.role !== "Security") redirect("/");

  return (
    <AppShell role="Security">
      {children}
    </AppShell>
  );
}
