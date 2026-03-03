import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class SkPlantillaService {

  /* ================= CREATE ================= */
  async createPlantilla(data) {
    return prisma.$transaction(async (tx) => {

      const officialId = Number(data.officialId);
      const budgetAllocationId = Number(data.budgetAllocationId);
      const fiscalYearId = Number(data.fiscalYearId);
      const amount = Number(data.amount);

      if (!officialId || !budgetAllocationId || !fiscalYearId || !amount) {
        throw new Error('Invalid input data');
      }

      /* 🔎 Validate allocation belongs to fiscal year */
      const budget = await tx.budgetAllocation.findFirst({
        where: {
          id: budgetAllocationId,
          deletedAt: null,
          budget: {
            fiscalYearId: fiscalYearId,
          },
        },
        include: {
          budget: true,
        },
      });

      if (!budget) {
        throw new Error('Budget allocation not found for selected fiscal year');
      }

      const allocated = Number(budget.allocatedAmount);
      const used = Number(budget.usedAmount);
      const remaining = allocated - used;

      if (amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }

      if (amount > remaining) {
        throw new Error(
          `Insufficient remaining budget. Remaining: ₱${remaining.toLocaleString()}`
        );
      }

      /* 🛑 Optional: prevent duplicate official per fiscal year */
      const existingAssignment = await tx.plantilla.findFirst({
        where: {
          officialId,
          fiscalYearId,
        },
      });

      if (existingAssignment) {
        throw new Error('Official already has plantilla for this fiscal year');
      }

      const plantilla = await tx.plantilla.create({
        data: {
          officialId,
          budgetAllocationId,
          fiscalYearId,
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

  /* ================= UPDATE ================= */
  async updatePlantilla(id, data) {
    return prisma.$transaction(async (tx) => {

      const existing = await tx.plantilla.findUnique({
        where: { id: Number(id) },
      });

      if (!existing) {
        throw new Error('Plantilla not found');
      }

      const newAmount = Number(data.amount);

      if (newAmount <= 0) {
        throw new Error('Amount must be greater than zero');
      }

      const budget = await tx.budgetAllocation.findFirst({
        where: {
          id: existing.budgetAllocationId,
          deletedAt: null,
        },
      });

      if (!budget) {
        throw new Error('Budget allocation not found');
      }

      const allocated = Number(budget.allocatedAmount);
      const used = Number(budget.usedAmount);

      /* remove old amount first */
      const adjustedUsed = used - existing.amount;
      const remaining = allocated - adjustedUsed;

      if (newAmount > remaining) {
        throw new Error('Insufficient remaining budget for update');
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

  /* ================= DELETE ================= */
  async deletePlantilla(id) {
    return prisma.$transaction(async (tx) => {

      const existing = await tx.plantilla.findUnique({
        where: { id: Number(id) },
      });

      if (!existing) {
        throw new Error('Plantilla not found');
      }

      await tx.budgetAllocation.update({
        where: { id: existing.budgetAllocationId },
        data: {
          usedAmount: {
            decrement: existing.amount,
          },
        },
      });

      return tx.plantilla.delete({
        where: { id: Number(id) },
      });
    });
  }

  /* ================= GET ALL ================= */
  async getAllPlantilla(fiscalYearId) {

  const fyId = Number(fiscalYearId); // convert to number

  if (!fyId) {
    throw new Error('Fiscal year is required');
  }

  return prisma.plantilla.findMany({
    where: {
      fiscalYearId: fyId,
    },
      include: {
        official: true,
        budgetAllocation: {
          include: {
            classification: true,
            object: true,
            budget: {
              include: {
                fiscalYear: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new SkPlantillaService();