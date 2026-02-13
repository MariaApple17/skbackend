/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Program` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Program" DROP COLUMN "imageUrl";

-- CreateTable
CREATE TABLE "ProgramDocumentImage" (
    "id" SERIAL NOT NULL,
    "programId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProgramDocumentImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProgramDocumentImage_programId_idx" ON "ProgramDocumentImage"("programId");

-- AddForeignKey
ALTER TABLE "ProgramDocumentImage" ADD CONSTRAINT "ProgramDocumentImage_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
