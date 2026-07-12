import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

type Limiter = { limit: (key: string) => Promise<{ success: boolean; reset?: number }> };

const noopLimiter: Limiter = {
  limit: async () => ({ success: true }),
};

function makeLimiter(prefix: string, max: number, windowSec: number): Limiter {
  if (!url || !token) return noopLimiter;
  const redis = new Redis({ url, token });
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, `${windowSec} s`),
    prefix,
    analytics: false,
  });
}

export const loginLimiter = makeLimiter("rl:login", 5, 15 * 60);
export const forgotIpLimiter = makeLimiter("rl:forgot:ip", 5, 15 * 60);
export const forgotEmailLimiter = makeLimiter("rl:forgot:email", 3, 60 * 60);
export const resetLimiter = makeLimiter("rl:reset", 10, 15 * 60);
export const registerLimiter = makeLimiter("rl:register", 5, 60 * 60);
export const apaczkaLimiter = makeLimiter("rl:apaczka", 20, 60);
export const availabilityNotificationIpLimiter = makeLimiter("rl:availability:ip", 5, 10 * 60);
export const availabilityNotificationEmailLimiter = makeLimiter("rl:availability:email", 5, 10 * 60);
export const availabilityNotificationProductLimiter = makeLimiter("rl:availability:product", 20, 10 * 60);

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xrip = req.headers.get("x-real-ip");
  if (xrip) return xrip.trim();
  return "unknown";
}
