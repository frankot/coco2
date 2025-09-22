-- CreateEnum
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imagePaths" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Product" ADD COLUMN     "imagePublicIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Convert existing single images to arrays
UPDATE "Product" 
SET "imagePaths" = ARRAY["imagePath"], 
    "imagePublicIds" = CASE 
        WHEN "imagePublicId" IS NOT NULL THEN ARRAY["imagePublicId"] 
        ELSE ARRAY[]::TEXT[] 
    END
WHERE "imagePath" IS NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imagePath";
ALTER TABLE "Product" DROP COLUMN "imagePublicId";

-- Make imagePaths required (not null)
ALTER TABLE "Product" ALTER COLUMN "imagePaths" SET NOT NULL;
ALTER TABLE "Product" ALTER COLUMN "imagePublicIds" SET NOT NULL;
