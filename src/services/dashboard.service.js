import { db } from '../config/db.config.js';

const CATEGORY_KEYS = ['ADMINISTRATIVE', 'YOUTH'];

const getCategoryBudgetCap = (budget, category) =>
  category === 'ADMINISTRATIVE'
    ? Number(budget.administrativeAmount || 0)
    : Number(budget.youthAmount || 0);

const buildCategoryBreakdown = (budget, allocations = []) => {
  return CATEGORY_KEYS.map((category) => {
    const allocated = allocations
      .filter((a) => a.category === category)
      .reduce((sum, a) => sum + Number(a.allocatedAmount || 0), 0);

    const used = allocations
      .filter((a) => a.category === category)
      .reduce((sum, a) => sum + Number(a.usedAmount || 0), 0);

    const cap = getCategoryBudgetCap(budget, category);
    const remaining = cap - used;

    return {
      category,
      cap,
      allocated,
      used,
      remaining,
      utilizationRate:
        cap > 0 ? ((used / cap) * 100).toFixed(2) : '0.00',
    };
  });
};

/**
 * @param {Object} options
 * @param {number} [options.fiscalYearId]
 * @param {number} [options.year]
 * @param {'YEAR'|'ALL'} [options.mode]
 */
export const getDashboardData = async ({
  fiscalYearId,
  year,
  mode = 'YEAR',
} = {}) => {

  /* ============================================================
     ALL YEARS DASHBOARD (FIXED)
  ============================================================ */
  if (mode === 'ALL') {
    const fiscalYears = await db.fiscalYear.findMany({
      where: { deletedAt: null },
      orderBy: { year: 'asc' },
      include: {
        budgets: {
          where: { deletedAt: null },
          include: {
            allocations: {
              where: { deletedAt: null },
            },
          },
        },
      },
    });

    if (!fiscalYears.length) {
      return {
        mode: 'ALL',
        totals: { total: 0, allocated: 0, used: 0, remaining: 0 },
        yearly: [],
      };
    }

    const yearlyStats = fiscalYears.map((fy) => {
      const budget = fy.budgets?.[0];

      if (!budget) {
        return {
          fiscalYear: fy.year,
          total: 0,
          administrativeAmount: 0,
          youthAmount: 0,
          allocated: 0,
          used: 0,
          remaining: 0,
          utilizationRate: '0.00',
        };
      }

      const allocations = Array.isArray(budget.allocations)
        ? budget.allocations
        : [];

      const allocated = allocations.reduce(
        (s, a) => s + Number(a.allocatedAmount || 0),
        0
      );

      const used = allocations.reduce(
        (s, a) => s + Number(a.usedAmount || 0),
        0
      );

      const totalAmount = Number(budget.totalAmount || 0);

      return {
        fiscalYear: fy.year,
        total: totalAmount,
        administrativeAmount: Number(budget.administrativeAmount || 0),
        youthAmount: Number(budget.youthAmount || 0),
        allocated,
        used,
        remaining: totalAmount - used,
        utilizationRate:
          totalAmount > 0
            ? ((used / totalAmount) * 100).toFixed(2)
            : '0.00',
      };
    });

    const totals = yearlyStats.reduce(
      (acc, y) => {
        acc.total += y.total;
        acc.allocated += y.allocated;
        acc.used += y.used;
        acc.remaining += y.remaining;
        return acc;
      },
      { total: 0, allocated: 0, used: 0, remaining: 0 }
    );

    return {
      mode: 'ALL',
      totals,
      yearly: yearlyStats,
    };
  }

  /* ============================================================
     SINGLE YEAR DASHBOARD
  ============================================================ */

  let fiscalYear = null;

  if (fiscalYearId) {
    fiscalYear = await db.fiscalYear.findUnique({
      where: { id: fiscalYearId },
    });
  } else if (year) {
    fiscalYear = await db.fiscalYear.findUnique({
      where: { year },
    });
  } else {
    fiscalYear = await db.fiscalYear.findFirst({
      where: { isActive: true, deletedAt: null },
      orderBy: { year: 'desc' },
    });
  }

  if (!fiscalYear) {
    throw new Error('Fiscal year not found');
  }

  const budget = await db.budget.findFirst({
    where: {
      fiscalYearId: fiscalYear.id,
      deletedAt: null,
    },
    include: {
      allocations: {
        where: { deletedAt: null },
      },
    },
  });

  if (!budget) {
    return {
      mode: 'YEAR',
      fiscalYear,
      budget: {
        total: 0,
        administrativeAmount: 0,
        youthAmount: 0,
        allocated: 0,
        used: 0,
        remaining: 0,
        utilizationRate: '0.00',
        byCategory: [],
      },
      procurement: [],
      approvals: [],
      users: { total: 0 },
      logs: { recent: [] },
    };
  }

  const allocations = Array.isArray(budget.allocations)
    ? budget.allocations
    : [];

  const allocated = allocations.reduce(
    (sum, a) => sum + Number(a.allocatedAmount || 0),
    0
  );

  const used = allocations.reduce(
    (sum, a) => sum + Number(a.usedAmount || 0),
    0
  );

  const remaining = Number(budget.totalAmount || 0) - used;

  const byCategory = buildCategoryBreakdown(budget, allocations);

  const procurement = await db.procurementRequest.groupBy({
    by: ['status'],
    where: {
      deletedAt: null,
      allocation: { budgetId: budget.id },
    },
    _count: { id: true },
    _sum: { amount: true },
  });

  const approvals = await db.approval.groupBy({
    by: ['status'],
    where: {
      deletedAt: null,
      request: {
        allocation: { budgetId: budget.id },
      },
    },
    _count: { id: true },
  });

  const users = {
    total: await db.user.count({ where: { deletedAt: null } }),
  };

  const logs = {
    recent: await db.systemLog.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { id: true, fullName: true } },
      },
    }),
  };

  return {
    mode: 'YEAR',
    fiscalYear,
    budget: {
      total: Number(budget.totalAmount || 0),
      administrativeAmount: Number(budget.administrativeAmount || 0),
      youthAmount: Number(budget.youthAmount || 0),
      allocated,
      used,
      remaining,
      utilizationRate:
        Number(budget.totalAmount || 0) > 0
          ? ((used / Number(budget.totalAmount)) * 100).toFixed(2)
          : '0.00',
      byCategory,
    },
    procurement,
    approvals,
    users,
    logs,
  };
};