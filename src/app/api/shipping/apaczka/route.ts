import { createRouteHandler, ApiError } from "@/lib/api";
import { ApaczkaServiceResponse, ApaczkaError, ApaczkaService } from "@/types/apaczka";


const APACZKA_API_URL = "https://www.apaczka.pl/api/v2";

// Robust credential sanitization - remove quotes, whitespace, newlines
function sanitizeCredential(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/["'\s\n\r]/g, "");
}

const APACZKA_APP_ID = sanitizeCredential(process.env.APACZKA_APP_ID);
const APACZKA_APP_SECRET = sanitizeCredential(process.env.APACZKA_APP_SECRET);

function stringToSign(appId: string, route: string, data: string, expires: number): string {
  return `${appId}:${route}:${data}:${expires}`;
}

function getSignature(string: string, key: string): string {
  const crypto = require("crypto");
  return crypto.createHmac("sha256", key).update(string).digest("hex");
}

// Filter for specific courier services
function filterCourierServices(response: ApaczkaServiceResponse): ApaczkaServiceResponse {
  if (!response.response?.services) {
    return response;
  }

  const allowedSuppliers = ["DPD", "INPOST", "DHL"];
  const filteredServices = response.response.services.filter((service: ApaczkaService) => {
    if (!allowedSuppliers.includes(service.supplier)) return false;
    // Keep if door-to-door or door-to-point is supported for that service
    const keep = service.door_to_door === "1" || service.door_to_point === "1";
    return keep;
  });

  return {
    ...response,
    response: {
      ...response.response,
      services: filteredServices,
    },
  };
}

export const GET = createRouteHandler(async () => {
  if (!APACZKA_APP_ID || !APACZKA_APP_SECRET) {
    console.error("Apaczka credentials missing or invalid:", {
      hasAppId: !!process.env.APACZKA_APP_ID,
      hasSecret: !!process.env.APACZKA_APP_SECRET,
      appIdLength: APACZKA_APP_ID.length,
      secretLength: APACZKA_APP_SECRET.length,
    });
    throw new ApiError("Missing Apaczka credentials", 500);
  }
  const expires = Math.floor(Date.now() / 1000) + 300;
  const route = "service_structure/";
  const requestBody = {};
  const data = JSON.stringify(requestBody);
  const stringToSignValue = stringToSign(APACZKA_APP_ID, route, data, expires);
  const signature = getSignature(stringToSignValue, APACZKA_APP_SECRET);
  const requestData = {
    app_id: APACZKA_APP_ID,
    request: data,
    expires: expires,
    signature: signature,
  };
  const url = `${APACZKA_API_URL}/${route}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "ApaczkaNextJSClient/1.0",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      app_id: requestData.app_id,
      request: requestData.request,
      expires: requestData.expires.toString(),
      signature: requestData.signature,
    }).toString(),
  });
  const responseText = await response.text();
  if (!response.ok) {
    try {
      const error = JSON.parse(responseText) as ApaczkaError;
      throw new ApiError(error.message || "API Error", error.status || response.status);
    } catch {
      throw new ApiError(`API Error: ${responseText.slice(0, 200)}...`, response.status);
    }
  }
  try {
    const result = JSON.parse(responseText) as ApaczkaServiceResponse;
    return filterCourierServices(result);
  } catch (parseError) {
    throw new ApiError("Invalid JSON response from Apaczka API", 500, {
      debug: responseText.slice(0, 200),
    });
  }
});
