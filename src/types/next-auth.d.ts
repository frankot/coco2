import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "ADMIN" | "USER";
      accountType?: "ADMIN" | "DETAL" | "HURT";
    } & DefaultSession["user"];
  }

  /**
   * Extend the built-in user types
   */
  interface User {
    id: string;
    role: "ADMIN" | "USER";
    accountType?: "ADMIN" | "DETAL" | "HURT";
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the built-in JWT types
   */
  interface JWT {
    id: string;
    role: "ADMIN" | "USER";
    accountType?: "ADMIN" | "DETAL" | "HURT";
  }
}
