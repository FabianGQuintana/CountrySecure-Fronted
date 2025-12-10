import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import MenuAdmin from "@/components/admin/navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "Admin") {
    redirect("/");
  }

  return (
    <SessionProviderWrapper>
      <div className="min-h-screen flex flex-col">
        {" "}
        <main className="flex-1 lg:ml-64 ">
          {children}
          <MenuAdmin />{" "}
        </main>{" "}
      </div>
    </SessionProviderWrapper>
  );
}
