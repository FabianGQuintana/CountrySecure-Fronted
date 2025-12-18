import { auth } from "@/auth";
import FamilyVisitsPageClient from "@/components/Security/FamilyVisitsPageClient";

export default async function FamilyVisitsPage() {
  const session = await auth();

  return (
    <div className="in-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <FamilyVisitsPageClient
        initialToken={session?.accessToken || null}
        apiHost={process.env.API_HOST || ""}
      />
    </div>
  );
}
