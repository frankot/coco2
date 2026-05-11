# URL Migration Plan — drcoco.pl (old → new)

## Old Site Inventory (WordPress/WooCommerce)

Discovered via: `sitemap.xml`, `wp-json/wp/v2/pages`, `wp-json/wp/v2/posts`, `wp-json/wp/v2/product`

### Static Pages

| Old URL | Title | Priority | Traffic Risk |
|---------|-------|----------|-------------|
| `/` | Strona Główna | 1.0 | CRITICAL |
| `/produkty/` | Sklep (products archive) | 0.6 | HIGH |
| `/koszyk/` | Koszyk | 0.6 | LOW (cart) |
| `/zamowienie/` | Zamówienie (checkout) | 0.6 | LOW (checkout) |
| `/moje-konto/` | Moje konto | 0.6 | LOW (account) |
| `/regulamin/` | Regulamin | 0.6 | MEDIUM |
| `/polityka-cookies/` | Polityka cookies | 0.6 | MEDIUM |
| `/polityka-prywatnosci/` | Polityka prywatności | 0.6 | MEDIUM |
| `/story/` | Story / About | 0.6 | HIGH |
| `/kup-dr-coco/` | Kup Dr. Coco (duplicate of home) | — | MEDIUM |
| `/sitemap.html` | HTML sitemap | 0.5 | LOW |

### Blog Posts (artykuły)

| Old URL | Title | Priority |
|---------|-------|----------|
| `/artykuly/dr-coco-is-cruelty-free/` | Dr. Coco is CRUELTY FREE | 0.2 |
| `/artykuly/popularnosc-wody-kokosowej/` | Popularność wody kokosowej | 0.2 |

### Products (produkty)

| Old URL | Title | Priority |
|---------|-------|----------|
| `/produkt/dr-coco-330-ml/` | Dr. Coco 330 ml | 0.6 |
| `/produkt/dr-coco-280ml/` | Dr. Coco 280ml | 0.6 |

### Product Categories

| Old URL | Title |
|---------|-------|
| `/kategoria-produktu/bez-kategorii/` | Bez kategorii |

### WordPress-technical (block in robots)

- `/wp-json/*`, `/wp-content/*`, `/wp-admin/*` — no SEO value, let 404

---

## New Site Inventory (Next.js App Router)

### Static Pages (customer-facing)

| New URL | Page | Content |
|---------|------|---------|
| `/` | Homepage | Home |
| `/sklep` | Products listing | All products |
| `/sklep/[id]` | Product detail | Single product (by slug or ID) |
| `/blog` | Blog listing | All blog posts |
| `/blog/[slug]` | Blog post detail | Single blog post |
| `/kasa` | Checkout | Checkout flow |
| `/kasa/zlozone-zamowienie` | Order confirmation | After-purchase success page |
| `/kontakt` | Contact | Contact form |
| `/nasza-historia` | Our Story | Brand story |
| `/jakosc-smak` | Quality & Taste | Quality page |
| `/o-nas` | → redirects to `/nasza-historia` | (existing 301) |
| `/faq` | FAQ | Frequently asked questions |
| `/cookies` | Cookie Policy | Cookie information |
| `/privacy` | Privacy Policy | Privacy information |
| `/regulamin` | Terms & Conditions | Regulations |
| `/uzytkownik` | User Account | Order history, profile |
| `/rejestracja` | Registration | Sign-up page |
| `/auth/*` | Auth pages | Login, register, forgot, reset |

---

## URL Mapping: Old → New (301 Redirects)

### Rule 1: Identical URLs (keep as-is, no redirect needed)

| Old URL | New URL | Action |
|---------|---------|--------|
| `/regulamin/` | `/regulamin` | ✅ MATCH — no redirect needed |
| `/` | `/` | ✅ MATCH — same URL |

### Rule 2: Static Pages — Exact 301 Mapping

