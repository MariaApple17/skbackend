import { db } from '../config/db.config.js';

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
     ALL YEARS DASHBOARD
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
      throw new Error('No fiscal years found');
    }

    const yearlyStats = fiscalYears.map((fy) => {
      const budget = fy.budgets[0];
      if (!budget) {
        return {
          fiscalYear: fy.year,
          total: 0,
          allocated: 0,
          used: 0,
          remaining: 0,
        };
      }

      const allocated = budget.allocations.reduce(
        (s, a) => s + Number(a.allocatedAmount),
        0
      );

      const used = budget.allocations.reduce(
        (s, a) => s + Number(a.usedAmount),
        0
      );

      return {
        fiscalYear: fy.year,
        total: Number(budget.totalAmount),
        allocated,
        used,
        remaining: Number(budget.totalAmount) - used,
        utilizationRate: budget.totalAmount > 0
          ? ((used / Number(budget.totalAmount)) * 100).toFixed(2)
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
    throw new Error('No budget found for this fiscal year');
  }

  /* ================= BUDGET TOTALS ================= */
  const allocated = budget.allocations.reduce(
    (sum, a) => sum + Number(a.allocatedAmount),
    0
  );

  const used = budget.allocations.reduce(
    (sum, a) => sum + Number(a.usedAmount),
    0
  );

  const remaining = Number(budget.totalAmount) - used;

  /* ================= PROCUREMENT ================= */
  const procurement = await db.procurementRequest.groupBy({
    by: ['status'],
    where: {
      deletedAt: null,
      allocation: {
        budgetId: budget.id,
      },
    },
    _count: { id: true },
    _sum: { amount: true },
  });

  /* ================= APPROVALS ================= */
  const approvals = await db.approval.groupBy({
    by: ['status'],
    where: {
      deletedAt: null,
      request: {
        allocation: {
          budgetId: budget.id,
        },
      },
    },
    _count: { id: true },
  });

  /* ================= USERS ================= */
  const users = {
    total: await db.user.count({ where: { deletedAt: null } }),
    byStatus: await db.user.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { id: true },
    }),
    byRole: await db.user.groupBy({
      by: ['roleId'],
      where: { deletedAt: null },
      _count: { id: true },
    }),
  };

  /* ================= LOGS ================= */
  const logs = {
    recent: await db.systemLog.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { id: true, fullName: true } },
      },
    }),
    summary: await db.systemLog.groupBy({
      by: ['level'],
      _count: { id: true },
    }),
  };

  return {
    mode: 'YEAR',
    fiscalYear: {
      id: fiscalYear.id,
      year: fiscalYear.year,
      isActive: fiscalYear.isActive,
    },
    budget: {
      total: Number(budget.totalAmount),
      allocated,
      used,
      remaining,
      utilizationRate: (
        (used / Number(budget.totalAmount)) *
        100
      ).toFixed(2),
    },
    procurement,
    approvals,
    users,
    logs,
  };
};
