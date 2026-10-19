import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "@/actions/AuthActions";

// La sesión de NextAuth dura lo mismo que el refresh token del backend (7 días).
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

// Nombre de la cookie de sesión. Lo comparten NextAuth y el proxy.
export const SESSION_COOKIE_NAME = "next-auth.session-token";

// Fallback si el backend no informa la expiración (el JWT del backend dura 8 h)
const DEFAULT_ACCESS_TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

export function parseExpiration(expiration?: string): number {
  const parsed = expiration ? Date.parse(expiration) : NaN;
  return Number.isNaN(parsed) ? Date.now() + DEFAULT_ACCESS_TOKEN_TTL_MS : parsed;
}

/**
 * IMPORTANTE: acá NO se renueva el access token.
 * Los callbacks de NextAuth corren dentro de Server Components, donde no se pueden escribir
 * cookies: el token renovado se perdería y el refresh token (de un solo uso) quedaría consumido.
 * La renovación vive en `proxy.ts`, el único lugar que puede persistir la cookie.
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
  },

  jwt: {
    maxAge: SESSION_MAX_AGE_SECONDS,
  },

  secret: process.env.AUTH_SECRET || process.env.JWT_SECRET,

  cookies: {
    sessionToken: {
      name: SESSION_COOKIE_NAME,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const result = await login({
            email: credentials.email.toString(),
            password: credentials.password.toString(),
          });

          if (!result?.success) return null;

          return {
            id: result.userId,
            name: result.name || null,
            lastname: result.lastname || null,
            email: result.email,
            role: result.role,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            accessTokenExpires: parseExpiration(result.expiration),
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Primer login: copiamos los datos del usuario al JWT (cookie httpOnly cifrada)
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          lastname: user.lastname,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          error: undefined,
        };
      }

      return token;
    },

    async session({ session, token }) {
      // El refresh token NUNCA se expone al cliente: solo vive en el JWT de NextAuth (cookie httpOnly).
      session.user = {
        ...session.user,
        id: token.id as string,
        email: token.email,
        name: token.name,
        lastname: token.lastname,
        role: token.role,
        accessToken: token.accessToken,
      };

      // Si el access token ya venció y el proxy no pudo renovarlo, la sesión se considera inválida.
      if (token.error) {
        session.error = token.error;
      } else if (token.accessTokenExpires && Date.now() >= token.accessTokenExpires) {
        session.error = "RefreshAccessTokenError";
      }

      return session;
    },
  },

  events: {
    // Revoca el refresh token en el backend al cerrar sesión
    async signOut({ token }) {
      if (!token?.refreshToken || !token?.accessToken) return;
      try {
        await fetch(`${process.env.API_HOST}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.accessToken}`,
          },
          body: JSON.stringify({ refreshToken: token.refreshToken }),
          cache: "no-store",
          signal: AbortSignal.timeout(5000),
        });
      } catch (error) {
        console.error("Error al revocar el refresh token:", error);
      }
    },
  },
};
