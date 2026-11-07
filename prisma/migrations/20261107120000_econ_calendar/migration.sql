-- DropTable
DROP TABLE "EconomicEvent";

-- DropEnum
DROP TYPE "EventImpact";

-- AlterTable
ALTER TABLE "MarketNote" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "MarketNote_userId_date_key" ON "MarketNote"("userId", "date");
