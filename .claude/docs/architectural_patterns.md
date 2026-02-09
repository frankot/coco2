# Architectural Patterns

Recurring patterns and design decisions used throughout the codebase.

## 1. Server Actions for Mutations

All data mutations use Next.js server actions (`"use server"`) that receive `FormData`, validate with Zod, and return typed `FormState` objects.

- `src/app/admin/_actions/products.ts:44-137` — addProduct validates, uploads images, redirects
- `src/app/admin/_actions/blog.ts:14-71` — addBlogPost validates, generates unique slug
- `src/app/admin/_actions/clients.ts:67-124` — addClient validates, hashes password
- `src/app/(customFacing)/kasa/_actions.ts:56-378` — createOrder: full atomic checkout flow

Convention: action files live in `_actions/` directories or `_actions.ts` files colocated with the feature.

## 2. Higher-Order API Route Handler

`src/lib/api.ts:33-69` exports `createRouteHandler()` — a factory that wraps API routes with consistent error handling, optional auth, and JSON response formatting. Throws `ApiError` (`src/lib/api.ts:6-14`) for typed HTTP errors.

- `src/app/api/products/route.ts:1-9` — public endpoint, no auth
- `src/app/api/admin/orders/route.ts` — admin-only endpoint
- `src/app/api/payments/stripe/webhook/route.ts:1-32` — webhook with custom validation

## 3. useActionState for Form Submission

Client components use React's `useActionState` hook to manage form submission state, loading indicators, and error display.

- `src/app/admin/produkty/_components/ProductForm.tsx:44-49`
- `src/app/admin/klienci/_components/ClientForm.tsx:28-33`
- `src/app/admin/blog/_components/BlogForm.tsx:27`

Forms wrap server actions in `customFormAction` functions to transform client state (PLN-to-cents conversion, JSON serialization, file handling) before submission.

## 4. Server/Client Component Split

Data-fetching components are server components that query Prisma directly. Interactive components are marked `"use client"` and receive data as props.

- `src/app/(customFacing)/components/Hero.tsx:1-32` — server: fetches products
- `src/app/(customFacing)/components/HeroClient.tsx:60-217` — client: carousel + animations

## 5. Dynamic Imports for Heavy Dependencies

SSR-incompatible or large dependencies loaded via `next/dynamic` with `ssr: false`.

- `src/app/admin/produkty/_components/ProductForm.tsx:14-18` — MDEditor
- `src/app/admin/blog/_components/BlogForm.tsx:12-16` — MDEditor
- `src/app/(customFacing)/kasa/page.tsx:127-217` — Apaczka shipping widget (DOM script injection)

## 6. Zod Schema Validation with Typed Errors

All server actions validate with `safeParse` (non-throwing). Errors are flattened to `{ fieldName: string[] }` and returned as `FormState`. Error messages are in Polish.

- `src/app/admin/_actions/products.ts:22-30` — product schema
- `src/app/admin/_actions/clients.ts:23-50` — client schema with conditional edit variant
- `src/app/(customFacing)/kasa/_actions.ts:27-52` — order schema with nested cart items

Types are derived with `z.infer<typeof schema>` to keep schemas as single source of truth (`src/app/(customFacing)/kasa/_actions.ts:54`).

## 7. Dual Auth Providers (Admin + User)

NextAuth configured with two `CredentialsProvider` instances:

- `src/lib/auth.ts:11-52` — `admin-credentials`: validates against env vars (`ADMIN_USERNAME`, `ADMIN_PASSWORD`)
- `src/lib/auth.ts:53-100` — `user-credentials`: validates against database with bcrypt

JWT callbacks enrich tokens with `role` and `accountType` (`src/lib/auth.ts:107-127`). Session types extended via module augmentation (`src/types/next-auth.d.ts:4-26`).

## 8. Middleware Route Protection

`src/middleware.ts:5-47` uses `withAuth` to check JWT tokens. Admin routes redirect unauthenticated users to `/admin/login`. Role checked via `token.role`. Matcher config at `src/middleware.ts:50-58`.

## 9. Predefined Prisma Selects

`src/lib/selects.ts:1-56` centralizes `select`/`include` objects (`PRODUCT_LIST_SELECT`, `CLIENT_LIST_SELECT`, `ORDER_LIST_SELECT`, `ORDER_DETAIL_INCLUDE`) to avoid overfetching and ensure consistent return shapes across queries.

## 10. NEXT_REDIRECT Error Handling

Server actions that call `redirect()` must catch and rethrow the `NEXT_REDIRECT` error to prevent it from being swallowed by generic catch blocks.

- `src/app/admin/_actions/products.ts:125-127`
- `src/app/admin/_actions/clients.ts:110-113`

Pattern:
```
catch (error) {
  if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) throw error;
  return { error: { _form: ["..."] } };
}
```

## 11. localStorage Cart State

Cart managed entirely client-side via localStorage with a custom `useCart` hook pattern inside `src/app/(customFacing)/components/Cart.tsx:506-607`. Cart component is heavily memoized with sub-components (`CartOverlay`, `CartHeader`, `CartContent`, `CartFooter`) and `useCallback` handlers to prevent re-renders during animations.

## 12. Prisma Client in Custom Location

Generator outputs to `src/app/generated/prisma` instead of `node_modules` (`prisma/schema.prisma:1-4`). Singleton client created in `src/db/index.ts:1-4`. All imports use `@/app/generated/prisma` or `@/db`.

## 13. Atomic Order Creation

Checkout uses Prisma nested creates for atomic order + orderItems + payment creation in a single implicit transaction (`src/app/(customFacing)/kasa/_actions.ts:235-265`). Explicit `$transaction` used for webhook-triggered updates (`src/app/api/payments/stripe/webhook/route.ts:23-29`).

## 14. Guest User Creation on Checkout

Guest checkout creates or updates a user record without password, enabling order association (`src/app/(customFacing)/kasa/_actions.ts:122-143`). Bridges guest and authenticated flows.

## 15. Framer Motion Animations

Declarative animations with `AnimatePresence` for mount/unmount transitions, primarily in the cart component.

- `src/app/(customFacing)/components/Cart.tsx:68-85` — overlay fade
- `src/app/(customFacing)/components/Cart.tsx:99-117` — floating button with spring physics
- `src/app/(customFacing)/components/Cart.tsx:336-354` — side panel slide-in
