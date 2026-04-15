// Polish NIP checksum (mod-11 with weights 6,5,7,2,3,4,5,6,7)
export function isValidNip(nip: string): boolean {
  const digits = nip.replace(/[\s-]/g, "");
  if (!/^\d{10}$/.test(digits)) return false;
  const w = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  const sum = w.reduce((s, wi, i) => s + wi * Number(digits[i]), 0);
  return sum % 11 === Number(digits[9]);
}
