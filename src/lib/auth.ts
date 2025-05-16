import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyUserCredentials } from "@/lib/auth-utils";
import { findUserByEmail } from "@/lib/auth-server";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Check if credentials exist
          if (!credentials?.username || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          console.log("Verifying admin credentials for:", credentials.username);

          // Check if credentials match the admin credentials in .env
          const isValidUsername = credentials.username === process.env.ADMIN_USERNAME;
          const isValidPassword = credentials.password === process.env.ADMIN_PASSWORD;

          if (isValidUsername && isValidPassword) {
            console.log("Admin login successful");
            return {
              id: "admin",
              name: "Admin",
              email: "admin@example.com",
              role: "ADMIN",
            };
          }

          console.log("Invalid admin credentials");
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "user-credentials",
      name: "User Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Check if credentials exist
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing user credentials");
            return null;
          }

          // Use our verifyUserCredentials function that uses server components
          const result = await verifyUserCredentials({
            email: credentials.email,
            password: credentials.password,
          });

          if (!result.success) {
            console.log(result.message);
            return null;
          }

          // Look up the user to get their details
          const user = await findUserByEmail(credentials.email);

          if (!user) {
            console.log("User not found after verification");
            return null;
          }

          console.log("User login successful");
          return {
            id: user.id,
            email: user.email,
            name: user.firstName || user.email.split("@")[0], // Use firstName if available
            role: "USER",
          };
        } catch (error) {
          console.error("User auth error:", error);
          return null;
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/auth/zaloguj", // Default sign-in page for users
    error: "/auth/error",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // Add the user's role to the token
      if (user) {
        console.log("Setting JWT with user role:", user.role);
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Add the user's role to the session
      if (token && session.user) {
        console.log("Setting session with role:", token.role);
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-do-not-use-in-production",
};
