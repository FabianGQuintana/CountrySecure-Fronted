import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

type Role = "Admin" | "Resident" | "Security";

// Qué rol puede entrar a cada sección
const PROTECTED_ROUTES: { prefix: string; role: Role }[] = [
  { prefix: "/admin", role: "Admin" },
  { prefix: "/resident", role: "Resident" },
  { prefix: "/security", role: "Security" },
];

// Página de inicio de cada rol (para redirigir si entra a una sección ajena)
const HOME_BY_ROLE: Record<Role, string> = {
  Admin: "/admin",
  Resident: "/resident/dashboard",
  Security: "/security/visit",
};

/**
 * Protección de rutas por rol en el edge, antes de renderizar.
 * Reemplaza los guards que antes se repetían del lado del cliente.
 * (Los layouts de cada grupo mantienen su verificación en el servidor como defensa en profundidad.)
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const route = PROTECTED_ROUTES.find(
    (r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`)
  );

  if (!route) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || process.env.JWT_SECRET,
    cookieName: "next-auth.session-token", // mismo nombre que en lib/authOptions.ts (Next 16: proxy reemplaza a middleware)
  });

  // Sin sesión, o con la renovación del token fallida -> login
  if (!token || token.error) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Rol incorrecto -> a la home de su propio rol
  if (token.role !== route.role) {
    const home = token.role ? HOME_BY_ROLE[token.role] : "/";
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/resident/:path*", "/security/:path*"],
};
