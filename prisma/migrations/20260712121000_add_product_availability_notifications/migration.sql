-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('ACTIVE', 'SENT', 'UNSUBSCRIBED');

-- CreateTable
CREATE TABLE "ProductAvailabilityNotification" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "status" "NotificationStatus" NOT NULL DEFAULT 'ACTIVE',
    "unsubscribeTokenHash" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductAvailabilityNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductAvailabilityNotification_productId_email_status_key" ON "ProductAvailabilityNotification"("productId", "email", "status");

-- CreateIndex
CREATE INDEX "ProductAvailabilityNotification_productId_status_idx" ON "ProductAvailabilityNotification"("productId", "status");

-- CreateIndex
CREATE INDEX "ProductAvailabilityNotification_email_idx" ON "ProductAvailabilityNotification"("email");

-- AddForeignKey
ALTER TABLE "ProductAvailabilityNotification" ADD CONSTRAINT "ProductAvailabilityNotification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAvailabilityNotification" ADD CONSTRAINT "ProductAvailabilityNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
