import { db } from '../config/db.config.js';

const CATEGORY_VALUES = ['ADMINISTRATIVE', 'YOUTH'];

const parseCategory = (value, { required = true } = {}) => {
  if (value === undefined || value === null || value === '') {
    if (required) {
      throw new Error('Category is required (ADMINISTRATIVE or YOUTH)');
    }
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new Error('Invalid category. Use ADMINISTRATIVE or YOUTH');
  }

  const normalized = value.trim().toUpperCase();
  if (!CATEGORY_VALUES.includes(normalized)) {
    throw new Error('Invalid category. Use ADMINISTRATIVE or YOUTH');
  }

  return normalized;
};

const getCategoryCap = (budget, category) =>
  category === 'ADMINISTRATIVE'
    ? Number(budget.administrativeAmount)
    : Number(budget.youthAmount);

const assertCategoryLimitWithinBudget = async ({
  budget,
  budgetId,
  category,
  limitAmount,
  excludeLimitId,
}) => {
  const cap = getCategoryCap(budget, category);

  if (Number(limitAmount) > cap) {
    throw new Error(
      `Limit amount cannot exceed ${category.toLowerCase()} budget (${cap})`
    );
  }

  const usedLimits = await db.budgetClassificationLimit.aggregate({
    where: {
      budgetId: Number(budgetId),
      category,
      ...(excludeLimitId && { id: { not: Number(excludeLimitId) } }),
    },
    _sum: { limitAmount: true },
  });

  const remaining = cap - Number(usedLimits._sum.limitAmount || 0);
  if (Number(limitAmount) > remaining) {
    throw new Error(
      `Limit amount exceeds remaining ${category.toLowerCase()} budget. Remaining budget: ${remaining}`
    );
  }
};

/* ======================================================
   CREATE BUDGET CLASSIFICATION LIMIT
====================================================== */
export const createClassificationLimitService = async (data) => {
  const { budgetId, classificationId, limitAmount, category: rawCategory } = data;
  const category = parseCategory(rawCategory);

  if (!Number.isInteger(Number(budgetId))) {
    throw new Error('Invalid budgetId');
  }

  if (!Number.isInteger(Number(classificationId))) {
    throw new Error('Invalid classificationId');
  }

  if (limitAmount === undefined || !Number.isFinite(Number(limitAmount))) {
    throw new Error('Invalid limit amount');
  }

  if (Number(limitAmount) <= 0) {
    throw new Error('Limit amount must be greater than zero');
  }

  const budget = await db.budget.findFirst({
    where: { id: Number(budgetId), deletedAt: null },
  });

  if (!budget) {
    throw new Error('Budget not found');
  }

  const classification = await db.budgetClassification.findFirst({
    where: { id: Number(classificationId), deletedAt: null },
  });

  if (!classification) {
    throw new Error('Classification not found');
  }

  if (!classification.allowedCategories?.includes(category)) {
    throw new Error('Classification is not assigned to this category');
  }

  const existingLimit = await db.budgetClassificationLimit.findUnique({
    where: {
      budgetId_classificationId_category: {
        budgetId: Number(budgetId),
        classificationId: Number(classificationId),
        category,
      },
    },
  });

  if (existingLimit) {
    throw new Error('Budget limit for this classification already exists');
  }

  await assertCategoryLimitWithinBudget({
    budget,
    budgetId,
    category,
    limitAmount: Number(limitAmount),
  });

  return db.budgetClassificationLimit.create({
    data: {
      budgetId: Number(budgetId),
      classificationId: Number(classificationId),
      category,
      limitAmount: Number(limitAmount),
    },
    include: {
      budget: {
        select: {
          id: true,
          totalAmount: true,
          administrativeAmount: true,
          youthAmount: true,
          fiscalYear: { select: { id: true, year: true } },
        },
      },
      classification: { select: { id: true, code: true, name: true } },
    },
  });
};

