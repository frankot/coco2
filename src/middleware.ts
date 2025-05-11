import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Check if logout is requested
  const url = new URL(req.url);
  if (url.searchParams.has("logout")) {
    // Force reauthentication by returning 401
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }
  
  if ((await isAuthenticated(req)) === false) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }
}

async function isAuthenticated(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return false;
  }
  
  try {
    const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
    return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
  } catch (error) {
    // Handle malformed authorization header
    return false;
  }
}

export const config = {
  matcher: "/admin/:path*",
};
