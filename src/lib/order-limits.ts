// Retail Pack Limit (guests + DETAL)
export const RETAIL_MAX_PACKS = 3;

export const RETAIL_MAX_PACKS_MESSAGE = `Maksymalnie ${RETAIL_MAX_PACKS} opakowania w jednym zamówieniu.`;

export function getMaxPacks(accountType?: string | null): number | null {
  return !accountType || accountType === "DETAL" ? RETAIL_MAX_PACKS : null;
}
