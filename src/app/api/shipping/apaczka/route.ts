import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    if (!APACZKA_APP_ID || !APACZKA_APP_SECRET) {
      return NextResponse.json(
        { status: 500, message: "Missing Apaczka credentials" },
        { status: 500 }
      );
    }

    const expires = Math.floor(Date.now() / 1000) + 300; // 5 minutes from now
    const route = "service_structure/"; // Added trailing slash to match docs
    const requestBody = {};
    const data = JSON.stringify(requestBody);

    const stringToSignValue = stringToSign(APACZKA_APP_ID, route, data, expires);
    console.log("String to sign:", stringToSignValue);

    const signature = getSignature(stringToSignValue, APACZKA_APP_SECRET);
    console.log("Generated signature:", signature);

    // Structure the request exactly as shown in documentation
    const requestData = {
      app_id: APACZKA_APP_ID,
      request: data,
      expires: expires,
      signature: signature,
    };

    // Construct full URL with route
    const url = `${APACZKA_API_URL}/${route}`;
    console.log("Sending request to Apaczka:", {
      url,
      requestData,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "ApaczkaNextJSClient/1.0",
        Accept: "application/json",
      },
      // Convert all values to strings for URLSearchParams
      body: new URLSearchParams({
        app_id: requestData.app_id,
        request: requestData.request,
        expires: requestData.expires.toString(),
        signature: requestData.signature,
      }).toString(),
    });

    const responseText = await response.text();
    console.log("Apaczka API response:", responseText);

    if (!response.ok) {
      // Try to parse as JSON first
      try {
        const error = JSON.parse(responseText) as ApaczkaError;
        return NextResponse.json(error, { status: error.status || response.status });
      } catch {
        // If not JSON, return the text with the status
        return NextResponse.json(
          {
            status: response.status,
            message: `API Error: ${responseText.slice(0, 200)}...`,
          },
          { status: response.status }
        );
      }
    }

    try {
      const result = JSON.parse(responseText) as ApaczkaServiceResponse;
      // Filter the services before returning
      const filteredResult = filterCourierServices(result);
      return NextResponse.json(filteredResult);
    } catch (parseError) {
      console.error("Failed to parse Apaczka response:", parseError);
      return NextResponse.json(
        {
          status: 500,
          message: "Invalid JSON response from Apaczka API",
          debug: responseText.slice(0, 200),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Apaczka API error:", error);
    return NextResponse.json(
      {
        status: 500,
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
