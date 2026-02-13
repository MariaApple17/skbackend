/*
  Warnings:

  - You are about to drop the `SystemSetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- DropTable
DROP TABLE "SystemSetting";

-- CreateTable
CREATE TABLE "SystemProfile" (
    "id" SERIAL NOT NULL,
    "fiscalYearId" INTEGER NOT NULL,
    "systemName" TEXT NOT NULL,
    "systemDescription" TEXT,
    "logoUrl" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SystemProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkOfficial" (
    "id" SERIAL NOT NULL,
    "fiscalYearId" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "responsibility" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "gender" "Gender" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SkOfficial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemProfile_fiscalYearId_key" ON "SystemProfile"("fiscalYearId");

-- AddForeignKey
ALTER TABLE "SystemProfile" ADD CONSTRAINT "SystemProfile_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "FiscalYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkOfficial" ADD CONSTRAINT "SkOfficial_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "FiscalYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
