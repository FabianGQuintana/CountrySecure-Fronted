// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { login } from "@/actions/AuthActions";
// import type { JWT } from "next-auth/jwt";
// import type { Session, User } from "next-auth";

// // TIPOS EXTENDIDOS
// interface ExtendedUser extends User {
//   id: string;
//   name?: string | null;
//   lastname?: string | null;
//   email: string;
//   role?: "Admin" | "Resident" | "Security";
//   accessToken: string;
//   refreshToken: string;
// }

// interface ExtendedToken extends JWT {
//   id?: string;
//   name?: string | null;
//   lastname?: string | null;
//   email?: string | null;
//   role?: "Admin" | "Resident" | "Security";
//   accessToken: string;
//   refreshToken: string;
// }

// interface ExtendedSession extends Session {
//   user: {
//     id: string;
//     name?: string | null;
//     lastname?: string | null;
//     email?: string | null;
//     role?: "Admin" | "Resident" | "Security";
//     accessToken: string;
//     refreshToken: string;
//   } & Session["user"];
// }

// const authOptions = {
//   session: {
//     strategy: "jwt" as const,
//   },
//   // si no usas NEXTAUTH_SECRET, dejalo igual—NextAuth lo requiere
//   secret: process.env.AUTH_SECRET || process.env.JWT_SECRET,

//   pages: {
//     signIn: "/auth/login",
//   },

//   providers: [
//     Credentials({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },

//       async authorize(credentials): Promise<ExtendedUser | null> {
//         try {
//           if (!credentials?.email || !credentials?.password) return null;

//           const result = await login({
//             email: credentials.email.toString(),
//             password: credentials.password.toString(),
//           });

//           if (!result?.success) return null;

//           return {
//             id: result.userId,
//             name: result.name || null,
//             lastname: result.lastname || null,
//             email: result.email,
//             role: result.role,
//             accessToken: result.accessToken,
//             refreshToken: result.refreshToken,
//           };
//         } catch (error) {
//           console.error("Auth error:", error);
//           return null;
//         }
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }: { token: JWT; user?: ExtendedUser }) {
//       const extendedToken = token as ExtendedToken;

//       if (user) {
//         extendedToken.id = user.id;
//         extendedToken.email = user.email;
//         extendedToken.name = user.name;
//         extendedToken.lastname = user.lastname;
//         extendedToken.role = user.role;
//         extendedToken.accessToken = user.accessToken;
//         extendedToken.refreshToken = user.refreshToken;
//       }

//       return extendedToken;
//     },

//     async session({ session, token }: { session: Session; token: JWT }) {
//       const extendedSession = session as ExtendedSession;
//       const extendedToken = token as ExtendedToken;

//       extendedSession.user.id = extendedToken.id!;
//       extendedSession.user.email = extendedToken.email!;
//       extendedSession.user.name = extendedToken.name!;
//       extendedSession.user.lastname = extendedToken.lastname!;
//       extendedSession.user.role = extendedToken.role!;
//       extendedSession.user.accessToken = extendedToken.accessToken;
//       extendedSession.user.refreshToken = extendedToken.refreshToken;

//       return extendedSession;
//     },
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
// export { authOptions };

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "@/actions/AuthActions";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

// --- TIPOS EXTENDIDOS (Sin cambios) ---
interface ExtendedUser extends User {
  id: string;
  name?: string | null;
  lastname?: string | null;
  email: string;
  role?: "Admin" | "Resident" | "Security";
  accessToken: string;
  refreshToken: string;
}

interface ExtendedToken extends JWT {
  id?: string;
  name?: string | null;
  lastname?: string | null;
  email?: string | null;
  role?: "Admin" | "Resident" | "Security";
  accessToken: string;
  refreshToken: string;
}

interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    lastname?: string | null;
    email?: string | null;
    role?: "Admin" | "Resident" | "Security";
    accessToken: string;
    refreshToken: string;
  } & Session["user"];
}

// --- CONFIGURACIÓN DE AUTH ---
const authOptions = {
  session: {
    strategy: "jwt" as const,
  },

  // Usa el secreto de producción definido en tu .env
  secret: process.env.AUTH_SECRET || process.env.JWT_SECRET,

  // 1. CRÍTICO PARA AWS: Indica a NextAuth que confíe en el Proxy (ALB/Nginx)
  trustHost: true,

  // 2. CONFIGURACIÓN DE COOKIES PARA HTTPS
  // Esto asegura que la cookie se guarde correctamente aunque Nginx use HTTP internamente
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true, // Obliga a usar HTTPS (el certificado lo maneja AWS)
      },
    },
  },

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
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      const extendedToken = token as ExtendedToken;

      if (user) {
        extendedToken.id = user.id;
        extendedToken.email = user.email;
        extendedToken.name = user.name;
        extendedToken.lastname = user.lastname;
        extendedToken.role = user.role;
        extendedToken.accessToken = user.accessToken;
        extendedToken.refreshToken = user.refreshToken;
      }

      return extendedToken;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      const extendedSession = session as ExtendedSession;
      const extendedToken = token as ExtendedToken;

      if (extendedToken) {
        extendedSession.user.id = extendedToken.id!;
        extendedSession.user.email = extendedToken.email!;
        extendedSession.user.name = extendedToken.name!;
        extendedSession.user.lastname = extendedToken.lastname!;
        extendedSession.user.role = extendedToken.role!;
        extendedSession.user.accessToken = extendedToken.accessToken;
        extendedSession.user.refreshToken = extendedToken.refreshToken;
      }

      return extendedSession;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export { authOptions };
