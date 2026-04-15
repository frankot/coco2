import crypto from "crypto";

const TTL_MS = 5 * 60 * 1000;
const store = new Map<string, { value: number; expires: number }>();

export type ValuationKeyInput = {
  serviceId: string;
  receiverPostal: string;
  items: { id: string; quantity: number }[];
};

export function valuationKey(input: ValuationKeyInput): string {
  const sorted = [...input.items].sort((a, b) => a.id.localeCompare(b.id));
  const payload = JSON.stringify({
    serviceId: input.serviceId,
    receiverPostal: input.receiverPostal,
    items: sorted,
  });
  return crypto.createHash("sha256").update(payload).digest("hex");
}

export function getCached(key: string): number | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (hit.expires < Date.now()) {
    store.delete(key);
    return null;
  }
  return hit.value;
}

export function setCached(key: string, value: number): void {
  store.set(key, { value, expires: Date.now() + TTL_MS });
}
