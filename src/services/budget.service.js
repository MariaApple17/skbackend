import { db } from '../config/db.config.js';

const toAmount = (value, label) => {
  if (!Number.isFinite(Number(value))) {
    throw new Error(`${label} must be a valid number`);
  }

  const parsed = Number(value);
  if (parsed < 0) {
    throw new Error(`${label} cannot be negative`);
  }

  return parsed;
};

const assertTopLevelSplit = ({
  totalAmount,
  administrativeAmount,
  youthAmount,
}) => {
  const total = toAmount(totalAmount, 'Total amount');
  const administrative = toAmount(
    administrativeAmount,
    'Administrative amount'
  );
  const youth = toAmount(youthAmount, 'Youth amount');

  if (administrative + youth !== total) {
    throw new Error(
      'Administrative amount plus youth amount must equal total amount'
    );
  }

  return {
    totalAmount: total,
    administrativeAmount: administrative,
    youthAmount: youth,
  };
};

/* ======================================================
   CREATE TOTAL BUDGET
====================================================== */
export const createBudgetService = async (data) => {
  const { fiscalYearId, totalAmount, administrativeAmount, youthAmount } = data;

  if (!Number.isInteger(Number(fiscalYearId))) {
    throw new Error('Invalid fiscalYearId');
  }

  const parsed = assertTopLevelSplit({
    totalAmount,
    administrativeAmount,
    youthAmount,
  });

  const existing = await db.budget.findFirst({
    where: {
      fiscalYearId: Number(fiscalYearId),
      deletedAt: null,
    },
  });

  if (existing) {
    throw new Error('Budget for this fiscal year already exists');
  }

  return db.budget.create({
    data: {
      fiscalYearId: Number(fiscalYearId),
      totalAmount: parsed.totalAmount,
      administrativeAmount: parsed.administrativeAmount,
      youthAmount: parsed.youthAmount,
    },
  });
};

/* ======================================================
   GET ALL BUDGETS
====================================================== */
export const getAllBudgetsService = async () => {
  return db.budget.findMany({
    where: { deletedAt: null },
    include: {
      fiscalYear: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

/* ======================================================
   GET SINGLE BUDGET
====================================================== */
export const getBudgetByIdService = async (id) => {
  return db.budget.findFirst({
    where: {
      id: Number(id),
      deletedAt: null,
    },
    include: {
      fiscalYear: true,
      allocations: true,
    },
  });
};

/* ======================================================
   UPDATE TOTAL BUDGET
====================================================== */
export const updateBudgetService = async (id, data) => {
  const budgetId = Number(id);
  if (!Number.isInteger(budgetId)) {
    throw new Error('Invalid budget id');
  }

  const existing = await db.budget.findFirst({
    where: { id: budgetId, deletedAt: null },
  });

  if (!existing) {
    throw new Error('Budget not found');
  }

  const nextTotalAmount =
    data.totalAmount !== undefined ? data.totalAmount : existing.totalAmount;
  const nextAdministrativeAmount =
    data.administrativeAmount !== undefined
      ? data.administrativeAmount
      : existing.administrativeAmount;
  const nextYouthAmount =
    data.youthAmount !== undefined ? data.youthAmount : existing.youthAmount;

  const parsed = assertTopLevelSplit({
    totalAmount: nextTotalAmount,
    administrativeAmount: nextAdministrativeAmount,
    youthAmount: nextYouthAmount,
  });

  return db.budget.update({
    where: { id: budgetId },
    data: parsed,
  });
};

/* ======================================================
   SOFT DELETE BUDGET
====================================================== */
export const deleteBudgetService = async (id) => {
  return db.budget.update({
    where: { id: Number(id) },
    data: {
      deletedAt: new Date(),
    },
  });
};
