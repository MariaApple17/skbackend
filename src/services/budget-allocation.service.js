import { db } from '../config/db.config.js';

/* ================= HELPERS ================= */
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
    budgetId,
    programId,
    classificationId,
    category,
    objectOfExpenditureId,
    allocatedAmount,
  } = payload;

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

  /* ---------------- FK VALIDATION ---------------- */
  await assertExists(db.budget, { id: budgetId, deletedAt: null }, 'Budget');

  // ✅ Validate program only if YOUTH
  if (category === 'YOUTH') {
    await assertExists(
      db.program,
      { id: programId, deletedAt: null },
      'Program'
    );
  }

  await assertExists(
    db.budgetClassification,
    { id: classificationId, deletedAt: null },
    'Budget classification'
  );

  await assertExists(
    db.objectOfExpenditure,
    { id: objectOfExpenditureId, deletedAt: null },
    'Object of expenditure'
  );

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
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
  const skip = (safePage - 1) * safeLimit;

  /* ================= SAFE SORT ================= */
  const ALLOWED_SORT_FIELDS = ['createdAt', 'allocatedAmount'];
  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
  const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

  /* ================= WHERE ================= */
  const where = { deletedAt: null };
  // 🔥 Force active fiscal year
const activeYear = await db.fiscalYear.findFirst({
  where: {
    isActive: true,
    deletedAt: null,
  },
});

if (!activeYear) {
  throw new Error("No active fiscal year found");
}

where.budget = {
  fiscalYearId: activeYear.id,
};

  if (fiscalYearId) {
  where.budget = {
    fiscalYearId: Number(fiscalYearId),
  };
} else if (budgetId) {
  where.budgetId = Number(budgetId);
}

  if (Number.isFinite(programId)) {
    where.programId = programId;
  }

  if (Number.isFinite(classificationId)) {
    where.classificationId = classificationId;
  }

  if (Number.isFinite(objectOfExpenditureId)) {
    where.objectOfExpenditureId = objectOfExpenditureId;
  }

  if (category) {
  where.category = category;
}

  if (search && search.trim()) {
    where.OR = [
      { program: { name: { contains: search } } },
      { program: { code: { contains: search } } },
      { classification: { name: { contains: search } } },
      { classification: { code: { contains: search } } },
      { object: { name: { contains: search } } },
      { object: { code: { contains: search } } },
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

  /* ---------------- ALLOCATED AMOUNT UPDATE ---------------- */
  if (payload.allocatedAmount !== undefined) {
    assertPositiveAmount(payload.allocatedAmount);
await validateClassificationLimit({
  budgetId: existing.budgetId,
  classificationId: existing.classificationId,
  category: existing.category, // ✅ ADD THIS
  allocatedAmount: payload.allocatedAmount,
  excludeAllocationId: id,
});

    if (
      payload.usedAmount !== undefined &&
      Number(payload.usedAmount) > Number(payload.allocatedAmount)
    ) {
      throw new Error('Used amount cannot exceed allocated amount');
    }
  }

  /* ---------------- USED AMOUNT UPDATE ---------------- */
  if (payload.usedAmount !== undefined) {
    if (Number(payload.usedAmount) < 0) {
      throw new Error('Used amount cannot be negative');
    }

    const targetAllocated =
      payload.allocatedAmount !== undefined
        ? Number(payload.allocatedAmount)
        : Number(existing.allocatedAmount);

    if (Number(payload.usedAmount) > targetAllocated) {
      throw new Error('Used amount cannot exceed allocated amount');
    }
  }

  return db.budgetAllocation.update({
    where: { id },
    data: payload,
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