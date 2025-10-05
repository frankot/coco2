/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "imagePaths" DROP DEFAULT,
ALTER COLUMN "imagePublicIds" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phoneNumber";
