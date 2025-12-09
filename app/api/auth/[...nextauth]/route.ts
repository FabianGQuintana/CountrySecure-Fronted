import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "@/actions/AuthActions";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

// Definir tipos extendidos
interface ExtendedUser extends User {
  id: string;
  name?: string | null;
  lastname?: string | null;
  email: string;
  role?: "Admin" | "Resident" | "Security";
  token?: string;
}

interface ExtendedToken extends JWT {
  id?: string;
  name?: string | null;
  lastname?: string | null;
  email?: string | null;
  role?: "Admin" | "Resident" | "Security";
  token?: string;
}

interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    lastname?: string | null;
    email?: string | null;
    role?: "Admin" | "Resident" | "Security";
    token?: string;
  } & Session["user"];
}

const authOptions = {
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const result = await login({
            email: credentials.email.toString(),
            password: credentials.password.toString(),
          });

          if (!result?.success) {
            return null;
          }

          return {
            id: result.userId,
            name: result.name || null,
            lastname: result.lastname || null,
            email: result.email,
            role: result.role,
            token: result.token,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: ExtendedUser;
    }): Promise<ExtendedToken> {
      const extendedToken = token as ExtendedToken;

      if (user) {
        extendedToken.id = user.id;
        extendedToken.email = user.email;
        extendedToken.name = user.name;
        extendedToken.lastname = user.lastname;
        extendedToken.role = user.role;
        extendedToken.token = user.token;
      }

      return extendedToken;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<ExtendedSession> {
      const extendedSession = session as ExtendedSession;
      const extendedToken = token as ExtendedToken;

      if (extendedSession.user) {
        extendedSession.user.id = extendedToken.id as string;
        extendedSession.user.email = extendedToken.email as string;
        extendedSession.user.name = extendedToken.name as string;
        extendedSession.user.lastname = extendedToken.lastname as string;
        extendedSession.user.role = extendedToken.role as
          | "Admin"
          | "Resident"
          | "Security";
        extendedSession.user.token = extendedToken.token as string;
      }

      return extendedSession;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export { authOptions };
