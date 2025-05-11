import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
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

          console.log("Verifying credentials for:", credentials.username);
          console.log("Expected admin:", process.env.ADMIN_USERNAME);

          // Check if credentials match the admin credentials in .env
          const isValidUsername = credentials.username === process.env.ADMIN_USERNAME;
          const isValidPassword = credentials.password === process.env.ADMIN_PASSWORD;

          console.log("Credentials valid?", { isValidUsername, isValidPassword });

          if (isValidUsername && isValidPassword) {
            console.log("Admin login successful");
            // Return a simple user object that will be stored in the JWT
            return {
              id: "admin",
              name: "Admin",
              email: "admin@example.com",
              role: "ADMIN",
            };
          }

          console.log("Invalid credentials");
          // Return null if credentials are invalid
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // Add the user's role to the token
      if (user) {
        console.log("Setting JWT with user role:", user.role);
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Add the user's role to the session
      if (token && session.user) {
        console.log("Setting session with role:", token.role);
        session.user.role = token.role;
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
