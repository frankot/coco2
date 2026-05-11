import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Static redirects — edge-level, zero DB overhead
const STATIC_REDIRECTS: Record<string, string> = {
  "/produkty": "/sklep",
  "/koszyk": "/sklep",
  "/zamowienie": "/kasa",
  "/moje-konto": "/uzytkownik",
  "/polityka-cookies": "/cookies",
  "/polityka-prywatnosci": "/privacy",
  "/story": "/nasza-historia",
  "/kup-dr-coco": "/",
  "/sitemap.html": "/sitemap.xml",
};

// WordPress-origin paths → block entirely
const WP_BLOCK_PREFIXES = [
  "/wp-",
  "/author/",
  "/tag/",
  "/comments/",
];

function isWpBlock(path: string): boolean {
  return WP_BLOCK_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Normalize: strip trailing slash except root
  const normalizedPath =
    pathname === "/" ? "/" : pathname.replace(/\/$/, "");

  // 1. Block WP paths — 410 Gone
  if (isWpBlock(normalizedPath)) {
    return new NextResponse(null, { status: 410 });
  }

  // 2. Static redirects — 301
  if (STATIC_REDIRECTS[normalizedPath]) {
    return NextResponse.redirect(
      new URL(STATIC_REDIRECTS[normalizedPath], request.url),
      { status: 301 }
    );
  }

  // 3. Dynamic redirects — /artykuly/* and /produkt/*
  if (
    normalizedPath.startsWith("/artykuly/") ||
    normalizedPath.startsWith("/produkt/")
  ) {
    try {
      const { default: prisma } = await import("@/db");
      const mapping = await prisma.redirectMap.findUnique({
        where: { oldPath: normalizedPath },
        select: { newPath: true, redirectType: true },
      });

      if (mapping) {
        if (mapping.redirectType === "410") {
          return new NextResponse(null, { status: 410 });
        }
        return NextResponse.redirect(
          new URL(mapping.newPath, request.url),
          { status: 301 }
        );
      }

      // Fallback: unknown old URL → listing page
      const fallback = normalizedPath.startsWith("/artykuly/")
        ? "/blog"
        : "/sklep";
      return NextResponse.redirect(new URL(fallback, request.url), {
        status: 301,
      });
    } catch {
      // DB unavailable — let Next.js 404 handle it
      return NextResponse.next();
    }
  }

  // 4. Trailing slash cleanup: /path/ → /path (except root)
  if (pathname !== "/" && pathname.endsWith("/")) {
    return NextResponse.redirect(new URL(normalizedPath, request.url), {
      status: 301,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|logo\\.png|og-image\\.webp|apple-touch-icon\\.png|.*\\..*).*)",
  ],
};
