/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `locations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "locations_description_key" ON "locations"("description");
