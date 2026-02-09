# CLAUDE.md — coco2

## Project Overview

Polish-language e-commerce application for a food/confectionery brand. Features a customer-facing storefront, admin dashboard, blog, integrated payments (Stripe), and shipping (Apaczka). Currency is PLN; prices stored in cents internally.

## Tech Stack

- **Framework:** Next.js (App Router) with TypeScript
- **Database:** PostgreSQL via Prisma ORM (client generated to `src/app/generated/prisma`)
- **Auth:** NextAuth with dual credential providers (admin via env vars, users via DB + bcrypt)
- **Payments:** Stripe (checkout sessions + webhooks)
- **Shipping:** Apaczka API integration
- **Styling:** Tailwind CSS + shadcn/ui (Radix primitives) + Framer Motion
- **Images:** Cloudinary
- **Email:** Custom mailer (`src/lib/mailer.ts`)
- **Markdown:** MDEditor (dynamically imported) for product/blog content

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run Next.js linter |
| `npm run format` | Prettier formatting |
| `npx prisma generate` | Regenerate Prisma client (also runs on `postinstall`) |
| `npx prisma db push` | Push schema changes to database |
| `npx prisma studio` | Open Prisma database GUI |
| `npm run seed:blog` | Seed blog posts (`tsx prisma/seed-blog.ts`) |

## Key Directories

```
src/
  app/
    (customFacing)/          Customer storefront (route group)
      components/            Storefront components (Cart, Hero, Navbar, etc.)
      sklep/                 Product listing + detail pages
      kasa/                  Checkout flow + _actions.ts
      blog/, kontakt/, o-nas/, regulamin/
      uzytkownik/            User account + order history
    admin/                   Admin dashboard
      _actions/              Server actions: products.ts, clients.ts, blog.ts, dashboard.ts
      produkty/, klienci/, zamowienia/, blog/   CRUD pages
    api/                     API routes (26 endpoints)
      admin/                 Admin-only APIs
      auth/                  NextAuth + registration + password reset
      payments/stripe/       Checkout sessions, verification, webhooks
      shipping/apaczka/      Shipping rate + point resolution
      products/, user/       Public product + user profile APIs
    auth/                    Auth pages (signin, register, forgot, reset)
    generated/prisma/        Generated Prisma client (do not edit)
  components/ui/             shadcn/ui components (24 files)
  lib/                       Shared utilities
    api.ts                   createRouteHandler() factory + ApiError class
    auth.ts                  NextAuth config (dual providers, JWT callbacks)
    auth-utils.ts            Password hashing, user creation helpers
    selects.ts               Reusable Prisma select/include objects
    stripe.ts, apaczka.ts, cloudinary.ts, mailer.ts   Service integrations
  db/index.ts                Prisma client singleton
  types/                     Type declarations (next-auth.d.ts, apaczka.ts)
  providers/                 React context providers
  middleware.ts              Route protection (admin role check + redirects)
prisma/
  schema.prisma              Database schema (7 models, 5 enums)
```

## Database Models

Defined in `prisma/schema.prisma`: **Product**, **BlogPost**, **User** (with AccountType enum: ADMIN/DETAL/HURT), **Address**, **Order** (with OrderStatus, PaymentMethod), **OrderItem**, **Payment** (with PaymentStatus).

Prices are stored as integers in cents (`priceInCents`, `pricePaidInCents`). Product `composition` is a JSON field. Images referenced by Cloudinary paths/public IDs.

## Critical Conventions

- **Server actions** handle all mutations — defined in `_actions/` dirs, validated with Zod, return typed `FormState` objects
- **API routes** use `createRouteHandler()` from `src/lib/api.ts` for consistent error handling and auth
- **NEXT_REDIRECT errors** must be rethrown in catch blocks (see `src/app/admin/_actions/products.ts:125-127`)
- **Prisma imports** come from `@/app/generated/prisma` (not `@prisma/client`) and client from `@/db`
- **Polish language** used in all user-facing text, URLs (sklep, kasa, zamowienia, klienci, produkty), and Zod error messages
- **Price display** requires PLN-to-cents conversion in forms (see `ProductForm.tsx:88-131`)

## Additional Documentation

Check these files when working on relevant areas:

| File | Topics |
|------|--------|
| `.claude/docs/architectural_patterns.md` | Server actions, API handler factory, auth flow, Zod validation, cart state, Prisma patterns, form handling, animations |
| `.claude/docs/code_review.md` | Pre-production review: 6 CRITICAL, 15 HIGH, 12 MEDIUM findings — security vulns, data integrity, business logic issues |
