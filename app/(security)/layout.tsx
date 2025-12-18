// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import SessionProviderWrapper from "@/components/SessionProviderWrapper";
// import MenuSecurity from "@/components/Security/MenuSecurity";

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // Obtener usuario actual
//   const user = await auth();

//   // Si no está autenticado -> login
//   if (!user) {
//     redirect("/login");
//   }

//   // Si no es Security -> acceso denegado
//   if (user.role !== "Security") {
//     redirect("/");
//   }

//   // Si pasa las verificaciones (es Security) -> mostrar layout
//   return (
//     <SessionProviderWrapper>
//       <div className="min-h-screen flex flex-col">
//         {" "}
//         <MenuSecurity/>{" "}
//         <main className="flex-1 lg:ml-64 ">{children}</main>{" "}
//       </div>
//     </SessionProviderWrapper>
//   );
// }

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
