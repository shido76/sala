/*
  Warnings:

  - You are about to drop the column `description` on the `locations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `locations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "locations_description_key";

-- AlterTable
ALTER TABLE "locations" DROP COLUMN "description",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "locations_name_key" ON "locations"("name");
