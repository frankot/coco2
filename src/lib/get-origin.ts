/**
 * Get the origin URL for the application.
 * Handles Vercel deployment, environment variables, and fallbacks.
 */
export function getOrigin(): string {
  // Vercel automatically sets VERCEL_URL in production deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Use explicitly set NEXT_PUBLIC_URL
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }

  // Fallback to NEXTAUTH_URL
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // Local development fallback
  return "http://localhost:3000";
}
