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
  // Robust sanitization - remove quotes, whitespace, newlines
  const sanitize = (val: string | undefined) => val ? val.replace(/["'\s\n\r]/g, "") : "";
  const id = sanitize(process.env.APACZKA_APP_ID);
  const secret = sanitize(process.env.APACZKA_APP_SECRET);
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
  // Find the correct D2P service_id for a given supplier and point code
  // Returns service_id that matches: door_to_point=1, domestic=1, and point type (Paczkomat vs Punkt for InPost)
  async findD2PService(supplier: string, pointCode: string): Promise<number | null> {
    try {
      const svc = await this.serviceStructure();
      const services = svc.response?.services || [];
      const supplierUpper = supplier.toUpperCase();

      // Map supplier to Apaczka API codes
      const supplierMap: Record<string, string> = {
        INPOST: "INPOST",
        DPD: "DPD",
        DHL: "DHL_PARCEL",
        DHL_PARCEL: "DHL_PARCEL",
      };
      const mappedSupplier = supplierMap[supplierUpper] || supplierUpper;

      // Filter for D2P domestic services for this supplier
      const candidates = services.filter(
        (s: any) =>
          s.supplier?.toUpperCase() === mappedSupplier &&
          s.door_to_point === "1" &&
          s.domestic === "1"
      );

      if (candidates.length === 0) return null;

      // For INPOST: distinguish between Paczkomat and Punkt based on point code
      if (mappedSupplier === "INPOST") {
        const pid = String(pointCode).toUpperCase();
        if (pid.startsWith("POP-")) {
          // POP- prefix = InPost Punkt (pickup point)
          const punkt = candidates.find((s: any) => /punkt/i.test(s.name));
          return punkt ? Number(punkt.service_id) : null;
        } else {
          // Regular code = Paczkomat (locker)
          const paczkomat = candidates.find((s: any) => /paczkomat/i.test(s.name));
          return paczkomat ? Number(paczkomat.service_id) : null;
        }
      } else if (mappedSupplier === "DPD") {
        // For DPD: prefer "Pickup" service
        const pickup = candidates.find((s: any) => /pickup/i.test(s.name));
        return pickup ? Number(pickup.service_id) : Number(candidates[0].service_id);
      }

      // Default: return first candidate
      return Number(candidates[0].service_id);
    } catch (e) {
      console.error("Failed to find D2P service:", e);
      return null;
    }
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
  // internal Apaczka point id. It queries service_structure for points_type,
  // and then points/:type, optionally trying subtype hints for suppliers like INPOST.
  async resolvePoint(supplier: string, code: string, country_code = "PL") {
    if (!supplier || !code) throw new Error("supplier and code required");
    const supplierUpper = String(supplier).toUpperCase();

    // Build candidate code variants to cope with supplier-specific prefixes
    const raw = String(code).toUpperCase();
    const variants = new Set<string>([raw]);
    // Strip common prefixes like POP-
    variants.add(raw.replace(/^POP-/, ""));
    // Remove hyphens variant
    variants.add(raw.replace(/-/g, ""));

    const ss = await post<any>("service_structure/", {});
    const pointsTypes: string[] = ss.response?.points_type || [];
    // Try explicit supplier type first, then any available points_type
    const candidates = [supplierUpper, ...pointsTypes.filter((t) => t !== supplierUpper)];

    // Subtype hints per supplier (best-effort)
    const subtypeHints: Array<string | undefined> = (() => {
      if (supplierUpper === "INPOST") {
        // If code looks like a POP-*, try POP first, then APM, then no filter
        if (/^POP-/.test(raw)) return ["POP", "APM", undefined];
        return ["APM", "POP", undefined];
      }
      return [undefined];
    })();

    const tried: Record<string, any> = {};
    for (const t of candidates) {
      for (const sub of subtypeHints) {
        try {
          const payload: any = { country_code };
          if (sub) payload.subtype = sub;
          const pts = await post<{ points: Record<string, any> }>(`points/${t}/`, payload);
          const map = pts.response?.points || {};
          tried[`${t}${sub ? `:${sub}` : ""}`] = Object.keys(map).slice(0, 5);
          for (const [key, val] of Object.entries(map)) {
            const p: any = val as any;
            const fields: Array<string | undefined> = [
              p?.foreign_access_point_id,
              p?.address?.foreign_access_point_id,
              p?.code,
              p?.external_id,
            ];
            for (const f of fields) {
              if (!f) continue;
              const fv = String(f).toUpperCase();
              if (
                variants.has(fv) ||
                variants.has(fv.replace(/^POP-/, "")) ||
                variants.has(fv.replace(/-/g, ""))
              ) {
                return { type: t, subtype: sub, internalId: key, point: p };
              }
            }
            // Deep scan as last resort for unknown field names
            const allStrings: string[] = [];
            const stack: any[] = [p];
            let depth = 0;
            while (stack.length && depth < 5000) {
              depth++;
              const cur = stack.pop();
              if (typeof cur === "string") {
                allStrings.push(cur.toUpperCase());
              } else if (Array.isArray(cur)) {
                for (const v of cur) stack.push(v);
              } else if (cur && typeof cur === "object") {
                for (const v of Object.values(cur)) stack.push(v);
              }
            }
            const foundLoose = allStrings.some(
              (s) =>
                variants.has(s) ||
                variants.has(s.replace(/^POP-/, "")) ||
                variants.has(s.replace(/-/g, ""))
            );
            if (foundLoose) {
              return { type: t, subtype: sub, internalId: key, point: p };
            }
          }
        } catch (e) {
          // ignore and continue to next subtype/type
        }
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
