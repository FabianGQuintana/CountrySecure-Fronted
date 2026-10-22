import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// La configuración vive en lib/authOptions.ts: un route handler solo puede exportar métodos HTTP.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
