const WFIRMA_API_URL = "https://api2.wfirma.pl";

type WfirmaStatus = {
  code?: string | number;
  message?: string;
};

type WfirmaEnvelope<T> = {
  status?: WfirmaStatus;
  response?: T;
};

type UnknownRecord = Record<string, unknown>;

export type WfirmaInvoiceLine = {
  name: string;
  quantity: number;
  unit?: string;
  price: string;
  vat: string;
};

export type CorrectionInvoiceLineItem = {
  parentId: string;
  name: string;
};

export type CreateInvoiceParams = {
  contractor: {
    name: string;
    street: string;
    zip: string;
    city: string;
    country: string;
    email?: string;
    phone?: string | null;
    nip?: string | null;
  };
  paymentMethod: "transfer" | "cod";
  paymentState: "paid" | "unpaid";
  totalGross: string; // total gross invoice amount, e.g. "203.22"
  lines: WfirmaInvoiceLine[];
  seriesId?: string;
};

const COUNTRY_CODE_MAP: Record<string, string> = {
  POLSKA: "PL",
  POLAND: "PL",
  NIEMCY: "DE",
  GERMANY: "DE",
  CZECHY: "CZ",
  CZECH_REPUBLIC: "CZ",
  CZECHIA: "CZ",
};

function sanitize(value: string | undefined) {
  return value?.trim().replace(/^['"]|['"]$/g, "") ?? "";
}

function getConfig() {
  const accessKey = sanitize(process.env.WFIRMA_ACCESS_KEY);
  const secretKey = sanitize(process.env.WFIRMA_SECRET_KEY);
  const appKey = sanitize(process.env.WFIRMA_APP_KEY);
  const companyId = sanitize(process.env.WFIRMA_COMPANY_ID);

  if (!accessKey || !secretKey || !appKey || !companyId) {
    throw new Error("Missing wFirma credentials");
  }

  return { accessKey, secretKey, appKey, companyId };
}

function getUrl(path: string) {
  return getUrlWithFormat(path, "json");
}

function getUrlWithFormat(path: string, inputFormat: "json" | "xml") {
  const { companyId } = getConfig();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const query = new URLSearchParams({
    inputFormat,
    outputFormat: "json",
    company_id: companyId,
  });

  return `${WFIRMA_API_URL}${normalizedPath}?${query.toString()}`;
}

async function requestJson<T>(
  path: string,
  init?: RequestInit,
  options?: { inputFormat?: "json" | "xml"; contentType?: string }
): Promise<WfirmaEnvelope<T>> {
  const { accessKey, secretKey, appKey } = getConfig();
  const inputFormat = options?.inputFormat ?? "json";
  const response = await fetch(getUrlWithFormat(path, inputFormat), {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": options?.contentType ?? "application/json",
      accessKey,
      secretKey,
      appKey,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
    // requestJson handles both JSON and XML request bodies; response is always JSON here.
  });

  const text = await response.text();
  let data: WfirmaEnvelope<T>;

  try {
    data = JSON.parse(text) as WfirmaEnvelope<T>;
  } catch {
    throw new Error(`Invalid JSON from wFirma: ${text.slice(0, 300)}`);
  }

  const statusCode = Number(data?.status?.code ?? response.status);
  if (!response.ok || (Number.isFinite(statusCode) && statusCode >= 400)) {
    throw new Error(data?.status?.message || `wFirma request failed with status ${statusCode}`);
  }

  return data;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isRecord(value: unknown): value is UnknownRecord {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function findInvoiceLikeNode(value: unknown): UnknownRecord | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findInvoiceLikeNode(item);
      if (found) return found;
    }
    return null;
  }

  if (!isRecord(value)) {
    return null;
  }

  const maybeId = value.id;
  const maybeNumber = value.fullnumber ?? value.number ?? value.full_number;
  if ((typeof maybeId === "string" || typeof maybeId === "number") && maybeNumber !== undefined) {
    return value;
  }

  if (typeof maybeId === "string" || typeof maybeId === "number") {
    return value;
  }

  for (const nested of Object.values(value)) {
    const found = findInvoiceLikeNode(nested);
    if (found) return found;
  }

  return null;
}

async function requestPdf(path: string, init?: RequestInit): Promise<Buffer> {
  const { accessKey, secretKey, appKey } = getConfig();
  const response = await fetch(getUrl(path), {
    ...init,
    headers: {
      Accept: "application/pdf, application/json",
      accessKey,
      secretKey,
      appKey,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const payload = (await response.json()) as WfirmaEnvelope<any>;
    const maybeBase64 =
      payload?.response?.file ||
      payload?.response?.pdf ||
      payload?.response?.invoice ||
      payload?.response?.url;

    if (typeof maybeBase64 === "string" && !maybeBase64.startsWith("http")) {
      return Buffer.from(maybeBase64, "base64");
    }

    throw new Error(payload?.status?.message || "wFirma did not return a PDF payload");
  }

  if (!response.ok) {
    throw new Error(`wFirma PDF download failed with status ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export const wFirma = {
  createInvoice(params: CreateInvoiceParams) {
    const normalizedCountry =
      COUNTRY_CODE_MAP[params.contractor.country.trim().toUpperCase().replace(/\s+/g, "_")] ||
      params.contractor.country.trim().toUpperCase();

    const linesXml = params.lines
      .map(
        (line) => `<invoicecontent>
<name>${escapeXml(line.name)}</name>
<count>${line.quantity.toFixed(4)}</count>
<unit_count>1.0000</unit_count>
<unit>${escapeXml(line.unit ?? "szt.")}</unit>
<price>${escapeXml(line.price)}</price>
<vat>${escapeXml(line.vat)}</vat>
</invoicecontent>`
      )
      .join("");

    const xmlBody = `<api>
<invoices>
<invoice>
<contractor>
<name>${escapeXml(params.contractor.name)}</name>
<street>${escapeXml(params.contractor.street)}</street>
<zip>${escapeXml(params.contractor.zip)}</zip>
<city>${escapeXml(params.contractor.city)}</city>
<country>${escapeXml(normalizedCountry)}</country>
${params.contractor.email ? `<email>${escapeXml(params.contractor.email)}</email>` : ""}
${params.contractor.phone ? `<phone>${escapeXml(params.contractor.phone)}</phone>` : ""}
${params.contractor.nip ? `<nip>${escapeXml(params.contractor.nip)}</nip>` : ""}
</contractor>
<type>normal</type>
<paymentmethod>${params.paymentMethod}</paymentmethod>
<alreadypaid_initial>${params.paymentState === "paid" ? escapeXml(params.totalGross) : "0"}</alreadypaid_initial>
<price_type>brutto</price_type>
${params.seriesId ? `<series><id>${escapeXml(params.seriesId)}</id></series>` : ""}
<invoicecontents>${linesXml}</invoicecontents>
</invoice>
</invoices>
</api>`;

    return requestJson<{
      invoices?: Array<{ id?: string | number; fullnumber?: string }>;
      invoice?: { id?: string | number; fullnumber?: string };
    }>("/invoices/add", {
      method: "POST",
      body: xmlBody,
    }, {
      inputFormat: "xml",
      contentType: "application/xml",
    });
  },

  createCorrectionInvoice(
    parentInvoiceId: string,
    lineItems: CorrectionInvoiceLineItem[],
    reason?: string
  ) {
    const description = reason ?? "Anulowanie zamówienia";

    const linesXml = lineItems
      .map(
        (line) => `<invoicecontent>
<parent_id>${escapeXml(line.parentId)}</parent_id>
<name>${escapeXml(line.name)}</name>
<count>0.0000</count>
<price>0.00</price>
</invoicecontent>`
      )
      .join("");

    const xmlBody = `<api>
<invoices>
<invoice>
<type>correction</type>
<parent_id>${escapeXml(parentInvoiceId)}</parent_id>
<description>${escapeXml(description)}</description>
<invoicecontents>${linesXml}</invoicecontents>
</invoice>
</invoices>
</api>`;

    return requestJson<{
      invoices?: Array<{ id?: string | number; fullnumber?: string }>;
      invoice?: { id?: string | number; fullnumber?: string };
    }>("/invoices/add", {
      method: "POST",
      body: xmlBody,
    }, {
      inputFormat: "xml",
      contentType: "application/xml",
    });
  },

  sendInvoice(invoiceId: string, email: string, subject?: string, body?: string) {
    return requestJson<unknown>(`/invoices/send/${invoiceId}`, {
      method: "POST",
      body: JSON.stringify({
        email,
        ...(subject ? { subject } : {}),
        ...(body ? { body } : {}),
      }),
    });
  },

  downloadInvoice(invoiceId: string) {
    return requestPdf(`/invoices/download/${invoiceId}`, {
      method: "POST",
    });
  },

  getInvoice(invoiceId: string) {
    return requestJson<{ invoice?: Record<string, unknown> }>(`/invoices/get/${invoiceId}`, {
      method: "GET",
    });
  },

  extractInvoiceMeta(payload: unknown) {
    const node = findInvoiceLikeNode(payload);
    if (!node) {
      return null;
    }

    const invoiceId = node.id;
    const invoiceNumber = node.fullnumber ?? node.number ?? node.full_number ?? null;

    return {
      id: invoiceId != null ? String(invoiceId) : null,
      number: typeof invoiceNumber === "string" ? invoiceNumber : null,
      raw: node,
    };
  },
};

export default wFirma;
