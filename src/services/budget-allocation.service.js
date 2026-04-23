import { db } from '../config/db.config.js';
import {
  BUDGET_REFERENCE_CLASSIFICATIONS,
  BUDGET_REFERENCE_OBJECTS_OF_EXPENDITURE,
} from '../constants/budget-reference.constant.js';

/* ================= HELPERS ================= */
const normalizePositiveInt = (value, fieldName) => {
  const normalized = Number(value);

  if (!Number.isInteger(normalized) || normalized <= 0) {
    throw new Error(`Invalid ${fieldName}`);
  }

  return normalized;
};

const assertExists = async (model, where, label) => {
  const record = await model.findFirst({ where });
  if (!record) {
    throw new Error(`${label} not found`);
  }
  return record;
};

const assertPositiveAmount = (amount) => {
  if (amount === undefined || amount === null) return;
  if (isNaN(amount) || Number(amount) <= 0) {
    throw new Error('Allocated amount must be a positive number');
  }
};

const assertProgramIsUpcoming = async (programId) => {
  const normalizedProgramId = normalizePositiveInt(
    programId,
    'program ID'
  );

  const program = await assertExists(
    db.program,
    { id: normalizedProgramId, deletedAt: null },
    'Program'
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = program.startDate
    ? new Date(program.startDate)
    : null;

  if (!startDate) {
    throw new Error(
      'Program must have a start date before allocating budget.'
    );
  }

  startDate.setHours(0, 0, 0, 0);

  if (today >= startDate) {
    throw new Error(
      'Budget allocation is only allowed for UPCOMING programs.'
    );
  }

  return program;
};

const assertObjectMatchesClassification = async (
  objectOfExpenditureId,
  classificationId
) => {
  const normalizedObjectOfExpenditureId = normalizePositiveInt(
    objectOfExpenditureId,
    'object of expenditure ID'
  );
  const normalizedClassificationId = normalizePositiveInt(
    classificationId,
    'classification ID'
  );

  const object = await assertExists(
    db.objectOfExpenditure,
    {
      id: normalizedObjectOfExpenditureId,
      deletedAt: null,
    },
    'Object of expenditure'
  );

  if (
    Number(object.classificationId) !==
    normalizedClassificationId
  ) {
    throw new Error(
      'Selected object does not belong to the selected classification.'
    );
  }

  return object;
};

const resolveHardcodedReferenceSelection = async ({
  classificationId,
  objectId,
}) => {
  const normalizedClassificationId = normalizePositiveInt(
    classificationId,
    'classificationId'
  );
  const normalizedObjectId = normalizePositiveInt(
    objectId,
    'objectId'
  );

  console.log('[budget-allocation.service] received reference payload', {
    classificationId: normalizedClassificationId,
    objectId: normalizedObjectId,
  });

  const referenceClassification =
    BUDGET_REFERENCE_CLASSIFICATIONS.find(
      (item) => item.id === normalizedClassificationId
    );

  if (!referenceClassification) {
    throw new Error('Invalid classification');
  }

  const referenceObject =
    BUDGET_REFERENCE_OBJECTS_OF_EXPENDITURE.find(
      (item) =>
        item.id === normalizedObjectId &&
        item.classificationId === normalizedClassificationId
    );

  console.log(
    '[budget-allocation.service] matched reference object',
    referenceObject ?? null
  );

  if (!referenceObject) {
    throw new Error('Object of expenditure not found');
  }

  const databaseClassification = await db.budgetClassification.findFirst({
    where: {
      code: referenceClassification.code,
      deletedAt: null,
    },
  });

  if (!databaseClassification) {
    throw new Error(
      `Backend classification "${referenceClassification.code}" is missing. Run prisma db seed.`
    );
  }

  const databaseObject = await db.objectOfExpenditure.findFirst({
    where: {
      code: referenceObject.code,
      classificationId: databaseClassification.id,
      deletedAt: null,
    },
  });

  if (!databaseObject) {
    throw new Error(
      `Backend object "${referenceObject.code}" is missing. Run prisma db seed.`
    );
  }

  return {
    classification: databaseClassification,
    object: databaseObject,
    referenceClassification,
    referenceObject,
  };
};

const resolveAllocationForeignKeys = async (payload) => {
  const usesReferenceIds =
    payload.objectId !== undefined &&
    payload.objectId !== null &&
    payload.objectId !== '';

  if (usesReferenceIds) {
    const resolvedReference =
      await resolveHardcodedReferenceSelection({
        classificationId: payload.classificationId,
        objectId: payload.objectId,
      });

    return {
      budgetId: normalizePositiveInt(payload.budgetId, 'budget ID'),
      programId:
        payload.programId === undefined ||
        payload.programId === null ||
        payload.programId === ''
          ? null
          : normalizePositiveInt(payload.programId, 'program ID'),
      classificationId: resolvedReference.classification.id,
      objectOfExpenditureId: resolvedReference.object.id,
      referenceClassification: resolvedReference.referenceClassification,
      referenceObject: resolvedReference.referenceObject,
    };
  }

  return {
    budgetId: normalizePositiveInt(payload.budgetId, 'budget ID'),
    programId:
      payload.programId === undefined ||
      payload.programId === null ||
      payload.programId === ''
        ? null
        : normalizePositiveInt(payload.programId, 'program ID'),
    classificationId: normalizePositiveInt(
      payload.classificationId,
      'classification ID'
    ),
    objectOfExpenditureId: normalizePositiveInt(
      payload.objectOfExpenditureId,
      'object of expenditure ID'
    ),
    referenceClassification: null,
    referenceObject: null,
  };
};

const ensureNoDuplicateObjectAllocation = async ({
  budgetId,
  classificationId,
  category,
  objectOfExpenditureId,
  excludeAllocationId = null,
}) => {
  const where = {
    budgetId: Number(budgetId),
    classificationId: Number(classificationId),
    category,
    objectOfExpenditureId: Number(objectOfExpenditureId),
    deletedAt: null,
  };

  if (excludeAllocationId) {
    where.id = {
      not: Number(excludeAllocationId),
    };
  }

  const duplicate = await db.budgetAllocation.findFirst({
    where,
  });

  if (duplicate) {
    throw new Error(
      'This object already has an allocated budget for the selected budget, classification, and category.'
    );
  }
};

/**
 * Validate allocation against classification limit
 */
const validateClassificationLimit = async ({
  budgetId,
  classificationId,
  category,
  allocatedAmount,
  excludeAllocationId = null,
}) => {
  const classificationLimit =
    await db.budgetClassificationLimit.findUnique({
      where: {
        budgetId_classificationId_category: {
          budgetId: Number(budgetId),
          classificationId: Number(classificationId),
          category,
        },
      },
    });

  if (!classificationLimit) {
    throw new Error(
      'Classification limit not set for this budget and category.'
    );
  }

  const whereClause = {
    budgetId: Number(budgetId),
    classificationId: Number(classificationId),
    category,
    deletedAt: null,
  };

  if (excludeAllocationId) {
    whereClause.id = { not: excludeAllocationId };
  }

  const allocatedSoFar = await db.budgetAllocation.aggregate({
    where: whereClause,
    _sum: { allocatedAmount: true },
  });

  const totalAllocated =
    Number(allocatedSoFar._sum.allocatedAmount || 0);

  const remaining =
    Number(classificationLimit.limitAmount) - totalAllocated;

  if (Number(allocatedAmount) > remaining) {
    throw new Error(
      `Allocated amount exceeds remaining classification limit. Remaining: ₱${remaining.toLocaleString()}`
    );
  }

  return { classificationLimit, totalAllocated, remaining };
};

export const createBudgetAllocation = async (payload) => {
  const {
    category,
    allocatedAmount,
  } = payload;
  const resolvedForeignKeys =
    await resolveAllocationForeignKeys(payload);
  const {
    budgetId,
    programId,
    classificationId,
    objectOfExpenditureId,
    referenceObject,
  } = resolvedForeignKeys;

  /* ---------------- REQUIRED FIELDS ---------------- */
  if (
    !budgetId ||
    !classificationId ||
    !category ||
    !objectOfExpenditureId ||
    allocatedAmount === undefined
  ) {
    throw new Error('Missing required fields');
  }

  // ✅ Program required ONLY for YOUTH
  if (category === 'YOUTH' && !programId) {
    throw new Error('Program is required for YOUTH category');
  }

  assertPositiveAmount(allocatedAmount);
  payload.object = referenceObject ?? null;

  /* ---------------- FK VALIDATION ---------------- */
  await assertExists(db.budget, { id: budgetId, deletedAt: null }, 'Budget');

  const classification = await assertExists(
    db.budgetClassification,
    { id: classificationId, deletedAt: null },
    'Budget classification'
  );

  if (
    classification.allowedCategories?.length &&
    !classification.allowedCategories.includes(category)
  ) {
    throw new Error(
      'Selected classification is not allowed for this category.'
    );
  }

  if (category === 'YOUTH') {
    await assertProgramIsUpcoming(programId);
  }

  await assertObjectMatchesClassification(
    objectOfExpenditureId,
    classificationId
  );

  await ensureNoDuplicateObjectAllocation({
    budgetId,
    classificationId,
    category,
    objectOfExpenditureId,
  });

  /* ---------------- CLASSIFICATION LIMIT CHECK ---------------- */
  await validateClassificationLimit({
    budgetId,
    classificationId,
    category,
    allocatedAmount,
  });

  /* ---------------- CREATE ---------------- */
  return db.budgetAllocation.create({
    data: {
      budgetId,
      programId: category === 'ADMINISTRATIVE' ? null : programId,
      classificationId,
      category,
      objectOfExpenditureId,
      allocatedAmount,
    },
    include: {
      budget: { include: { fiscalYear: true } },
      program: true,
      classification: true,
      object: true,
    },
  });
};


/* ================= GET ALL (SEARCH | FILTER | PAGINATION | SORT) ================= */
export const getAllBudgetAllocations = async (params = {}) => {
  const {
    search,
    budgetId,
    fiscalYearId, // ✅ ADD THIS
    programId,
    classificationId,
    objectOfExpenditureId,
    category,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;

  /* ================= SAFE PAGINATION ================= */
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  const safePage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;
  const safeLimit =
    Number.isFinite(parsedLimit) && parsedLimit > 0
      ? parsedLimit
      : 10;
  const skip = (safePage - 1) * safeLimit;

  /* ================= SAFE SORT ================= */
  const ALLOWED_SORT_FIELDS = ['createdAt', 'allocatedAmount'];
  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
  const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

  /* ================= WHERE ================= */
  /* ================= WHERE ================= */
const where = {
  deletedAt: null,
  budget: {
    is: {
      deletedAt: null,
      ...(Number.isFinite(Number(fiscalYearId)) && {
        fiscalYearId: Number(fiscalYearId),
      }),
    },
  },
};


  if (Number.isFinite(Number(programId))) {
    where.programId = Number(programId);
  }

  if (Number.isFinite(Number(budgetId))) {
    where.budgetId = Number(budgetId);
  }

  if (Number.isFinite(Number(classificationId))) {
    where.classificationId = Number(classificationId);
  }

  if (Number.isFinite(Number(objectOfExpenditureId))) {
    where.objectOfExpenditureId = Number(
      objectOfExpenditureId
    );
  }

  if (category) {
  where.category = category;
}

  if (search && search.trim()) {
     where.OR = [
  {
    program: {
      is: {
        name: { contains: search, mode: 'insensitive' }
      }
    }
  },
  {
    program: {
      is: {
        code: { contains: search, mode: 'insensitive' }
      }
    }
  },
  {
    classification: {
      is: {
        name: { contains: search, mode: 'insensitive' }
      }
    }
  },
  {
    classification: {
      is: {
        code: { contains: search, mode: 'insensitive' }
      }
    }
  },
  {
    object: {
      is: {
        name: { contains: search, mode: 'insensitive' }
      }
    }
  },
  {
    object: {
      is: {
        code: { contains: search, mode: 'insensitive' }
      }
    }
  }
];
  }

  /* ================= QUERY ================= */
  const [data, total] = await Promise.all([
    db.budgetAllocation.findMany({
      where,
      include: {
        budget: { include: { fiscalYear: true } },
        program: true,
        classification: true,
        object: true,
      },
      orderBy: { [safeSortBy]: safeSortOrder },
      skip,
      take: safeLimit,
    }),
    db.budgetAllocation.count({ where }),
  ]);

  /* ================= RESPONSE ================= */
  return {
    data,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

/* ================= GET BY ID ================= */
export const getBudgetAllocationById = async (id) => {
  if (!id || isNaN(id)) {
    throw new Error('Invalid allocation ID');
  }

  const allocation = await db.budgetAllocation.findFirst({
    where: { id, deletedAt: null },
    include: {
      budget: { include: { fiscalYear: true } },
      program: true,
      classification: true,
      object: true,
      requests: {
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          amount: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!allocation) {
    throw new Error('Budget allocation not found');
  }

  return allocation;
};

/* ================= UPDATE ================= */
export const updateBudgetAllocation = async (id, payload) => {
  if (!id || isNaN(id)) {
    throw new Error('Invalid allocation ID');
  }

  const existing = await assertExists(
    db.budgetAllocation,
    { id, deletedAt: null },
    'Budget allocation'
  );

  const nextCategory =
    payload.category !== undefined
      ? payload.category
      : existing.category;
  const resolvedForeignKeys =
    payload.objectId !== undefined ||
    payload.objectOfExpenditureId !== undefined ||
    payload.classificationId !== undefined ||
    payload.budgetId !== undefined ||
    payload.programId !== undefined
      ? await resolveAllocationForeignKeys({
          budgetId:
            payload.budgetId !== undefined
              ? payload.budgetId
              : existing.budgetId,
          programId:
            nextCategory === 'ADMINISTRATIVE'
              ? null
              : payload.programId !== undefined
                ? payload.programId
                : existing.programId,
          classificationId:
            payload.classificationId !== undefined
              ? payload.classificationId
              : existing.classificationId,
          objectId: payload.objectId,
          objectOfExpenditureId:
            payload.objectOfExpenditureId !== undefined
              ? payload.objectOfExpenditureId
              : existing.objectOfExpenditureId,
        })
      : {
          budgetId: existing.budgetId,
          programId: existing.programId,
          classificationId: existing.classificationId,
          objectOfExpenditureId: existing.objectOfExpenditureId,
        };
  const nextBudgetId = resolvedForeignKeys.budgetId;
  const nextClassificationId = resolvedForeignKeys.classificationId;
  const nextProgramId =
    nextCategory === 'ADMINISTRATIVE'
      ? null
      : resolvedForeignKeys.programId;
  const nextObjectOfExpenditureId =
    resolvedForeignKeys.objectOfExpenditureId;
  const nextAllocatedAmount =
    payload.allocatedAmount !== undefined
      ? Number(payload.allocatedAmount)
      : Number(existing.allocatedAmount);
  const nextUsedAmount =
    payload.usedAmount !== undefined
      ? Number(payload.usedAmount)
      : Number(existing.usedAmount);

  await assertExists(
    db.budget,
    { id: nextBudgetId, deletedAt: null },
    'Budget'
  );

  const classification = await assertExists(
    db.budgetClassification,
    { id: nextClassificationId, deletedAt: null },
    'Budget classification'
  );

  if (
    classification.allowedCategories?.length &&
    !classification.allowedCategories.includes(nextCategory)
  ) {
    throw new Error(
      'Selected classification is not allowed for this category.'
    );
  }

  if (nextCategory === 'YOUTH') {
    if (!nextProgramId) {
      throw new Error('Program is required for YOUTH category');
    }

    await assertProgramIsUpcoming(nextProgramId);
  }

  await assertObjectMatchesClassification(
    nextObjectOfExpenditureId,
    nextClassificationId
  );

  await ensureNoDuplicateObjectAllocation({
    budgetId: nextBudgetId,
    classificationId: nextClassificationId,
    category: nextCategory,
    objectOfExpenditureId: nextObjectOfExpenditureId,
    excludeAllocationId: id,
  });

  /* ---------------- ALLOCATED AMOUNT UPDATE ---------------- */
  assertPositiveAmount(nextAllocatedAmount);

  await validateClassificationLimit({
    budgetId: nextBudgetId,
    classificationId: nextClassificationId,
    category: nextCategory,
    allocatedAmount: nextAllocatedAmount,
    excludeAllocationId: id,
  });

  /* ---------------- USED AMOUNT UPDATE ---------------- */
  if (nextUsedAmount < 0) {
    throw new Error('Used amount cannot be negative');
  }

  if (nextUsedAmount > nextAllocatedAmount) {
    throw new Error('Used amount cannot exceed allocated amount');
  }

  return db.budgetAllocation.update({
    where: { id },
    data: {
      budgetId: nextBudgetId,
      classificationId: nextClassificationId,
      category: nextCategory,
      programId: nextProgramId,
      objectOfExpenditureId: nextObjectOfExpenditureId,
      allocatedAmount: nextAllocatedAmount,
      usedAmount: nextUsedAmount,
    },
    include: {
      budget: { include: { fiscalYear: true } },
      program: true,
      classification: true,
      object: true,
    },
  });
};

/* ================= DELETE (SOFT) ================= */
export const deleteBudgetAllocation = async (id) => {
  if (!id || isNaN(id)) {
    throw new Error('Invalid allocation ID');
  }

  const allocation = await assertExists(
    db.budgetAllocation,
    { id, deletedAt: null },
    'Budget allocation'
  );

  // 🚨 CHECK IF USED IN PROCUREMENT
  const existingRequests = await db.procurementRequest.count({
    where: {
      allocationId: id,
      deletedAt: null,
    },
  });

  if (existingRequests > 0) {
    throw new Error(
      'Cannot delete allocation. It is already used in procurement requests.'
    );
  }

  return db.budgetAllocation.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

/* =====================================================
   REPORT: PROGRAM → CLASSIFICATION → OBJECT TOTALS
===================================================== */
export const getProgramBudgetSummary = async () => {
  const programs = await db.program.findMany({
    where: { deletedAt: null },
    include: {
      allocations: {
        where: { deletedAt: null },
        include: {
          classification: true,
          object: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return programs.map((program) => {
    const classificationMap = {};
    let programAllocated = 0;
    let programUsed = 0;

    program.allocations.forEach((a) => {
      const classId = a.classification.id;

      if (!classificationMap[classId]) {
        classificationMap[classId] = {
          classificationId: a.classification.id,
          classificationCode: a.classification.code,
          classificationName: a.classification.name,
          totalAllocated: 0,
          totalUsed: 0,
          objects: [],
        };
      }

      const allocated = Number(a.allocatedAmount);
      const used = Number(a.usedAmount);

      classificationMap[classId].totalAllocated += allocated;
      classificationMap[classId].totalUsed += used;

      classificationMap[classId].objects.push({
        objectId: a.object.id,
        objectCode: a.object.code,
        objectName: a.object.name,
        allocatedAmount: allocated,
        usedAmount: used,
      });

      programAllocated += allocated;
      programUsed += used;
    });

    return {
      programId: program.id,
      programCode: program.code,
      programName: program.name,
      totalAllocated: programAllocated,
      totalUsed: programUsed,
      classifications: Object.values(classificationMap),
    };
  });
};

/* =====================================================
   GET REMAINING CLASSIFICATION LIMIT FOR ALLOCATION
===================================================== */
export const getRemainingClassificationLimit = async (
  budgetId,
  classificationId,
  category
) => {
  if (!Number.isInteger(Number(budgetId))) {
    throw new Error('Invalid budgetId');
  }

  if (!Number.isInteger(Number(classificationId))) {
    throw new Error('Invalid classificationId');
  }

  if (!category) {
    throw new Error('Category is required');
  }

  const classificationLimit =
    await db.budgetClassificationLimit.findUnique({
      where: {
        budgetId_classificationId_category: {
          budgetId: Number(budgetId),
          classificationId: Number(classificationId),
          category,
        },
      },
      include: {
        classification: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

  if (!classificationLimit) {
    throw new Error('Classification limit not set for this budget');
  }

  const allocatedSoFar = await db.budgetAllocation.aggregate({
    where: {
      budgetId: Number(budgetId),
      classificationId: Number(classificationId),
      category,
      deletedAt: null,
    },
    _sum: { allocatedAmount: true },
  });

  const totalAllocated =
    Number(allocatedSoFar._sum.allocatedAmount || 0);

  const limitAmount = Number(classificationLimit.limitAmount);

  return {
    classificationId: Number(classificationId),
    classification: classificationLimit.classification,
    limitAmount,
    totalAllocated,
    remaining: limitAmount - totalAllocated,
  };
};
/* ================= CHECK EXISTING OBJECT ALLOCATION ================= */
export const checkExistingObjectAllocation = async ({
  budgetId,
  classificationId,
  category,
  objectOfExpenditureId,
}) => {
  const existing = await db.budgetAllocation.findFirst({
    where: {
      budgetId: Number(budgetId),
      classificationId: Number(classificationId),
      category,
      objectOfExpenditureId: Number(objectOfExpenditureId),
      deletedAt: null,
    },
  });

  if (!existing) {
    return {
      exists: false,
    };
  }

  return {
    exists: true,
    allocation: {
      id: existing.id,
      allocatedAmount: Number(existing.allocatedAmount),
      usedAmount: Number(existing.usedAmount),
      remaining:
        Number(existing.allocatedAmount) -
        Number(existing.usedAmount),
    },
  };
};
