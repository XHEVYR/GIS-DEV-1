/*
  Warnings:

  - You are about to drop the column `image` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `is_recommended` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `places` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "places" DROP COLUMN "image",
DROP COLUMN "is_recommended",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "place_images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "placeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "place_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_details" (
    "id" SERIAL NOT NULL,
    "placeId" INTEGER NOT NULL,
    "accessInfo" TEXT,
    "priceInfo" TEXT,
    "facilities" TEXT,
    "contactInfo" TEXT,
    "webUrl" TEXT,

    CONSTRAINT "place_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "place_details_placeId_key" ON "place_details"("placeId");

-- AddForeignKey
ALTER TABLE "place_images" ADD CONSTRAINT "place_images_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_details" ADD CONSTRAINT "place_details_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;
