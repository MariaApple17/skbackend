import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class SkPlantillaService {

  /* ======================================================
     CREATE PLANTILLA
  ====================================================== */
  async createPlantilla(payload) {
    return prisma.$transaction(async (tx) => {

      const officialId = Number(payload.officialId);
      const budgetAllocationId = Number(payload.budgetAllocationId);
      const amount = Number(payload.amount);

      if (!officialId || !budgetAllocationId || !amount || amount <= 0) {
        throw new Error('Invalid input data');
      }

      // Get allocation with fiscal year relation
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

      // Enforce active fiscal year
      const activeFiscal = await tx.fiscalYear.findFirst({
        where: { isActive: true, deletedAt: null },
      });

      if (!activeFiscal) {
        throw new Error('No active fiscal year');
      }

      if (allocation.budget.fiscalYearId !== activeFiscal.id) {
        throw new Error('Allocation not in active fiscal year');
      }

      const allocated = Number(allocation.allocatedAmount);
      const used = Number(allocation.usedAmount);
      const remaining = allocated - used;

      if (amount > remaining) {
        throw new Error(`Insufficient budget. Remaining: ₱${remaining}`);
      }

      // Create plantilla
      const created = await tx.plantilla.create({
        data: {
          officialId,
          budgetAllocationId,
          amount,
          periodCovered: payload.periodCovered,
          remarks: payload.remarks,
        },
        include: {
          official: true,
          budgetAllocation: {
            include: {
              classification: true,
              object: true,
              program: true,
            },
          },
        },
      });

      // Update used amount
      await tx.budgetAllocation.update({
        where: { id: budgetAllocationId },
        data: {
          usedAmount: { increment: amount },
        },
      });

      return created;
    });
  }

  /* ======================================================
     GET ALL BY FISCAL YEAR
  ====================================================== */
  async getAllByFiscalYear(fiscalYearId) {
    if (!fiscalYearId) {
      throw new Error('Fiscal year is required');
    }

    return prisma.plantilla.findMany({
      where: {
        budgetAllocation: {
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
            program: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new SkPlantillaService();