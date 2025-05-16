import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const token = await getToken({ req: request });
    const isAuth = !!token;
    const isAdmin = token?.role === "ADMIN";
    const isAdminPanel = request.nextUrl.pathname.startsWith("/admin");
    const isAdminLogin = request.nextUrl.pathname === "/admin/login";

    // Allow access to admin login page
    if (isAdminLogin) {
      // Only redirect if already authenticated as admin
      if (isAuth && isAdmin) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Redirect unauthenticated users trying to access admin panel to admin login
    if (isAdminPanel && !isAuth) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Redirect authenticated non-admin users trying to access admin panel to home
    if (isAdminPanel && isAuth && !isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect user accessing login page when already authenticated
    if (request.nextUrl.pathname === "/auth/zaloguj" && isAuth) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Skip auth check for public paths
      authorized: () => true,
    },
  }
);

// Configure paths that require middleware processing
export const config = {
  matcher: [
    // Admin routes (excluding login)
    "/admin/:path*",
    // Auth routes
    "/auth/zaloguj",
    "/auth/rejestracja",
  ],
};
