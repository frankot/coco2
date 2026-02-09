# Pre-Production Code Review

**Date:** 2026-02-09
**Verdict: NOT READY FOR PRODUCTION**

**6 CRITICAL, 15 HIGH, 12 MEDIUM, 3 LOW** findings. The most dangerous issues are direct revenue loss vectors and authentication bypasses.

---

## CRITICAL Findings (fix before ANY public traffic)

### S-1: Weak `NEXTAUTH_SECRET`
`.env` — `NEXTAUTH_SECRET` is set to `supersecretkeyyoushouldchangethis`. Anyone who guesses this can forge JWT tokens and gain full admin access.
**Fix:** `openssl rand -base64 32` and rotate all secrets.

### S-2: Password reset secret falls back to literal `"secret"`
`src/app/api/auth/forgot/route.ts:18`, `src/app/api/auth/reset/route.ts:12` — if env var is unset, the fallback is `"secret"`. Full account takeover for every user.
**Fix:** Remove the fallback. Throw if env var is missing.

### S-3: Stored XSS via `rehype-raw`
`src/app/(customFacing)/blog/[slug]/page.tsx:9` — blog markdown rendered with `rehype-raw` allows arbitrary HTML/JS execution.
**Fix:** Add `rehype-sanitize` after `rehype-raw`, or remove `rehype-raw`.

### S-4: Payment verification bypass
`src/app/api/payments/stripe/verify-session/route.ts:6-41` — unauthenticated endpoint accepts any `{sessionId, orderId}` without verifying the session actually belongs to that order. Attacker creates a 1 PLN Stripe session, passes it with a victim's `orderId`.
**Fix:** Verify `session.metadata.orderId === orderId` before updating.

### D-1: Orders use client-provided prices
`src/app/(customFacing)/kasa/_actions.ts:101-104` — `priceInCents` comes from localStorage. For COD orders (no Stripe), a user can edit localStorage and pay whatever they want.
**Fix:** Fetch product prices from the database server-side. Never trust client prices.

### B-1: COD orders marked PAID immediately
`src/app/(customFacing)/kasa/_actions.ts:276-286` — Cash-on-delivery orders are set to `PAID` with `payment.status: "COMPLETED"` before any money changes hands. No way to track unpaid COD orders.
**Fix:** Leave COD as `PENDING` until delivery confirmation.

---

## HIGH Findings

### S-5: CORS wildcard with credentials
`next.config.ts:47` — `Access-Control-Allow-Origin: *` with `Access-Control-Allow-Credentials: true` on auth routes.
**Fix:** Set origin to the specific production domain or remove CORS headers (same-origin app).

### S-6: Middleware doesn't protect `/api/admin/*` routes
`middleware.ts:50-58` — matcher only covers `/admin/:path*` (pages). API routes under `/api/admin/*` rely solely on `createRouteHandler` auth.
**Fix:** Add `"/api/admin/:path*"` to the middleware matcher as defense-in-depth.

### S-7: No rate limiting on auth endpoints
`src/app/api/auth/rejestracja/route.ts`, `src/app/api/auth/forgot/route.ts`, `src/app/api/auth/reset/route.ts`, `src/lib/auth.ts` — zero rate limiting on login, registration, password reset.
**Fix:** Add rate limiting (e.g., `@upstash/ratelimit`). Limit login to 5 attempts/minute/IP.

### S-8: No password validation on reset
`src/app/api/auth/reset/route.ts:9` — no minimum password length check. Users can reset to a 1-character password.
**Fix:** Apply the same `z.string().min(6)` validation as in `userRegistrationSchema`.

### S-9: Unauthenticated Apaczka proxy
`src/app/api/shipping/apaczka/resolve/route.ts:6` — calls Apaczka API with your credentials but has `auth: "none"`. Anyone can exhaust your API quota.
**Fix:** Add `{ auth: "user" }` at minimum.

### D-2: No transaction on order creation
`src/app/(customFacing)/kasa/_actions.ts:56-378` — 6 sequential DB operations (check products, create user, create address, create order, update status, create payment) with no `$transaction`. Partial failures leave orphaned data.
**Fix:** Wrap the entire sequence in `prisma.$transaction()`.

