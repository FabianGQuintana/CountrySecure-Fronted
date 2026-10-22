import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/**
 * Única forma de leer la sesión en el servidor (Server Components, layouts y Server Actions).
 * Devuelve el usuario de la sesión o `undefined` si no hay sesión válida
 * (sin cookie, o con el token vencido/irrecuperable). Nunca renueva tokens: eso lo hace `proxy.ts`.
 */
export async function auth() {
  const session = await getServerSession(authOptions);
  if (!session || session.error) return undefined;
  return session.user;
}
