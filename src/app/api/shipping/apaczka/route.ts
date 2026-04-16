import { createRouteHandler, ApiError } from "@/lib/api";
import Apaczka from "@/lib/apaczka";
import { apaczkaLimiter, getClientIp } from "@/lib/rate-limit";
import type { ApaczkaServiceResponse, ApaczkaService } from "@/types/apaczka";

// In-memory cache for service_structure (changes rarely)
let cachedResponse: { data: ApaczkaServiceResponse; expiresAt: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000;

function filterCourierServices(response: ApaczkaServiceResponse): ApaczkaServiceResponse {
  if (!response.response?.services) return response;

  const allowedSuppliers = ["DPD", "INPOST", "DHL"];
  const filteredServices = response.response.services.filter((service: ApaczkaService) => {
    if (!allowedSuppliers.includes(service.supplier)) return false;
    return service.door_to_door === "1" || service.door_to_point === "1";
  });

  return {
    ...response,
    response: {
      ...response.response,
      services: filteredServices,
    },
  };
}

export const GET = createRouteHandler(async ({ req }) => {
  const ip = getClientIp(req);
  const check = await apaczkaLimiter.limit(ip);
  if (!check.success) throw new ApiError("Za dużo prób, spróbuj później", 429);

  if (cachedResponse && cachedResponse.expiresAt > Date.now()) {
    return cachedResponse.data;
  }

  const result = await Apaczka.serviceStructure();
  const filtered = filterCourierServices(result as unknown as ApaczkaServiceResponse);

  cachedResponse = { data: filtered, expiresAt: Date.now() + CACHE_TTL_MS };

  return filtered;
});
