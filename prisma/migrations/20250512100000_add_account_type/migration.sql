-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ADMIN', 'DETAL', 'HURT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "accountType" "AccountType" NOT NULL DEFAULT 'DETAL'; 