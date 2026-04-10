import prisma from "@/db";
import { createRouteHandler, readJson, ApiError } from "@/lib/api";

// Rate limiting
const attempts = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

function checkRateLimit(ip: string) {
  const now = Date.now();
  const timestamps = (attempts.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    throw new ApiError("Zbyt wiele prób. Spróbuj ponownie za chwilę.", 429);
  }
  timestamps.push(now);
  attempts.set(ip, timestamps);
}

export const POST = createRouteHandler(async ({ req }) => {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  checkRateLimit(ip);

  const { code, subtotalInCents } = await readJson<{
    code: string;
    subtotalInCents: number;
  }>(req);

  const normalizedCode = (code || "").trim().toUpperCase();
  if (!normalizedCode || normalizedCode.length < 3) {
    return { valid: false, error: "Nieprawidłowy kod rabatowy" };
  }

  const discountCode = await prisma.discountCode.findUnique({
    where: { code: normalizedCode },
  });

  // Generic error for all failure cases
  const genericError = { valid: false, error: "Nieprawidłowy kod rabatowy" };

  if (!discountCode) return genericError;
  if (!discountCode.isActive) return genericError;
  if (discountCode.isSingleUse && discountCode.usedCount > 0) return genericError;

  // Calculate discount
  let discountAmountInCents: number;
  if (discountCode.discountType === "PERCENTAGE") {
    discountAmountInCents = Math.floor(subtotalInCents * discountCode.discountAmount / 100);
  } else {
    discountAmountInCents = discountCode.discountAmount;
  }

  // Clamp: discount cannot exceed subtotal
  discountAmountInCents = Math.min(discountAmountInCents, subtotalInCents);

  return {
    valid: true,
    discountAmountInCents,
    discountType: discountCode.discountType,
    discountAmount: discountCode.discountAmount,
    label:
      discountCode.discountType === "PERCENTAGE"
        ? `${discountCode.discountAmount}%`
        : `${(discountCode.discountAmount / 100).toFixed(2)} PLN`,
  };
});
