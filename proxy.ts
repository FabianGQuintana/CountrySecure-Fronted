import { NextResponse, type NextRequest } from "next/server";
import { encode, getToken, type JWT } from "next-auth/jwt";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  parseExpiration,
} from "@/lib/authOptions";
import { LOGIN_PATH, ROLE_PREFIX, homeForRole, isRole, safeCallbackUrl } from "@/lib/routes";

/**
 * Proxy (antes "middleware"): ÚNICO dueño del ciclo de vida de la sesión.
 *
 *  1. Protege /admin, /resident y /security según el rol.
 *  2. Renueva el access token cuando está por vencer y GUARDA el token nuevo en la cookie
 *     (solo acá se pueden escribir cookies de forma confiable).
 *  3. Si la sesión no es recuperable, borra la cookie y manda a /login (una sola vez, sin bucles).
 *  4. Si ya hay sesión válida, /login lleva a la home del rol.
 */

const SECRET = process.env.AUTH_SECRET || process.env.JWT_SECRET;

// Se renueva un minuto antes de que venza
const REFRESH_MARGIN_MS = 60 * 1000;
const REFRESH_TIMEOUT_MS = 5000;

type RefreshResult =
  | { ok: true; token: JWT }
  | { ok: false; reason: "invalid" | "unavailable" };

async function refreshTokens(token: JWT): Promise<RefreshResult> {
  try {
    const response = await fetch(`${process.env.API_HOST}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
    });

    // 400/401/404: el refresh token no sirve (vencido, revocado, usuario inexistente) -> hay que re-loguear
    if (response.status >= 400 && response.status < 500) return { ok: false, reason: "invalid" };
    if (!response.ok) return { ok: false, reason: "unavailable" };

    const data = await response.json();
    return {
      ok: true,
      token: {
        ...token,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpires: parseExpiration(data.expiration),
        error: undefined,
      },
    };
  } catch (error) {
    console.error("[proxy] No se pudo renovar el access token:", error);
    // Timeout o API caída: no es culpa de la sesión, se trata aparte
    return { ok: false, reason: "unavailable" };
  }
}

function needsRefresh(token: JWT) {
  return !token.accessTokenExpires || Date.now() >= token.accessTokenExpires - REFRESH_MARGIN_MS;
}

function secureCookies() {
  return process.env.NODE_ENV === "production";
}

function clearSession(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: secureCookies(),
    maxAge: 0,
  });
  return response;
}

function redirectToLogin(request: NextRequest, reason?: string, callbackPath?: string) {
  const url = new URL(LOGIN_PATH, request.url);
  if (callbackPath) url.searchParams.set("callbackUrl", callbackPath);
  if (reason) url.searchParams.set("reason", reason);
  return clearSession(NextResponse.redirect(url));
}

/** Reenvía la request con la cookie nueva (para que los Server Components vean el token renovado). */
function nextWithToken(request: NextRequest, encoded: string) {
  const cookies = request.cookies.getAll().filter((c) => c.name !== SESSION_COOKIE_NAME);
  const cookieHeader = [...cookies.map((c) => `${c.name}=${c.value}`), `${SESSION_COOKIE_NAME}=${encoded}`].join("; ");

  const headers = new Headers(request.headers);
  headers.set("cookie", cookieHeader);

  const response = NextResponse.next({ request: { headers } });
  response.cookies.set(SESSION_COOKIE_NAME, encoded, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: secureCookies(),
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isSessionEndpoint = pathname === "/api/auth/session";
  const isLogin = pathname === LOGIN_PATH;

  let token = await getToken({ req: request, secret: SECRET, cookieName: SESSION_COOKIE_NAME });

  // --- Renovación (sobre cualquier ruta cubierta por el matcher) ---
  let refreshedCookie: string | null = null;
  let apiUnavailable = false;
  if (token && needsRefresh(token)) {
    const result = await refreshTokens(token);

    if (result.ok) {
      token = result.token;
      refreshedCookie = await encode({ token, secret: SECRET!, maxAge: SESSION_MAX_AGE_SECONDS });
    } else if (result.reason === "invalid") {
      // Sesión irrecuperable: se limpia la cookie.
      token = null;
      if (isSessionEndpoint) return clearSession(NextResponse.next());
      if (isLogin) return clearSession(NextResponse.next());
      return redirectToLogin(request, "expired", `${pathname}${search}`);
    } else {
      // API no disponible: no se destruye la sesión; se corta con un error claro en vez de colgarse.
      apiUnavailable = true;
      if (!isLogin && !isSessionEndpoint) {
        return new NextResponse("El servicio no está disponible. Intentá de nuevo en unos instantes.", {
          status: 503,
          headers: { "Retry-After": "5", "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    }
  }

  const proceed = () => (refreshedCookie ? nextWithToken(request, refreshedCookie) : NextResponse.next());

  // --- /api/auth/session: solo mantiene la cookie al día ---
  if (isSessionEndpoint) return proceed();

  // --- /login: con sesión válida va directo a la home del rol ---
  if (isLogin) {
    if (token && isRole(token.role) && !token.error && !apiUnavailable) {
      const target = safeCallbackUrl(request.nextUrl.searchParams.get("callbackUrl"), token.role);
      const response = NextResponse.redirect(new URL(target, request.url));
      if (refreshedCookie) {
        response.cookies.set(SESSION_COOKIE_NAME, refreshedCookie, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: secureCookies(),
          maxAge: SESSION_MAX_AGE_SECONDS,
        });
      }
      return response;
    }
    return NextResponse.next();
  }

  // --- Rutas protegidas por rol ---
  if (!token || token.error || !isRole(token.role)) {
    return redirectToLogin(request, token ? "expired" : undefined, `${pathname}${search}`);
  }

  const requiredRole = (Object.keys(ROLE_PREFIX) as (keyof typeof ROLE_PREFIX)[]).find(
    (role) => pathname === ROLE_PREFIX[role] || pathname.startsWith(`${ROLE_PREFIX[role]}/`)
  );

  if (requiredRole && token.role !== requiredRole) {
    return NextResponse.redirect(new URL(homeForRole(token.role), request.url));
  }

  return proceed();
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/resident/:path*", "/security/:path*", "/api/auth/session"],
};
