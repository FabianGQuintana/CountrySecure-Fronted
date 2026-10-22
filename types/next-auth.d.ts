import "next-auth";
import "next-auth/jwt";
import { DefaultSession } from "next-auth";

type Role = "Admin" | "Resident" | "Security";

declare module "next-auth" {
  // Lo que devuelve `authorize` en el provider de credenciales
  interface User {
    id: string;
    name?: string | null;
    lastname?: string | null;
    email: string;
    role?: Role;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }

  // Lo que ve el cliente con useSession(): sin refresh token
  interface Session {
    user: {
      id: string;
      name?: string | null;
      lastname?: string | null;
      email?: string | null;
      role?: Role;
      accessToken: string;
    } & DefaultSession["user"];
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  // Contenido del JWT de NextAuth (cookie httpOnly, solo legible en el servidor)
  interface JWT {
    id?: string;
    name?: string | null;
    lastname?: string | null;
    email?: string | null;
    role?: Role;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: "RefreshAccessTokenError";
  }
}
