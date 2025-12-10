import { ReactNode } from "react";
import Menu from "@/components/navbar";
import Footer from "@/components/footer";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (user) {
    switch (user.role) {
      case "Admin":
        redirect("/admin/");
      case "Security":
        redirect("/securiti/");
      case "Resident":
        redirect("/resident/");
      default:
        redirect("/");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Menu />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
