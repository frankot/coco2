/**
 * Get the origin URL for the application.
 * Explicit env vars (NEXT_PUBLIC_APP_URL / NEXT_PUBLIC_URL) take priority
 * over Vercel's auto-set VERCEL_URL, which points to a per-deployment URL.
 */
export function getOrigin(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL.replace(/\/$/, "");
  }

  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, "");
  }

  // Vercel's auto-set URL (per-deployment, not the main domain)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
