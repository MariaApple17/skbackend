import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class SkPlantillaService {

  /* ======================================================
     CREATE PLANTILLA
  ====================================================== */
  async createPlantilla(data) {
    return prisma.$transaction(async (tx) => {

      const officialId = Number(data.officialId);
      const budgetAllocationId = Number(data.budgetAllocationId);
      const amount = Number(data.amount);

      if (!officialId || !budgetAllocationId || !amount || amount <= 0) {
        throw new Error('Invalid input data');
      }

      // Get allocation + budget relation
      const allocation = await tx.budgetAllocation.findFirst({
        where: {
          id: budgetAllocationId,
          deletedAt: null,
        },
        include: {
          budget: true,
        },
      });

      if (!allocation) {
        throw new Error('Budget allocation not found');
      }

      if (!allocation.budget) {
        throw new Error('Budget not properly linked');
      }

      // Optional: enforce active fiscal year
      const activeFiscal = await tx.fiscalYear.findFirst({
        where: { isActive: true, deletedAt: null },
      });

      if (!activeFiscal) {
        throw new Error('No active fiscal year');
      }

      if (allocation.budget.fiscalYearId !== activeFiscal.id) {
        throw new Error('Cannot use allocation from inactive fiscal year');
      }

      const allocated = parseFloat(allocation.allocatedAmount.toString());
      const used = parseFloat(allocation.usedAmount.toString());
      const remaining = allocated - used;

      if (remaining < 0) {
        throw new Error('Budget already overspent');
      }

      if (amount > remaining) {
        throw new Error(
          `Insufficient remaining budget. Remaining: ₱${remaining.toLocaleString()}`
        );
      }

      // Create plantilla
      const plantilla = await tx.plantilla.create({
        data: {
          officialId,
          budgetAllocationId,
          amount,
          periodCovered: data.periodCovered,
          remarks: data.remarks,
        },
      });

      // Update used amount safely
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

  /* ======================================================
     UPDATE PLANTILLA
  ====================================================== */
  async updatePlantilla(id, data) {
    return prisma.$transaction(async (tx) => {

      const plantillaId = Number(id);

      const existing = await tx.plantilla.findUnique({
        where: { id: plantillaId },
      });

      if (!existing) {
        throw new Error('Plantilla not found');
      }

      const allocation = await tx.budgetAllocation.findFirst({
        where: {
          id: existing.budgetAllocationId,
          deletedAt: null,
        },
      });

      if (!allocation) {
        throw new Error('Budget allocation not found');
      }

      const allocated = parseFloat(allocation.allocatedAmount.toString());
      const used = parseFloat(allocation.usedAmount.toString());

      // Remove old amount first
      const adjustedUsed = used - existing.amount;
      const remaining = allocated - adjustedUsed;

      const newAmount = Number(data.amount);

      if (!newAmount || newAmount <= 0) {
        throw new Error('Invalid amount');
      }

      if (newAmount > remaining) {
        throw new Error('Insufficient budget for update');
      }

      // Update allocation used amount
      await tx.budgetAllocation.update({
        where: { id: existing.budgetAllocationId },
        data: {
          usedAmount: adjustedUsed + newAmount,
        },
      });

      return tx.plantilla.update({
        where: { id: plantillaId },
        data: {
          periodCovered: data.periodCovered,
          remarks: data.remarks,
          amount: newAmount,
        },
      });
    });
  }

  /* ======================================================
     DELETE PLANTILLA
  ====================================================== */
  async deletePlantilla(id) {
    return prisma.$transaction(async (tx) => {

      const plantillaId = Number(id);

      const existing = await tx.plantilla.findUnique({
        where: { id: plantillaId },
      });

      if (!existing) {
        throw new Error('Plantilla not found');
      }

      // Deduct used amount
      await tx.budgetAllocation.update({
        where: { id: existing.budgetAllocationId },
        data: {
          usedAmount: {
            decrement: existing.amount,
          },
        },
      });

      return tx.plantilla.delete({
        where: { id: plantillaId },
      });
    });
  }

  /* ======================================================
     GET ALL PLANTILLA BY FISCAL YEAR
  ====================================================== */
  async getAllPlantilla(fiscalYearId) {
    if (!fiscalYearId) {
      throw new Error('Fiscal year is required');
    }

    return prisma.plantilla.findMany({
      where: {
        budgetAllocation: {
          deletedAt: null,
          budget: {
            fiscalYearId: Number(fiscalYearId),
            deletedAt: null,
          },
        },
      },
      include: {
        official: true,
        budgetAllocation: {
          include: {
            classification: true,
            object: true,
            budget: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new SkPlantillaService();