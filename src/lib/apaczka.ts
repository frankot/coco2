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
  // Fetch points list for a given type (type comes from service_structure / points_type)
  points(type: string, country_code?: string, subtype?: string) {
    const payload: any = {};
    if (country_code) payload.country_code = country_code;
    if (subtype) payload.subtype = subtype;
    return post<{ points: Record<string, any> }>(`points/${type}/`, payload);
  },
  // Attempt to resolve a supplier map code (foreign_access_point_id) to the
  // internal Apaczka point id. It will query service_structure to get the
  // available points_type candidates, query points/:type for each and try
  // to match the provided code against known fields.
  async resolvePoint(supplier: string, code: string, country_code = "PL") {
    if (!supplier || !code) throw new Error("supplier and code required");
    const ss = await post<any>("service_structure/", {});
    const pointsTypes: string[] = ss.response?.points_type || [];
    // Try an explicit supplier name first
    const candidates = [supplier.toUpperCase(), ...pointsTypes];
    const tried: Record<string, any> = {};
    for (const t of candidates) {
      try {
        const pts = await post<{ points: Record<string, any> }>(`points/${t}/`, { country_code });
        const map = pts.response?.points || {};
        tried[t] = Object.keys(map).slice(0, 5);
        for (const [key, val] of Object.entries(map)) {
          const p: any = val as any;
          const fav =
            p?.foreign_access_point_id ||
            p?.address?.foreign_access_point_id ||
            p?.code ||
            p?.external_id;
          if (fav && String(fav).toUpperCase() === String(code).toUpperCase()) {
            return { type: t, internalId: key, point: p };
          }
        }
      } catch (e) {
        // ignore and continue
      }
    }
    return { found: false, tried };
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
  // Fetch order details/status by Apaczka order id
  getOrder(orderId: string) {
    // Use the documented order details endpoint: /order/:order_id/
    // The endpoint returns { response: { order: { ... } } }
    return post<{
      order: {
        id: string;
        supplier?: string;
        service_id: string;
        service_name: string;
        waybill_number?: string;
        tracking_url?: string;
        status: string;
        shipments_count?: number;
      };
    }>(`order/${orderId}/`, {});
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
