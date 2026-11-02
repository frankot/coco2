type SeoProduct = {
  name: string;
  itemsPerPack: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

const MAX_DESCRIPTION = 160;

// Word-Boundary Trim
function trimToWord(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:–-]+$/, "");
}

// Product Meta Title
export function getProductMetaTitle(product: SeoProduct) {
  return (
    product.metaTitle?.trim() ||
    `Woda kokosowa ${product.name} – zestaw ${product.itemsPerPack} sztuk | Dr.Coco`
  );
}

// Product Meta Description
export function getProductMetaDescription(product: SeoProduct) {
  if (product.metaDescription?.trim()) return product.metaDescription.trim();
  const title = getProductMetaTitle(product).replace(/\s*\|\s*Dr\.Coco$/, "");
  return trimToWord(
    `${title}. Naturalna woda kokosowa Dr.Coco bez dodatków i koncentratu. Zamów online z dostawą na terenie Polski.`,
    MAX_DESCRIPTION
  );
}
