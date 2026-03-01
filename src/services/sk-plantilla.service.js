import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class SkPlantillaService {

  async createPlantilla(data) {
    return prisma.$transaction(async (tx) => {

      const officialId = Number(data.officialId);
      const budgetAllocationId = Number(data.budgetAllocationId);
      const amount = Number(data.amount);

      if (!officialId || !budgetAllocationId || !amount) {
        throw new Error('Invalid input data');
      }

      const budget = await tx.budgetAllocation.findFirst({
        where: {
          id: budgetAllocationId,
          deletedAt: null,
        },
      });
      const activeYear = await tx.fiscalYear.findFirst({
  where: {
    isActive: true,
    deletedAt: null,
  },
});

if (!activeYear) {
  throw new Error("No active fiscal year found");
}

      if (!budget) {
        throw new Error('Budget allocation not found');
      }

      const allocated = parseFloat(budget.allocatedAmount.toString());
      const used = parseFloat(budget.usedAmount.toString());
      const remaining = allocated - used;

      if (amount > remaining) {
        throw new Error(
          `Insufficient remaining budget. Remaining: ₱${remaining.toLocaleString()}`
        );
      }
const plantilla = await tx.plantilla.create({
  data: {
    officialId,
    budgetAllocationId,
    fiscalYearId: activeYear.id,   // ✅ ADD THIS
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

      const existing = await tx.plantilla.findUnique({
        where: { id: Number(id) },
      });

      if (!existing) {
        throw new Error('Plantilla not found');
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

      const allocated = parseFloat(budget.allocatedAmount.toString());
      const used = parseFloat(budget.usedAmount.toString());

      // remove old amount before recalculating
      const adjustedUsed = used - existing.amount;
      const remaining = allocated - adjustedUsed;

      const newAmount = Number(data.amount);

      if (newAmount > remaining) {
        throw new Error('Insufficient budget for update');
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
          ...data,
          amount: newAmount,
        },
      });
    });
  }

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

  async getAllPlantilla() {

  // 1️⃣ Get active fiscal year
  const activeYear = await prisma.fiscalYear.findFirst({
    where: {
      isActive: true,
      deletedAt: null,
    },
  });

  if (!activeYear) {
    throw new Error("No active fiscal year found");
  }
  

  // 2️⃣ Only get plantilla for that year
  return prisma.plantilla.findMany({
    where: {
      fiscalYearId: activeYear.id,
    },
    include: {
      official: true,
      budgetAllocation: {
        include: {
          classification: true,
          object: true,
           fiscalYearId: activeYear.id, 
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
}

export default new SkPlantillaService();