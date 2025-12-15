// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import SessionProviderWrapper from "@/components/SessionProviderWrapper";
// import ResidentSidebar from "@/components/residentes/sideBar/ResidentSidebar";

// export default async function ResidentLayout({ children }: { children: React.ReactNode }) {
//   const user = await auth();

//   if (!user) redirect("/login");

//   if (user.role !== "Resident") redirect("/");

//   return (
//     <SessionProviderWrapper>
//       <div className="min-h-screen flex w-full">
//         {/* Sidebar fijo */}
//         <ResidentSidebar />

//         {/* Contenido principal */}
//         <main className="flex-1 p-6 bg-background">
//           {children}
//         </main>
//       </div>
//     </SessionProviderWrapper>
//   );
// }


import { auth } from "@/auth"
import { redirect } from "next/navigation"
import SessionProviderWrapper from "@/components/SessionProviderWrapper"
import ResidentShell from "@/components/residentes/ResidentShell"

export default async function ResidentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await auth()

  if (!user) redirect("/login")
  if (user.role !== "Resident") redirect("/")

  return (
    <SessionProviderWrapper>
      <ResidentShell>
        {children}
      </ResidentShell>
    </SessionProviderWrapper>
  )
}
