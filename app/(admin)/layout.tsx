import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await auth();
  if (!user) redirect("/login");
  if (user.role !== "Admin") redirect("/");

  return <AppShell role="Admin">{children}</AppShell>;
}
