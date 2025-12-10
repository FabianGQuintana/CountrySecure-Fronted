import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    lastname?: string | null;
    email: string;
    role?: "Admin" | "Resident" | "Security";
    accessToken: string;
    refreshToken: string;
  }

  // Extiende la Session para incluir user con accessToken y refreshToken
  interface Session {
    user: {
      id: string;
      name?: string | null;
      lastname?: string | null;
      email?: string | null;
      role?: "Admin" | "Resident" | "Security";
      accessToken: string;
      refreshToken: string;
    } & DefaultSession["user"];
  }

  // Extiende JWT para almacenar tokens
  interface JWT {
    id?: string;
    name?: string | null;
    lastname?: string | null;
    email?: string | null;
    role?: "Admin" | "Resident" | "Security";
    accessToken: string;
    refreshToken: string;
  }
}
