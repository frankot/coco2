import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip middleware for auth paths to prevent redirect loops
  if (pathname.startsWith("/auth") || pathname === "/") {
    return NextResponse.next();
  }

  // Only apply to admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  console.log("Middleware checking auth for path:", pathname);

  // Get the NextAuth token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log(
    "Auth token:",
    token
      ? {
          role: token.role,
          name: token.name,
          authenticated: !!token,
        }
      : "No token"
  );

  // If the user is not authenticated or doesn't have the ADMIN role, redirect to sign-in
  if (!token || token.role !== "ADMIN") {
    console.log("Unauthorized access, redirecting to sign-in");

    // Create sign-in URL with the current path as callback URL
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", encodeURI(pathname));

    return NextResponse.redirect(signInUrl);
  }

  console.log("Access granted to admin area");
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*", "/"],
};
