-- Add preorder product fields.
ALTER TABLE "Product" ADD COLUMN "isPreorder" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Product" ADD COLUMN "preorderAvailableAt" TIMESTAMP(3);
ALTER TABLE "Product" ADD COLUMN "preorderOriginalPriceInCents" INTEGER;
