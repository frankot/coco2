-- Add product storefront visibility flag.
-- Existing products remain visible, regardless of current availability.
ALTER TABLE "Product" ADD COLUMN "isVisible" BOOLEAN NOT NULL DEFAULT true;
