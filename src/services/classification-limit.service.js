import { db } from '../config/db.config.js';

/* ======================================================
   CREATE BUDGET CLASSIFICATION LIMIT
====================================================== */
export const createClassificationLimitService = async (data) => {
  const { budgetId, classificationId, limitAmount } = data;

  /* ================= BASIC VALIDATION ================= */
  if (!Number.isInteger(Number(budgetId))) {
    throw new Error('Invalid budgetId');
  }

  if (!Number.isInteger(Number(classificationId))) {
    throw new Error('Invalid classificationId');
  }

  if (
    limitAmount === undefined ||
    !Number.isFinite(Number(limitAmount))
  ) {
    throw new Error('Invalid limit amount');
  }

  if (Number(limitAmount) <= 0) {
    throw new Error('Limit amount must be greater than zero');
  }

  /* ================= BUDGET CHECK ================= */
  const budget = await db.budget.findFirst({
    where: {
      id: Number(budgetId),
      deletedAt: null,
    },
  });

  if (!budget) {
    throw new Error('Budget not found');
  }

  /* ================= CLASSIFICATION CHECK ================= */
  const classification = await db.budgetClassification.findFirst({
    where: {
      id: Number(classificationId),
      deletedAt: null,
    },
  });

  if (!classification) {
    throw new Error('Classification not found');
  }

  /* ================= DUPLICATE CHECK ================= */
  const existingLimit = await db.budgetClassificationLimit.findUnique({
    where: {
      budgetId_classificationId: {
        budgetId: Number(budgetId),
        classificationId: Number(classificationId),
      },
    },
  });

  if (existingLimit) {
    throw new Error(
      'Budget limit for this classification already exists'
    );
  }

  /* ================= TOTAL BUDGET VALIDATION ================= */
  if (Number(limitAmount) > Number(budget.totalAmount)) {
    throw new Error(
      `Limit amount cannot exceed total budget amount (${Number(
        budget.totalAmount
      )})`
    );
  }

  /* ================= REMAINING BUDGET CHECK ================= */
  const usedLimits = await db.budgetClassificationLimit.aggregate({
    where: { budgetId: Number(budgetId) },
    _sum: { limitAmount: true },
  });

  const remainingBudget =
    Number(budget.totalAmount) -
    Number(usedLimits._sum.limitAmount || 0);

  if (Number(limitAmount) > remainingBudget) {
    throw new Error(
      `Limit amount exceeds remaining budget. Remaining budget: ${remainingBudget}`
    );
  }

  /* ================= CREATE LIMIT ================= */
  return db.budgetClassificationLimit.create({
    data: {
      budgetId: Number(budgetId),
      classificationId: Number(classificationId),
      limitAmount: Number(limitAmount),
    },
    include: {
      budget: {
        select: {
          id: true,
          totalAmount: true,
          fiscalYear: {
            select: {
              id: true,
              year: true,
            },
          },
        },
      },
      classification: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
  });
};

/* ======================================================
   GET ALL CLASSIFICATION LIMITS
====================================================== */
export const getClassificationLimitsService = async (budgetId) => {
  const whereClause = budgetId
    ? { budgetId: Number(budgetId) }
    : {};

  return db.budgetClassificationLimit.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      budget: {
        select: {
          id: true,
          totalAmount: true,
          fiscalYear: {
            select: {
              id: true,
              year: true,
            },
          },
        },
      },
      classification: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
  });
};