| # | Old URL | New URL | Type |
|---|---------|---------|------|
| 1 | `/produkty/` | `/sklep` | static |
| 2 | `/koszyk/` | `/sklep` | static (redirect to shop) |
| 3 | `/zamowienie/` | `/kasa` | static |
| 4 | `/moje-konto/` | `/uzytkownik` | static |
| 5 | `/polityka-cookies/` | `/cookies` | static |
| 6 | `/polityka-prywatnosci/` | `/privacy` | static |
| 7 | `/story/` | `/nasza-historia` | static |
| 8 | `/kup-dr-coco/` | `/` | static |
| 9 | `/sitemap.html` | `/sitemap.xml` | static |

### Rule 3: Dynamic Pages — Middleware 301 Mapping

Blog posts: `/artykuly/:slug` → `/blog/:new-slug`
Products: `/produkt/:slug` → `/sklep/:id-or-slug`

| # | Old URL | New URL | Type |
|---|---------|---------|------|
| B1 | `/artykuly/dr-coco-is-cruelty-free/` | `/blog/dr-coco-is-cruelty-free` | dynamic |
| B2 | `/artykuly/popularnosc-wody-kokosowej/` | `/blog/popularnosc-wody-kokosowej` | dynamic |
| P1 | `/produkt/dr-coco-330-ml/` | `/sklep/dr-coco-330-ml` (or DB slug) | dynamic |
| P2 | `/produkt/dr-coco-280ml/` | `/sklep/dr-coco-280ml` (or DB slug) | dynamic |

**Strategy:** Create a redirect map table + middleware that:
1. For blog posts: look up old WP slug → new DB slug in a `RedirectMap` table
2. For products: look up old WP slug → new DB slug in a `RedirectMap` table  
3. For unmatched old slugs: 301 to `/blog` (posts) or `/sklep` (products) as fallback

### Rule 4: WordPress-Origin URLs — Block/404

| Pattern | Action |
|---------|--------|
| `/wp-*` | 410 Gone or 404 |
| `/kategoria-produktu/*` | 301 → `/sklep` |
| `/author/*` | 410 Gone |
| `/tag/*` | 410 Gone |
| `/comments/*` | 410 Gone |

---

## Implementation Plan

### Phase 1: Database — Redirect Map Table

Add to `prisma/schema.prisma`:

```prisma
model RedirectMap {
  id          String   @id @default(uuid())
  oldPath     String   @unique   // e.g. "/artykuly/dr-coco-is-cruelty-free"
  newPath     String             // e.g. "/blog/dr-coco-is-cruelty-free"
  redirectType String  @default("301")  // 301 or 410
  createdAt   DateTime @default(now())

  @@index([oldPath])
}
```

Seed data for known mappings (store in `prisma/seed-redirects.ts`).

### Phase 2: Proxy Redirects

