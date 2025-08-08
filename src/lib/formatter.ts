/**
 * Format a number as PLN currency
 * @param amountInCents Amount in cents (groszy)
 * @returns Formatted currency string with PLN symbol
 */
export function formatPLN(amountInCents: number | null | undefined): string {
  if (amountInCents === null || amountInCents === undefined) {
    return "0,00 zł";
  }

  const amount = amountInCents / 100;

  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number with thousands separator without currency
 * @param value Number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "0";
  }

  return new Intl.NumberFormat("pl-PL").format(value);
}
