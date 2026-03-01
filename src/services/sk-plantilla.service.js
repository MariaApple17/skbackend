import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/* ===============================
   ACTIVE FISCAL YEAR HELPER
================================ */
async function getActiveFiscalYear(tx) {
  const client = tx || prisma;

  const fiscalYear = await client.fiscalYear.findFirst({
    where: { isActive: true },
  });

  if (!fiscalYear) {
    throw new Error('No active fiscal year found');
  }

  return fiscalYear;
}

class SkPlantillaService {

  async createPlantilla(data) {
    return prisma.$transaction(async (tx) => {

      const fiscalYear = await getActiveFiscalYear(tx);

      const officialId = Number(data.officialId);
      const budgetAllocationId = Number(data.budgetAllocationId);
      const amount = Number(data.amount);

      if (!officialId || !budgetAllocationId || !amount) {
        throw new Error('Invalid input data');
      }

      const budget = await tx.budgetAllocation.findFirst({
        where: {
          id: budgetAllocationId,
          fiscalYearId: fiscalYear.id,
          deletedAt: null,
        },
      });

      if (!budget) {
        throw new Error('Budget allocation not found for active fiscal year');
      }

      const allocated = Number(budget.allocatedAmount);
      const used = Number(budget.usedAmount);
      const remaining = allocated - used;

      if (amount > remaining) {
        throw new Error(
          `Insufficient remaining budget. Remaining: ₱${remaining.toLocaleString()}`
        );
      }

      const plantilla = await tx.plantilla.create({
        data: {
          fiscalYearId: fiscalYear.id,
          officialId,
          budgetAllocationId,
          amount,
          periodCovered: data.periodCovered,
          remarks: data.remarks,
        },
      });

      await tx.budgetAllocation.update({
        where: { id: budgetAllocationId },
        data: {
          usedAmount: {
            increment: amount,
          },
        },
      });

      return plantilla;
    });
  }

  async updatePlantilla(id, data) {
    return prisma.$transaction(async (tx) => {

      const fiscalYear = await getActiveFiscalYear(tx);

      const existing = await tx.plantilla.findUnique({
        where: { id: Number(id) },
      });

      if (!existing) {
        throw new Error('Plantilla not found');
      }

      if (existing.fiscalYearId !== fiscalYear.id) {
        throw new Error('Cannot modify plantilla from previous fiscal year');
      }

      const budget = await tx.budgetAllocation.findFirst({
        where: {
          id: existing.budgetAllocationId,
          fiscalYearId: fiscalYear.id,
          deletedAt: null,
        },
      });

      if (!budget) {
        throw new Error('Budget allocation not found');
      }

      const allocated = Number(budget.allocatedAmount);
      const used = Number(budget.usedAmount);

      const adjustedUsed = used - Number(existing.amount);
      const remaining = allocated - adjustedUsed;

      const newAmount = Number(data.amount);

      if (newAmount > remaining) {
        throw new Error(
          `Insufficient remaining budget. Remaining: ₱${remaining.toLocaleString()}`
        );
      }

      await tx.budgetAllocation.update({
        where: { id: existing.budgetAllocationId },
        data: {
          usedAmount: adjustedUsed + newAmount,
        },
      });

      return tx.plantilla.update({
        where: { id: Number(id) },
        data: {
          amount: newAmount,
          periodCovered: data.periodCovered,
          remarks: data.remarks,
        },
      });
    });
  }

  async deletePlantilla(id) {
    return prisma.$transaction(async (tx) => {

      const fiscalYear = await getActiveFiscalYear(tx);

      const existing = await tx.plantilla.findUnique({
        where: { id: Number(id) },
      });

      if (!existing) {
        throw new Error('Plantilla not found');
      }

      if (existing.fiscalYearId !== fiscalYear.id) {
        throw new Error('Cannot delete plantilla from previous fiscal year');
      }

      await tx.budgetAllocation.update({
        where: { id: existing.budgetAllocationId },
        data: {
          usedAmount: {
            decrement: Number(existing.amount),
          },
        },
      });

      return tx.plantilla.delete({
        where: { id: Number(id) },
      });
    });
  }

  async getAllPlantilla() {
    const fiscalYear = await getActiveFiscalYear();

    return prisma.plantilla.findMany({
      where: {
        fiscalYearId: fiscalYear.id,
      },
      include: {
        official: true,
        budgetAllocation: {
          include: {
            classification: true,
            object: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new SkPlantillaService();