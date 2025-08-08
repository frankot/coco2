import { NextResponse } from "next/server";
import { createRouteHandler, ApiError } from "@/lib/api";
import { ApaczkaServiceResponse, ApaczkaError, ApaczkaService } from "@/types/apaczka";

// Remove trailing slash as it might cause issues
const APACZKA_API_URL = "https://www.apaczka.pl/api/v2";
const APACZKA_APP_ID = process.env.APACZKA_APP_ID?.replace(/"/g, "") || "";
const APACZKA_APP_SECRET = process.env.APACZKA_APP_SECRET?.replace(/"/g, "") || "";

// Exactly matching the PHP example from documentation
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

  const filteredServices = response.response.services.filter((service: ApaczkaService) => {
    // Only get DPD Kurier and InPost Kurier services
    const isDPDKurier = service.name === "DPD Kurier" && service.service_id === "21";
    const isInPostKurier = service.name === "InPost Kurier" && service.service_id === "42";

    return (isDPDKurier || isInPostKurier) && service.door_to_door === "1";
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