/* ======================================================
   GET CLASSIFICATION LIMIT BY ID
====================================================== */
export const getClassificationLimitByIdService = async (id) => {
  if (!Number.isInteger(Number(id))) {
    throw new Error('Invalid limit id');
  }

  const limit = await db.budgetClassificationLimit.findFirst({
    where: { id: Number(id) },
    include: {
      budget: {
        select: {
          id: true,
          totalAmount: true,
          fiscalYear: {
            select: {
              id: true,
              year: true,
            },
          },
        },
      },
      classification: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
  });

  if (!limit) {
    throw new Error('Classification limit not found');
  }

  return limit;
};

/* ======================================================
   UPDATE CLASSIFICATION LIMIT
====================================================== */
export const updateClassificationLimitService = async (id, data) => {
  if (!Number.isInteger(Number(id))) {
    throw new Error('Invalid limit id');
  }

  const { limitAmount } = data;

  if (limitAmount === undefined) {
    throw new Error('No data provided for update');
  }

  if (
    !Number.isFinite(Number(limitAmount)) ||
    Number(limitAmount) <= 0
  ) {
    throw new Error('Limit amount must be greater than zero');
  }

  /* ================= GET EXISTING LIMIT ================= */
  const existingLimit = await db.budgetClassificationLimit.findFirst({
    where: { id: Number(id) },
    include: {
      budget: true,
    },
  });

  if (!existingLimit) {
    throw new Error('Classification limit not found');
  }

  /* ================= TOTAL BUDGET VALIDATION ================= */
  if (Number(limitAmount) > Number(existingLimit.budget.totalAmount)) {
    throw new Error(
      `Limit amount cannot exceed total budget amount (${Number(
        existingLimit.budget.totalAmount
      )})`
    );
  }

  /* ================= REMAINING BUDGET CHECK ================= */
  const usedLimits = await db.budgetClassificationLimit.aggregate({
    where: {
      budgetId: existingLimit.budgetId,
      id: { not: Number(id) },
    },
    _sum: { limitAmount: true },
  });

  const remainingBudget =
    Number(existingLimit.budget.totalAmount) -
    Number(usedLimits._sum.limitAmount || 0);

  if (Number(limitAmount) > remainingBudget) {
    throw new Error(
      `Limit amount exceeds remaining budget. Remaining budget: ${remainingBudget}`
    );
  }

  /* ================= UPDATE LIMIT ================= */
  return db.budgetClassificationLimit.update({
    where: { id: Number(id) },
    data: {
      limitAmount: Number(limitAmount),
    },
    include: {
      budget: {
        select: {
          id: true,
          totalAmount: true,
          fiscalYear: {
            select: {
              id: true,
              year: true,
            },
          },
        },
      },
      classification: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
  });
};

/* ======================================================
   DELETE CLASSIFICATION LIMIT
====================================================== */
export const deleteClassificationLimitService = async (id) => {
  if (!Number.isInteger(Number(id))) {
    throw new Error('Invalid limit id');
  }

  const limit = await db.budgetClassificationLimit.findFirst({
    where: { id: Number(id) },
    include: {
      classification: {
        include: {
          allocations: {
            where: { deletedAt: null },
          },
        },
      },
    },
  });

  if (!limit) {
    throw new Error('Classification limit not found');
  }

  /* ================= CHECK FOR ALLOCATIONS ================= */
  const hasAllocations = limit.classification.allocations.some(
    (allocation) => allocation.budgetId === limit.budgetId
  );

  if (hasAllocations) {
    throw new Error(
      'Cannot delete limit with existing budget allocations'
    );
  }

  return db.budgetClassificationLimit.delete({
    where: { id: Number(id) },
  });
};

/* ======================================================
   GET LIMITS BY CLASSIFICATION ID
====================================================== */
export const getLimitsByClassificationService = async (classificationId) => {
  if (!Number.isInteger(Number(classificationId))) {
    throw new Error('Invalid classificationId');
  }

  const classification = await db.budgetClassification.findFirst({
    where: {
      id: Number(classificationId),
      deletedAt: null,
    },
  });

  if (!classification) {
    throw new Error('Classification not found');
  }

  const limits = await db.budgetClassificationLimit.findMany({
    where: { classificationId: Number(classificationId) },
    orderBy: { createdAt: 'desc' },
    include: {
      budget: {
        select: {
          id: true,
          totalAmount: true,
          fiscalYear: {
            select: {
              id: true,
              year: true,
            },
          },
        },
      },
      classification: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
  });

  return {
    classification,
    limits,
  };
};

/* ======================================================
   GET REMAINING BUDGET FOR A BUDGET ID
====================================================== */
export const getRemainingBudgetService = async (budgetId) => {
  if (!Number.isInteger(Number(budgetId))) {
    throw new Error('Invalid budgetId');
  }

  const budget = await db.budget.findFirst({
    where: {
      id: Number(budgetId),
      deletedAt: null,
    },
  });

  if (!budget) {
    throw new Error('Budget not found');
  }

  const usedLimits = await db.budgetClassificationLimit.aggregate({
    where: { budgetId: Number(budgetId) },
    _sum: { limitAmount: true },
  });

  const totalAllocated = Number(usedLimits._sum.limitAmount || 0);
  const remaining = Number(budget.totalAmount) - totalAllocated;

  return {
    budgetId: budget.id,
    totalAmount: Number(budget.totalAmount),
    totalAllocated,
    remaining,
  };
};