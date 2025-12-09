import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Para usar en Server Components
export async function auth() {
  return await getServerSession(authOptions);
}

// Helper para obtener el usuario actual
export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

// Para verificar roles
export async function hasRole(role: "Admin" | "Resident" | "Security") {
  const user = await getCurrentUser();
  return user?.role === role;
}
