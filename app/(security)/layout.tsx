import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import MenuSecurity from "@/components/Security/MenuSecurity";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "Security") {
    redirect("/");
  }

  return (
    <SessionProviderWrapper>
      <div className="min-h-screen flex bg-slate-900 text-gray-200">
        {/* Sidebar */}
        <MenuSecurity />

        {/* Main content */}
        <main className="flex-1 lg:ml-64 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 min-h-screen">
          {children}
        </main>
      </div>
    </SessionProviderWrapper>
  );
}
