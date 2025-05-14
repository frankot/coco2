-- Add featured field to Product table
ALTER TABLE "Product" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false; 