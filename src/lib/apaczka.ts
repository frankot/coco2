import crypto from "crypto";

const APACZKA_API_URL = "https://www.apaczka.pl/api/v2";

type ApiResponse<T> = { status: number; message: string; response: T };

function stringToSign(appId: string, route: string, data: string, expires: number): string {
  return `${appId}:${route}:${data}:${expires}`;
}

function getSignature(string: string, key: string): string {
  return crypto.createHmac("sha256", key).update(string).digest("hex");
}

function getCreds() {
  // Read fresh from env on each call to avoid stale values in dev/HMR
  const id = process.env.APACZKA_APP_ID?.replace(/"/g, "") || "";
  const secret = process.env.APACZKA_APP_SECRET?.replace(/"/g, "") || "";
  return { id, secret };
}

async function post<T>(route: string, body: any): Promise<ApiResponse<T>> {
  const { id: APP_ID, secret: APP_SECRET } = getCreds();
  if (!APP_ID || !APP_SECRET) {
    throw new Error("Missing Apaczka credentials");
  }
  const expires = Math.floor(Date.now() / 1000) + 300; // 5 minutes
  const data = JSON.stringify(body ?? {});
  const signature = getSignature(stringToSign(APP_ID, route, data, expires), APP_SECRET);
  const form = new URLSearchParams({
    app_id: APP_ID,
    request: data,
    expires: String(expires),
    signature,
  });
  const res = await fetch(`${APACZKA_API_URL}/${route}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      "User-Agent": "ApaczkaNextJSClient/1.0",
    },
    body: form.toString(),
    cache: "no-store",
  });
  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON from Apaczka: ${text.slice(0, 200)}`);
  }
  if (!res.ok || json.status !== 200) {
    const msg = json?.message ?? res.statusText;
    const status = json?.status ?? res.status;
    const err = new Error(`Apaczka error ${status}: ${msg}`) as any;
    err.status = status;
    err.details = json;
    throw err;
  }
  return json as ApiResponse<T>;
}

export type OrderPayload = any; // We'll keep flexible, Zod-validate upstream

export const Apaczka = {
  serviceStructure() {
    return post<{
      services: any[];
      options?: Record<string, unknown>;
      package_type?: Record<string, unknown>;
      points_type?: string[];
    }>("service_structure/", {});
  },
  orderValuation(order: OrderPayload) {
    return post<{ price_table: Record<string, { price: string; price_gross: string }> }>(
      "order_valuation/",
      { order }
    );
  },
  sendOrder(order: OrderPayload) {
    return post<{
      order: {
        id: string;
        service_id: string;
        service_name: string;
        waybill_number: string;
        tracking_url: string;
        status: string;
        shipments_count: number;
      };
    }>("order_send/", { order });
  },
  waybill(orderId: string) {
    return post<{ waybill: string; type: string }>(`waybill/${orderId}/`, {});
  },
  turnIn(orderIds: string[]) {
    return post<{ turn_in: string }>("turn_in/", { order_ids: orderIds });
  },
  pickupHours(postal_code: string, service_id?: string) {
    return post<{ postal_code: string; hours: any }>("pickup_hours/", { postal_code, service_id });
  },
};

export default Apaczka;
