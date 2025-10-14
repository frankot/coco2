const crypto = require("crypto");
// Use global fetch (Node 18+)
const fetch = global.fetch;

const APACZKA_API_URL = "https://www.apaczka.pl/api/v2";
const APP_ID = process.env.APACZKA_APP_ID;
const APP_SECRET = process.env.APACZKA_APP_SECRET;
if (!APP_ID || !APP_SECRET) {
  console.error("Missing APACZKA_APP_ID or APACZKA_APP_SECRET in env");
  process.exit(1);
}

function stringToSign(appId, route, data, expires) {
  return `${appId}:${route}:${data}:${expires}`;
}
function getSignature(str, key) {
  return crypto.createHmac("sha256", key).update(str).digest("hex");
}

async function post(route, body) {
  const expires = Math.floor(Date.now() / 1000) + 300;
  const data = JSON.stringify(body || {});
  const signature = getSignature(stringToSign(APP_ID, route, data, expires), APP_SECRET);
  const form = new URLSearchParams({
    app_id: APP_ID,
    request: data,
    expires: String(expires),
    signature,
  });
  const res = await fetch(`${APACZKA_API_URL}/${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: form.toString(),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new Error("Invalid JSON: " + text.slice(0, 500));
  }
  return { ok: res.ok, status: res.status, json };
}

(async () => {
  try {
    console.log("Calling service_structure...");
    const svc = await post("service_structure/", {});
    console.log("service_structure response status", svc.status);
    console.log(JSON.stringify(svc.json, null, 2));

    // Discover candidate services and the global points_type list
    const services = svc.json.response?.services || [];
    const pointsTypes = svc.json.response?.points_type || [];
    console.log("Total services", services.length, "points_type candidates", pointsTypes);

    // Target code returned by the map widget from the failing case
    const TARGET_CODE = "POP-WAW545";

    // Search across all points_type entries returned by service_structure
    let resolvedInternalId = null;
    const scannedTypes = [];
    for (const type of pointsTypes) {
      try {
        console.log(`Querying points/${type}/ (country_code=PL)`);
        const ptsRes = await post(`points/${type}/`, { country_code: "PL" });
        console.log(`points/${type}/ status`, ptsRes.status);
        const pts = ptsRes.json.response?.points || {};
        const keys = Object.keys(pts).slice(0, 5);
        console.log(`points/${type}/ sample keys`, keys);
        scannedTypes.push({ type, sampleKeys: keys });
        for (const [k, v] of Object.entries(pts)) {
          const p = v;
          const fav =
            p &&
            (p.foreign_access_point_id ||
              (p.address && p.address.foreign_access_point_id) ||
              p.code ||
              p.external_id);
          if (fav && String(fav).toUpperCase() === TARGET_CODE.toUpperCase()) {
            resolvedInternalId = k;
            console.log(
              "Resolved",
              TARGET_CODE,
              "-> internal id",
              k,
              "type=",
              type,
              "name=",
              p.name || p.address?.line1 || p
            );
            break;
          }
        }
        if (resolvedInternalId) break;
      } catch (e) {
        console.warn("points lookup failed for", type, e?.message || e);
      }
    }
    if (!resolvedInternalId)
      console.log(
        "Could not resolve",
        TARGET_CODE,
        "in any points_type scanned:",
        scannedTypes.map((s) => s.type)
      );

    // Now attempt to send order (may create a real shipment). We'll try
    // multiple payload variants to find which combination Apaczka accepts.
    const dim1 = parseInt(process.env.APACZKA_DEFAULT_DIM1 || "30", 10);
    const dim2 = parseInt(process.env.APACZKA_DEFAULT_DIM2 || "25", 10);
    const dim3 = parseInt(process.env.APACZKA_DEFAULT_DIM3 || "15", 10);
    const weight = Number(process.env.APACZKA_DEFAULT_WEIGHT || "4");

    const baseOrder = {
      service_id: 45,
      address: {
        sender: {
          country_code: "PL",
          name: "Kuba Urbaniak",
          line1: "Święcickiego 14",
          line2: "",
          postal_code: "01-614",
          state_code: "",
          city: "Warszawa",
          is_residential: 0,
          contact_person: "Kuba Urbaniak",
          email: "k.urbaniak@drcoco.pl",
          phone: "+48512385385",
          foreign_address_id: "",
        },
        receiver: {
          country_code: "PL",
          name: "jan Kowal",
          line1: "Gorczewska 15/71",
          line2: "",
          postal_code: "01-153",
          state_code: "",
          city: "Warszawa",
          is_residential: 1,
          contact_person: "jan Kowal",
          email: "frankiantki@gmail.com",
          phone: "+48784922541",
          supplier: "INPOST",
        },
      },
      shipment_value: 12000,
      shipment: [
        {
          dimension1: dim1,
          dimension2: dim2,
          dimension3: dim3,
          weight: weight,
          is_nstd: 0,
          shipment_type_code: "PACZKA",
        },
      ],
      comment: "Test payload from diagnostics",
      content: "Test",
      is_zebra: 0,
    };

    const attempts = [];
    // A: If we resolved internal id, try payload with COURIER pickup + foreign_address_id
    if (resolvedInternalId) {
      const o = JSON.parse(JSON.stringify(baseOrder));
      o.address.receiver.foreign_address_id = resolvedInternalId;
      o.address.receiver.foreign_access_point_id = TARGET_CODE;
      o.address.receiver.supplier = "INPOST";
      o.pickup = {
        type: "COURIER",
        date: new Date().toISOString().slice(0, 10),
        hours_from: "09:00",
        hours_to: "17:00",
      };
      attempts.push({ name: "COURIER_with_internal_id", payload: { order: o } });
    }

    // B: Try COURIER with only foreign_access_point_id (map code)
    const o2 = JSON.parse(JSON.stringify(baseOrder));
    o2.address.receiver.foreign_access_point_id = TARGET_CODE;
    o2.address.receiver.supplier = "INPOST";
    o2.pickup = {
      type: "COURIER",
      date: new Date().toISOString().slice(0, 10),
      hours_from: "09:00",
      hours_to: "17:00",
    };
    attempts.push({ name: "COURIER_with_map_code_only", payload: { order: o2 } });

    // C: Try no pickup (omit pickup entirely), with map code only
    const o3 = JSON.parse(JSON.stringify(baseOrder));
    o3.address.receiver.foreign_access_point_id = TARGET_CODE;
    o3.address.receiver.supplier = "INPOST";
    attempts.push({ name: "NO_PICKUP_map_code_only", payload: { order: o3 } });

    for (const a of attempts) {
      try {
        console.log("Attempting order_send variant", a.name);
        const res = await post("order_send/", a.payload);
        console.log("Result for", a.name, "status", res.status);
        console.log(JSON.stringify(res.json, null, 2));
      } catch (e) {
        console.error("order_send error for", a.name, e?.message || e, e?.json || "no-json");
      }
    }
  } catch (e) {
    console.error("Diagnostic error:", e);
  }
})();