### D-3: Multiple PrismaClient instances
6+ files instantiate `new PrismaClient()` instead of using the singleton from `@/db`:
- `src/lib/auth.ts:9`
- `src/lib/auth-utils.ts:11`
- `src/lib/auth-server.ts:6`
- `src/app/(customFacing)/kasa/_actions.ts:11`
- `src/app/(customFacing)/kasa/zlozone-zamowienie/[orderId]/page.tsx:9`
- `src/app/admin/_actions/dashboard.ts:8`

**Fix:** Use `import prisma from "@/db"` everywhere. Remove all other `new PrismaClient()`.

### D-4: Missing database indexes
`prisma/schema.prisma` — no indexes on frequently queried fields:
- `Order.userId`, `Order.status`, `Order.apaczkaOrderId`
- `Address.userId`, `Payment.orderId`

**Fix:** Add `@@index` directives to the schema.

### E-1: useRouter() inside event handler
`src/app/admin/zamowienia/[id]/page.tsx:119` — `useRouter()` called inside a callback, violating Rules of Hooks. Crashes when cancelling orders.
**Fix:** Use the existing `router` reference from line 77.

### E-2: No webhook idempotency
`src/app/api/payments/stripe/webhook/route.ts:18` — Stripe may deliver `checkout.session.completed` multiple times. No duplicate check.
**Fix:** Check `payment.status !== "COMPLETED"` before processing.

### T-1: 152+ uses of `any` type
Multiple files. Most dangerous:
- `src/app/api/admin/orders/[id]/route.ts:22` — `readJson<any>(req)` passed directly to DB
- `src/app/api/payments/stripe/webhook/route.ts:19` — `event.data.object as any`
- `src/app/api/payments/stripe/verify-session/route.ts:40` — `status: "PAID" as any`

**Fix:** Replace with proper types and Zod validation.

### B-2: No order status transition validation
`src/app/api/admin/orders/[id]/route.ts:19-31` — admin can set any status to any other (DELIVERED->PENDING, CANCELLED->SHIPPED).
**Fix:** Implement a state machine for valid transitions.

### B-3: Unauthenticated order confirmation page
`src/app/(customFacing)/kasa/zlozone-zamowienie/[orderId]/page.tsx` — anyone with a UUID sees full order details including products, prices, and the payment verification component.
**Fix:** Require authentication or use a separate order access token.

### PR-1: PII in server-side logs
158 console.log statements across 44 files. Server-side logs include:
- `src/lib/auth-server.ts:24` — `console.log("Looking up user by email:", email)`
- `src/lib/auth-server.ts:36` — leaks user IDs
- `src/app/(customFacing)/kasa/_actions.ts:58` — logs full order data (email, name, address)

**Fix:** Use a proper logging library with log levels. Remove PII from logs.

### PR-2: `clean-db` page accessible in production
`src/app/admin/clean-db/page.tsx` — one click wipes all products and orders. Only protected by admin auth.
**Fix:** Gate behind `NODE_ENV === "development"` or add additional confirmation.

---

## MEDIUM Findings

### S-10: `eval("require")` pattern
`src/lib/mailer.ts:5`, `src/app/(customFacing)/kasa/_actions.ts:354`, `src/app/api/admin/shipping/apaczka/confirm/route.ts:322`, `src/app/api/admin/shipping/apaczka/confirm-all/route.ts:325`
**Fix:** Use dynamic `import()` or conditional `require` without `eval`.

### S-11: Reusable password reset tokens
`src/app/api/auth/reset/route.ts` — JWT-based token has 1-hour expiry but is not invalidated after use. Same token can reset password repeatedly.
**Fix:** Store token hash in DB and mark as used after first reset.

### D-5: Delete operations not in transaction
`src/app/admin/_actions/clean-db.ts:84-95` — `payment.deleteMany()`, `orderItem.deleteMany()`, `order.deleteMany()` run sequentially without `$transaction`.
**Fix:** Wrap in `prisma.$transaction()`.

### D-6: No max quantity on cart items
`src/app/(customFacing)/kasa/_actions.ts:46` — Zod only checks `min(1)`. User can submit quantity of 999999.
**Fix:** Add `.max(1000)` or a reasonable business limit.

### E-3: TypeScript errors silenced
`next.config.ts:29` — `ignoreBuildErrors: true`. Production builds succeed even with type errors.
**Fix:** Set to `false` and fix all type errors.

### E-4: Wrong field name in Cloudinary cleanup
`src/app/admin/_actions/clean-db.ts:18` — selects `imagePublicId` (singular) but schema has `imagePublicIds` (plural array). Cloudinary images never get deleted.
**Fix:** Change to `imagePublicIds: true` and iterate over the array.

