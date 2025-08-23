# Copilot Instructions for coco2

## Project Overview
- This is a Next.js e-commerce site (Dr.Coco) using Tailwind CSS, Prisma ORM, and shadcn/ui components. The tech stack also includes lucide-react for icons.
- The codebase is organized by major app sections under `src/app/`, with custom-facing and admin-facing layouts and components.
- Instagram integration is handled via local images and metadata in `src/app/(customFacing)/components/InstaCaru.tsx` (no API calls).

## Key Patterns & Conventions
- **Authentication:** Centralized in `src/lib/auth.ts` (NextAuth.js config) and `src/lib/auth-utils.ts` (utility functions). All registration, login, and guest checkout logic uses these utilities. Zod schemas enforce type safety.
- **Component Structure:** UI components are in `src/components/ui/` and are based on shadcn/ui. Use shadcn/ui for new UI elements and download missing components as needed.
- **Instagram Posts:** To update Instagram content, add images to `/public/insta/` and update the `INSTAGRAM_POSTS` array in `InstaCaru.tsx`.
- **Admin Features:** Admin pages and actions are under `src/app/admin/`. Data management and cleaning scripts are in `src/app/admin/clean-db/`.
- **Prisma:** Database schema is in `prisma/schema.prisma`. Migrations are managed in `prisma/migrations/`. Use Prisma migrate/dev commands for schema changes.

## Developer Workflows
- **Start Dev Server:** Use `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`).
- **Database Migrations:** Use Prisma CLI (`npx prisma migrate dev`) after editing `schema.prisma`.
- **Type Safety:** All API and auth logic uses Zod schemas for validation.
- **UI:** Prefer shadcn/ui components. Download missing ones if needed.
- **Icons:** Use lucide-react for icons.

## Integration Points
- **Instagram:** No API integration; all data/images are local.
- **Auth:** NextAuth.js for authentication, with custom utilities for registration and login.
- **Database:** Prisma ORM, migrations in `prisma/migrations/`.

## Examples
- To add an Instagram post:
  1. Save image to `/public/insta/`
  2. Add entry to `INSTAGRAM_POSTS` in `InstaCaru.tsx`
- To add a new UI component:
  1. Use shadcn/ui pattern from `src/components/ui/`
  2. Download missing shadcn/ui components if not present
- To update authentication logic:
  1. Edit `src/lib/auth-utils.ts` and update Zod schemas as needed

## References
- `src/app/(customFacing)/components/InstaCaru.tsx` (Instagram logic)
- `src/lib/auth.ts`, `src/lib/auth-utils.ts` (Auth logic)
- `src/components/ui/` (UI components)
- `prisma/schema.prisma` (DB schema)
- `prisma/migrations/` (DB migrations)

---
For terse answers, avoid running `npm run dev` unless explicitly requested. Follow the project's conventions for tech stack and component usage.
