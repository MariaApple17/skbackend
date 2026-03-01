-- AlterTable
ALTER TABLE "Plantilla" ADD COLUMN     "fiscalYearId" INTEGER;

-- AddForeignKey
ALTER TABLE "Plantilla" ADD CONSTRAINT "Plantilla_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "FiscalYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;
