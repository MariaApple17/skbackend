-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "fiscalYearId" INTEGER;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "FiscalYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;
