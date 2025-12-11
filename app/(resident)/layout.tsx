import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export default async function ResidentLayout({ children }: { children: React.ReactNode }) {
  const user = await auth();

  if (!user) redirect("/login");

  if (user.role !== "Resident") redirect("/");

  return (
    <SessionProviderWrapper>
      <div className="min-h-screen w-full flex">
        {/* El sidebar lo renderiza cada page */}
        {children}
      </div>
    </SessionProviderWrapper>
  );
}
