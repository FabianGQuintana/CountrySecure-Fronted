import { auth } from "@/auth";
import VisitsPageClient from "@/components/Security/VisitsPageClient"; 

export default async function VisitsPageWrapper() {
  const session = await auth();
  const accessToken = session?.accessToken;
  const apiHost = process.env.API_HOST || ""; 
  
  return (
    <VisitsPageClient
      initialToken={accessToken || null}
      initialApiHost={apiHost}
    />
  );
}
