/*
  Warnings:

  - A unique constraint covering the columns `[privatCode]` on the table `PrivatWordSet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PrivatWordSet_privatCode_key" ON "PrivatWordSet"("privatCode");
