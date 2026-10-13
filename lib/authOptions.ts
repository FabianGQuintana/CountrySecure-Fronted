import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import { login } from "@/actions/AuthActions";

// Renovamos el access token un minuto antes de que venza
const REFRESH_MARGIN_MS = 60 * 1000;
// Fallback si el backend no informa la expiración (el JWT del backend dura 8 h)
const DEFAULT_ACCESS_TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

function parseExpiration(expiration?: string): number {
  const parsed = expiration ? Date.parse(expiration) : NaN;
  return Number.isNaN(parsed) ? Date.now() + DEFAULT_ACCESS_TOKEN_TTL_MS : parsed;
}

/**
 * Rotación silenciosa: pide un nuevo par access/refresh token al backend.
 * El refresh token anterior queda marcado como usado en la base (rotación).
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${process.env.API_HOST}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      }),
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Refresh failed: ${response.status}`);

    const data = await response.json();

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpires: parseExpiration(data.expiration),
      error: undefined,
    };
  } catch (error) {
    console.error("Error al renovar el access token:", error);
    // proxy.ts y los guards redirigen a /login cuando ven este error
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET || process.env.JWT_SECRET,

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
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
        };
      }

      // Access token todavía vigente
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires - REFRESH_MARGIN_MS) {
        return token;
      }

      // Vencido o por vencer: rotación silenciosa
      return refreshAccessToken(token);
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
      session.error = token.error;

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
        });
      } catch (error) {
        console.error("Error al revocar el refresh token:", error);
      }
    },
  },
};
