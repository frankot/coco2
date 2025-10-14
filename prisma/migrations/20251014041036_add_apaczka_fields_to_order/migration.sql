-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "apaczkaConfirmedAt" TIMESTAMP(3),
ADD COLUMN     "apaczkaOrderId" TEXT,
ADD COLUMN     "apaczkaStatus" TEXT,
ADD COLUMN     "apaczkaTrackingUrl" TEXT,
ADD COLUMN     "apaczkaWaybillNumber" TEXT,
ADD COLUMN     "shippingServiceId" TEXT,
ADD COLUMN     "shippingServiceName" TEXT;
