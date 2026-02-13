import { db } from '../config/db.config.js';

/* ======================================================
   CREATE TOTAL BUDGET
====================================================== */
export const createBudgetService = async (data) => {
  const { fiscalYearId, totalAmount } = data;

  // ❌ Prevent duplicate budget per fiscal year
  const existing = await db.budget.findFirst({
    where: {
      fiscalYearId,
      deletedAt: null
    }
  });

  if (existing) {
    throw new Error('Budget for this fiscal year already exists');
  }

  return db.budget.create({
    data: {
      fiscalYearId,
      totalAmount
    }
  });
};

/* ======================================================
   GET ALL BUDGETS
====================================================== */
export const getAllBudgetsService = async () => {
  return db.budget.findMany({
    where: { deletedAt: null },
    include: {
      fiscalYear: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

/* ======================================================
   GET SINGLE BUDGET
====================================================== */
export const getBudgetByIdService = async (id) => {
  return db.budget.findFirst({
    where: {
      id: Number(id),
      deletedAt: null
    },
    include: {
      fiscalYear: true,
      allocations: true
    }
  });
};

/* ======================================================
   UPDATE TOTAL BUDGET
====================================================== */
export const updateBudgetService = async (id, data) => {
  return db.budget.update({
    where: { id: Number(id) },
    data
  });
};

/* ======================================================
   SOFT DELETE BUDGET
====================================================== */
export const deleteBudgetService = async (id) => {
  return db.budget.update({
    where: { id: Number(id) },
    data: {
      deletedAt: new Date()
    }
  });
};
