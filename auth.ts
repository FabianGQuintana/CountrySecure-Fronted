import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

// Para usar en componentes del servidor
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

// Para usar en componentes del servidor (da toda la sesión)
export async function getSession() {
  return await getServerSession(authOptions);
}

// Re-exporta signIn y signOut para el cliente
export { signIn, signOut } from "next-auth/react";

// Para proteger rutas en el servidor
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("No autenticado");
  }

  return session.user;
}
