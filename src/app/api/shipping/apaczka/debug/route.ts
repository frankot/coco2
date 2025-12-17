import { NextResponse } from "next/server";

/**
 * Debug endpoint to verify Apaczka credentials are loaded correctly
 * ⚠️ REMOVE THIS FILE AFTER DEBUGGING - IT EXPOSES SENSITIVE INFO
 */
export async function GET() {
  // Robust credential sanitization - same as in main route
  function sanitizeCredential(value: string | undefined): string {
    if (!value) return "";
    return value.replace(/["'\s\n\r]/g, "");
  }

  const rawAppId = process.env.APACZKA_APP_ID;
  const rawSecret = process.env.APACZKA_APP_SECRET;
  
  const cleanAppId = sanitizeCredential(rawAppId);
  const cleanSecret = sanitizeCredential(rawSecret);

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    credentials: {
      appId: {
        exists: !!rawAppId,
        length: rawAppId?.length || 0,
        cleanLength: cleanAppId.length,
        firstChars: cleanAppId.substring(0, 8) + "...", // Show first 8 chars only
        hasWhitespace: rawAppId !== rawAppId?.trim(),
        hasQuotes: /["']/.test(rawAppId || ""),
      },
      secret: {
        exists: !!rawSecret,
        length: rawSecret?.length || 0,
        cleanLength: cleanSecret.length,
        firstChars: cleanSecret.substring(0, 8) + "...", // Show first 8 chars only
        hasWhitespace: rawSecret !== rawSecret?.trim(),
        hasQuotes: /["']/.test(rawSecret || ""),
      },
    },
    note: "⚠️ DELETE THIS ENDPOINT AFTER DEBUGGING",
  });
}