Create `src/proxy.ts` (Next.js 16+):

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Static redirects — handled at edge, zero DB overhead
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
  "/kategoria-produktu/bez-kategorii": "/sklep",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Normalize: strip trailing slash (except root)
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");

  // 1. Block WP paths
  if (normalizedPath.startsWith("/wp-")) {
    return new NextResponse(null, { status: 410 });
  }
  if (/^\/(author|tag|comments|kategoria-produktu)\//.test(normalizedPath)) {
    return new NextResponse(null, { status: 410 });
  }

  // 2. Static redirects
  if (STATIC_REDIRECTS[normalizedPath]) {
    return NextResponse.redirect(
      new URL(STATIC_REDIRECTS[normalizedPath], request.url),
      { status: 301 }
    );
  }

  // 3. Dynamic redirects — /artykuly/* → /blog/* and /produkt/* → /sklep/*
  if (normalizedPath.startsWith("/artykuly/") || normalizedPath.startsWith("/produkt/")) {
    try {
      const prisma = (await import("@/db")).default;
      const mapping = await prisma.redirectMap.findUnique({
        where: { oldPath: normalizedPath },
      });
      
      if (mapping) {
        return NextResponse.redirect(
          new URL(mapping.newPath, request.url),
          { status: mapping.redirectType === "301" ? 301 : 410 as any }
        );
      }
      
      // Fallback: redirect to listing page
      const fallback = normalizedPath.startsWith("/artykuly/") ? "/blog" : "/sklep";
      return NextResponse.redirect(new URL(fallback, request.url), { status: 301 });
    } catch {
      // If DB query fails, pass through (let Next.js 404 handle it)
      return NextResponse.next();
    }
  }

  // 4. Trailing slash cleanup: redirect /path/ → /path (except root)
  if (pathname !== "/" && pathname.endsWith("/")) {
    return NextResponse.redirect(
      new URL(normalizedPath, request.url),
      { status: 301 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png|og-image.webp).*)"],
};
```

### Phase 3: next.config.js — Remove Old Redirect

Remove the existing `/o-nas` → `/nasza-historia` redirect from `next.config.ts` since middleware will handle this pattern.

### Phase 4: Canonical URLs — Audit All Pages

Each page MUST have `<link rel="canonical" href="https://drcoco.pl/...">`. 

**Already done in root layout:** `metadata.alternates.canonical` set for homepage.

**Action needed — add to dynamic pages:**

| Page | Canonical | How |
|------|-----------|-----|
| `/sklep/[id]` | `https://drcoco.pl/sklep/{slug}` | `generateMetadata` in page.tsx |
| `/blog/[slug]` | `https://drcoco.pl/blog/{slug}` | `generateMetadata` in page.tsx |
| `/uzytkownik/[orderId]` | noindex (block in robots) | `robots: { index: false }` |
| `/kasa/*` | noindex (block in robots) | `robots: { index: false }` |
| `/auth/*` | noindex | `robots: { index: false }` |
| `/rejestracja` | noindex | `robots: { index: false }` |

### Phase 5: Sitemap — Only New URLs

Current `sitemap.ts` is already correct — outputs only new URLs. No changes needed.

### Phase 6: robots.txt — Verify

Current `robots.ts` is correct but add explicit 410 patterns:

```
Disallow: /admin/
Disallow: /api/
Disallow: /kasa/
Disallow: /uzytkownik/
Disallow: /auth/
Disallow: /rejestracja/
Disallow: /wp-*
```

### Phase 7: Post-Launch — Google Search Console

1. Submit new `sitemap.xml` in GSC
2. Use "Change of Address" tool if domain stays same
3. Monitor 404s in GSC → add missing redirects to `RedirectMap` table
4. Watch crawl stats for first 2 weeks

---

## Content Preservation Checklist

Blog posts that rank (both have content value):

| Old Post | New Post | Content Migrated? |
|----------|----------|-------------------|
| Dr. Coco is CRUELTY FREE | `/blog/dr-coco-is-cruelty-free` | ⬜ TODO |
| Popularność wody kokosowej | `/blog/popularnosc-wody-kokosowej` | ⬜ TODO |

**IMPORTANT:** These 2 articles have existing Google rankings (backlinks, indexed). Migrate their content to new blog posts with matching slugs — do NOT delete content that has traffic potential.

---

## Summary: Files to Create/Modify

| File | Action |
|------|--------|
| `prisma/schema.prisma` | Add `RedirectMap` model |
| `prisma/seed-redirects.ts` | NEW — seed redirect mappings |
| `src/proxy.ts` | NEW — redirect proxy (Next.js 16+) |
| `next.config.ts` | Remove old `/o-nas` redirect |
| `src/app/sitemap.ts` | Already correct, no changes |
| `src/app/robots.ts` | Add `wp-*` disallow |
| `src/app/(customFacing)/sklep/[id]/page.tsx` | Verify canonical in metadata |
| `src/app/(customFacing)/blog/[slug]/page.tsx` | Verify canonical in metadata |

### Redirect count: 11 static + 4 dynamic = 15 total
