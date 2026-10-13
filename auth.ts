import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

// Para usar en componentes del servidor
export async function auth() {
  const session = await getServerSession(authOptions);
  // Si la renovación del token falló, se trata como sesión inexistente (los layouts redirigen a /login)
  if (session?.error) return undefined;
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