### P-2: Hardcoded shipping cost
`src/app/(customFacing)/kasa/_actions.ts:108`, `src/app/(customFacing)/kasa/page.tsx:651` — all shipping is 15 PLN regardless of carrier/destination/weight.
**Fix:** Call `Apaczka.orderValuation()` for real shipping costs.

### PR-3: No health check endpoint
No `/api/health` for load balancer probes or uptime monitoring.
**Fix:** Add a simple health check route that verifies DB connectivity.

### PR-4: No CSRF protection on custom POST routes
Custom API routes (registration, forgot password, reset, shipping resolve) have no CSRF protection. Server actions have built-in protection, but API routes do not.

### B-4: Client-only hardcoded discount code
`src/app/(customFacing)/components/Cart.tsx:436` — `COCO10` is visible in source code and the 10% discount is **not applied server-side**. Users see the discount but pay full price.
**Fix:** Implement discount codes server-side or remove the feature.

### B-5: Stripe/order price divergence
Stripe session fetches prices from DB, but the order record uses client-provided prices. If a product price changes between the two calls, amounts diverge.
**Fix:** Use the same DB-fetched prices for both order record and Stripe session.

### T-2: No validation on admin order PATCH
`src/app/api/admin/orders/[id]/route.ts:22` — raw `body.status` passed directly to Prisma with no Zod validation.
**Fix:** Validate against the `OrderStatus` enum with Zod.

---

## LOW Findings

### P-3: localStorage as price source of truth
`src/app/(customFacing)/components/Cart.tsx:507-527` — cart items including `priceInCents` read from localStorage and trusted. Root cause of D-1.

### B-6: No max quantity in UI
`src/app/(customFacing)/kasa/page.tsx:633-646` — `updateQuantity` allows incrementing to any number. No stock tracking.

### P-1: N+1 sequential Cloudinary calls
`src/app/admin/_actions/clean-db.ts:35-45` — each product image deleted sequentially. 100 products = 300+ sequential HTTP calls.
**Fix:** Use `Promise.all` with concurrency limiting.

---

## Top 5 Priorities (ordered by business impact)

1. **Fix price trust issue (D-1)** — Active revenue loss. Fetch prices from DB, never from client.
2. **Fix payment verification (S-4)** — Block the free-order exploit.
3. **Rotate secrets (S-1, S-2)** — Generate real `NEXTAUTH_SECRET`, remove `"secret"` fallback.
4. **Consolidate PrismaClient (D-3)** — Use `import prisma from "@/db"` everywhere. Will cause outages under load.
5. **Wrap checkout in `$transaction` (D-2)** — Prevent orphaned orders/payments on partial failures.


## UPDATE
Summary of Changes

  1. D-1: Price trust (CRITICAL)

  src/app/(customFacing)/kasa/_actions.ts — Subtotal and orderItems.pricePerItemInCents now use productMap.get(item.id)!.priceInCents
  from the database instead of client-provided item.priceInCents. COD price manipulation is no longer possible.

  2. S-4: Payment verification bypass (CRITICAL)

  src/app/api/payments/stripe/verify-session/route.ts — Added session.metadata.orderId !== orderId check before updating payment status.
   An attacker can no longer use a cheap Stripe session to mark another order as paid.

  3. S-1/S-2: Secret fallbacks (CRITICAL)

  src/app/api/auth/forgot/route.ts and src/app/api/auth/reset/route.ts — Removed || "secret" fallback chain. Now throws ApiError with
  500 status if NEXTAUTH_SECRET is not set. You should also rotate your actual NEXTAUTH_SECRET to a random value (openssl rand -base64
  32).

  4. D-3: PrismaClient consolidation (HIGH)

  6 files fixed — All new PrismaClient() instances replaced with import prisma from "@/db". The singleton in src/db/index.ts now uses
  the globalThis caching pattern to prevent connection pool exhaustion during Next.js hot reload.

  5. D-2: Atomic transaction (HIGH)

  src/app/(customFacing)/kasa/_actions.ts — Address creation, order creation (with nested orderItems), and payment creation are now
  wrapped in a single prisma.$transaction(). If any step fails, everything rolls back. External API calls (Apaczka D2P resolution)
  remain outside the transaction.

  Note on B-1 (COD marked as PAID): I also fixed this as part of the transaction rewrite — COD orders now stay as PENDING with payment
  status PENDING, matching the real-world state where money hasn't been collected yet.
