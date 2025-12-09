// import "next-auth";
// import { DefaultSession } from "next-auth";

// declare module "next-auth" {
//   interface User {
//     id: string;
//     name?: string | null;
//     lastname?: string | null;
//     email: string;
//     role?: "Admin" | "Resident" | "Security";
//     token?: string;
//   }

//   interface Session {
//     user: {
//       id: string;
//       name?: string | null;
//       lastname?: string | null;
//       email?: string | null;
//       role?: "Admin" | "Resident" | "Security";
//       token?: string;
//     } & DefaultSession["user"];
//   }

//   interface JWT {
//     id?: string;
//     name?: string | null;
//     lastname?: string | null;
//     email?: string | null;
//     role?: "Admin" | "Resident" | "Security";
//     token?: string;
//   }
// }

import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    lastname?: string | null;
    email: string;
    role?: "Admin" | "Resident" | "Security";
    token?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      lastname?: string | null;
      email?: string | null;
      role?: "Admin" | "Resident" | "Security";
      token?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id?: string;
    name?: string | null;
    lastname?: string | null;
    email?: string | null;
    role?: "Admin" | "Resident" | "Security";
    token?: string;
  }
}
