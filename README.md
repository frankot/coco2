This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Dr.Coco Ecommerce Website

## Instagram Integration

The website displays Instagram posts from the Dr.Coco account using a simplified approach with direct links to posts.

### How it works:

1. We maintain an array of Instagram post data in `src/app/(customFacing)/components/InstaCaru.tsx`
2. Each entry contains:
   - `id`: The unique post ID from Instagram
   - `imageUrl`: Path to a local image copy in `/public/insta/`
   - `postUrl`: Direct link to the Instagram post
   - `caption`: The post caption or description

### To add or update posts:

1. Save images from Instagram posts to the `/public/insta/` directory

   - Name them sequentially as `post1.jpg`, `post2.jpg`, etc.
   - Make sure the images are properly optimized for web use

2. Update the `INSTAGRAM_POSTS` array in `InstaCaru.tsx` with:
   - The correct post ID from the Instagram URL
   - The right image path
   - The full Instagram post URL
   - The post caption

Example:

```javascript
{
  id: "DJjJ0R_RRbv",
  imageUrl: "/insta/post1.jpg",
  postUrl: "https://www.instagram.com/p/DJjJ0R_RRbv/",
  caption: "Orzeźwienie w czystej postaci! 🥥 #DrCoco #WodaKokosowa"
}
```

This approach avoids the complexity of Instagram API authentication while still allowing you to showcase Instagram content on your site.

# Coco E-commerce

## Authentication System

The application uses a centralized authentication system with reusable utility functions. All authentication-related functionality is managed through the following files:

- `src/lib/auth.ts` - NextAuth.js configuration
- `src/lib/auth-utils.ts` - Reusable authentication utilities

### Auth Utilities

The `auth-utils.ts` file provides the following functions:

- `registerUser()` - Handles user registration with proper password hashing
- `createOrUpdateUser()` - Creates a new user or updates an existing one (used in checkout)
- `verifyUserCredentials()` - Validates user login credentials

### Usage

These functions are used throughout the application:

1. During registration: `/auth/rejestracja` uses `registerUser()`
2. During checkout: The checkout flow uses `createOrUpdateUser()` to handle guest checkouts
3. During login: NextAuth.js uses `verifyUserCredentials()` for authentication

### Type Safety

All functions use Zod schemas for validation:

- `userRegistrationSchema` - Validates registration data
- `userLoginSchema` - Validates login credentials