/* ======================================================
   GET ALL CLASSIFICATION LIMITS
====================================================== */
export const getClassificationLimitsService = async (budgetId, rawCategory) => {
  const category = parseCategory(rawCategory, { required: false });
  const whereClause = budgetId ? { budgetId: Number(budgetId) } : {};

  if (category) whereClause.category = category;

  return db.budgetClassificationLimit.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      budget: {
        select: {
          id: true,
          totalAmount: true,
          administrativeAmount: true,
          youthAmount: true,
          fiscalYear: { select: { id: true, year: true } },
        },
      },
      classification: { select: { id: true, code: true, name: true } },
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
          administrativeAmount: true,
          youthAmount: true,
          fiscalYear: { select: { id: true, year: true } },
        },
      },
      classification: { select: { id: true, code: true, name: true } },
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
  const nextCategory = parseCategory(data.category, { required: false });

  if (limitAmount === undefined) {
    throw new Error('No data provided for update');
  }

  if (!Number.isFinite(Number(limitAmount)) || Number(limitAmount) <= 0) {
    throw new Error('Limit amount must be greater than zero');
  }

  const existingLimit = await db.budgetClassificationLimit.findFirst({
    where: { id: Number(id) },
    include: {
      budget: true,
      classification: true,
    },
  });

  if (!existingLimit) {
    throw new Error('Classification limit not found');
  }

  const targetCategory = nextCategory || existingLimit.category;

  if (!existingLimit.classification.allowedCategories?.includes(targetCategory)) {
    throw new Error('Classification is not assigned to this category');
  }

  if (nextCategory) {
    const duplicate = await db.budgetClassificationLimit.findUnique({
      where: {
        budgetId_classificationId_category: {
          budgetId: existingLimit.budgetId,
          classificationId: existingLimit.classificationId,
          category: targetCategory,
        },
      },
    });

    if (duplicate && duplicate.id !== Number(id)) {
      throw new Error('Budget limit for this classification already exists');
    }
  }

  await assertCategoryLimitWithinBudget({
    budget: existingLimit.budget,
    budgetId: existingLimit.budgetId,
    category: targetCategory,
    limitAmount: Number(limitAmount),
    excludeLimitId: id,
  });

  return db.budgetClassificationLimit.update({
    where: { id: Number(id) },
    data: {
      limitAmount: Number(limitAmount),
      ...(nextCategory && { category: nextCategory }),
    },
    include: {
      budget: {
        select: {
          id: true,
          totalAmount: true,
          administrativeAmount: true,
          youthAmount: true,
          fiscalYear: { select: { id: true, year: true } },
        },
      },
      classification: { select: { id: true, code: true, name: true } },
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

  const hasAllocations = limit.classification.allocations.some(
    (allocation) =>
      allocation.budgetId === limit.budgetId &&
      allocation.category === limit.category
  );

  if (hasAllocations) {
    throw new Error('Cannot delete limit with existing budget allocations');
  }

  return db.budgetClassificationLimit.delete({
    where: { id: Number(id) },
  });
};

/* ======================================================
   GET LIMITS BY CLASSIFICATION ID
====================================================== */
export const getLimitsByClassificationService = async (
  classificationId,
  rawCategory
) => {
  const category = parseCategory(rawCategory, { required: false });

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
    where: {
      classificationId: Number(classificationId),
      ...(category && { category }),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      budget: {
        select: {
          id: true,
          totalAmount: true,
          administrativeAmount: true,
          youthAmount: true,
          fiscalYear: { select: { id: true, year: true } },
        },
      },
      classification: { select: { id: true, code: true, name: true } },
    },
  });

  return { classification, limits };
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

  const byCategory = await Promise.all(
    CATEGORY_VALUES.map(async (category) => {
      const grouped = await db.budgetClassificationLimit.aggregate({
        where: { budgetId: Number(budgetId), category },
        _sum: { limitAmount: true },
      });

      const cap = getCategoryCap(budget, category);
      const totalAllocated = Number(grouped._sum.limitAmount || 0);

      return {
        category,
        cap,
        totalAllocated,
        remaining: cap - totalAllocated,
      };
    })
  );

  const totalAllocated = Number(usedLimits._sum.limitAmount || 0);
  const remaining = Number(budget.totalAmount) - totalAllocated;

  return {
    budgetId: budget.id,
    totalAmount: Number(budget.totalAmount),
    administrativeAmount: Number(budget.administrativeAmount),
    youthAmount: Number(budget.youthAmount),
    totalAllocated,
    remaining,
    byCategory,
  };
};
