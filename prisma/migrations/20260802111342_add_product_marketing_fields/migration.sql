-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "emoji" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "discountPercent" INTEGER,
ADD COLUMN     "images" JSONB,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "originalPrice" DECIMAL(65,30);

-- CreateIndex
CREATE INDEX "Product_isFeatured_idx" ON "Product"("isFeatured");

-- CreateIndex
CREATE INDEX "Product_brand_idx" ON "Product"("brand");
