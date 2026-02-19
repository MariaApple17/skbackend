import { db } from '../config/db.config.js';

const CATEGORY_VALUES = ['ADMINISTRATIVE', 'YOUTH'];

const getCategoryCap = (budget, category) =>
  category === 'ADMINISTRATIVE'
    ? Number(budget.administrativeAmount)
    : Number(budget.youthAmount);

export const getPublicBudgetPlanService = async ({ year } = {}) => {
  const fiscalYear = year
    ? await db.fiscalYear.findFirst({
      where: { year: Number(year), deletedAt: null },
    })
    : await db.fiscalYear.findFirst({
      where: { isActive: true, deletedAt: null },
      orderBy: { year: 'desc' },
    });

  if (!fiscalYear) {
    throw new Error('Fiscal year not found');
  }

  const budget = await db.budget.findFirst({
    where: { fiscalYearId: fiscalYear.id, deletedAt: null },
    include: {
      classificationLimits: {
        include: {
          classification: {
            select: { id: true, code: true, name: true },
          },
        },
      },
      allocations: {
        where: { deletedAt: null },
        include: {
          program: {
            select: { id: true, code: true, name: true },
          },
          classification: {
            select: { id: true, code: true, name: true },
          },
          object: {
            select: { id: true, code: true, name: true },
          },
        },
      },
    },
  });

  if (!budget) {
    throw new Error('No budget found for this fiscal year');
  }

  const [systemProfile, skOfficials] = await Promise.all([
    db.systemProfile.findFirst({
      where: {
        fiscalYearId: fiscalYear.id,
        deletedAt: null,
      },
      select: {
        id: true,
        systemName: true,
        systemDescription: true,
        logoUrl: true,
        location: true,
      },
    }),
    db.skOfficial.findMany({
      where: {
        fiscalYearId: fiscalYear.id,
        deletedAt: null,
      },
      orderBy: [{ position: 'asc' }, { fullName: 'asc' }],
      select: {
        id: true,
        position: true,
        fullName: true,
        responsibility: true,
        profileImageUrl: true,
        isActive: true,
      },
    }),
  ]);

  const categorySummary = CATEGORY_VALUES.map((category) => {
    const cap = getCategoryCap(budget, category);
    const planned = budget.classificationLimits
      .filter((l) => l.category === category)
      .reduce((sum, l) => sum + Number(l.limitAmount), 0);
    const allocated = budget.allocations
      .filter((a) => a.category === category)
      .reduce((sum, a) => sum + Number(a.allocatedAmount), 0);
    const used = budget.allocations
      .filter((a) => a.category === category)
      .reduce((sum, a) => sum + Number(a.usedAmount), 0);

    return {
      category,
      cap,
      planned,
      allocated,
      used,
      remainingFromCap: cap - used,
    };
  });

  const classificationLimits = budget.classificationLimits.map((limit) => {
    const relatedAllocations = budget.allocations.filter(
      (a) =>
        a.classificationId === limit.classificationId &&
        a.category === limit.category
    );

    const allocated = relatedAllocations.reduce(
      (sum, a) => sum + Number(a.allocatedAmount),
      0
    );
    const used = relatedAllocations.reduce(
      (sum, a) => sum + Number(a.usedAmount),
      0
    );
    const limitAmount = Number(limit.limitAmount);

    return {
      classificationId: limit.classification.id,
      classificationCode: limit.classification.code,
      classificationName: limit.classification.name,
      category: limit.category,
      limitAmount,
      allocated,
      used,
      remaining: limitAmount - allocated,
    };
  });

  const programMap = {};
  for (const a of budget.allocations) {
    if (!programMap[a.programId]) {
      programMap[a.programId] = {
        programId: a.program.id,
        programCode: a.program.code,
        programName: a.program.name,
        totalAllocated: 0,
        totalUsed: 0,
        allocations: [],
      };
    }

    const allocatedAmount = Number(a.allocatedAmount);
    const usedAmount = Number(a.usedAmount);

    programMap[a.programId].totalAllocated += allocatedAmount;
    programMap[a.programId].totalUsed += usedAmount;
    programMap[a.programId].allocations.push({
      allocationId: a.id,
      category: a.category,
      classificationCode: a.classification.code,
      classificationName: a.classification.name,
      objectCode: a.object.code,
      objectName: a.object.name,
      allocatedAmount,
      usedAmount,
    });
  }

  return {
    fiscalYear: {
      id: fiscalYear.id,
      year: fiscalYear.year,
      isActive: fiscalYear.isActive,
    },
    budget: {
      id: budget.id,
      totalAmount: Number(budget.totalAmount),
      administrativeAmount: Number(budget.administrativeAmount),
      youthAmount: Number(budget.youthAmount),
    },
    systemProfile,
    skOfficials,
    categorySummary,
    classificationLimits,
    programs: Object.values(programMap),
    generatedAt: new Date().toISOString(),
  };
};
