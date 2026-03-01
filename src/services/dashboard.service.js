import { db } from '../config/db.config.js';

const CATEGORY_KEYS = ['ADMINISTRATIVE', 'YOUTH'];

/* ============================================================
   CATEGORY HELPERS
============================================================ */
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

/* ============================================================
   MAIN DASHBOARD FUNCTION
============================================================ */
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
    });

    if (!fiscalYears.length) {
      throw new Error('No fiscal years found');
    }

    const yearly = [];

    for (const fy of fiscalYears) {
      const budget = await db.budget.findFirst({
        where: {
          fiscalYearId: fy.id,
          deletedAt: null,
        },
        include: {
          allocations: {
            where: { deletedAt: null },
          },
        },
      });

      if (!budget) {
        yearly.push({
          fiscalYear: {
            id: fy.id,
            year: fy.year,
            isActive: fy.isActive,
          },
          budget: null,
        });
        continue;
      }

      const allocated = budget.allocations.reduce(
        (sum, a) => sum + Number(a.allocatedAmount || 0),
        0
      );

      const used = budget.allocations.reduce(
        (sum, a) => sum + Number(a.usedAmount || 0),
        0
      );

      const remaining = Number(budget.totalAmount) - used;

      yearly.push({
        fiscalYear: {
          id: fy.id,
          year: fy.year,
          isActive: fy.isActive,
        },
        budget: {
          total: Number(budget.totalAmount),
          administrativeAmount: Number(budget.administrativeAmount),
          youthAmount: Number(budget.youthAmount),
          allocated,
          used,
          remaining,
          utilizationRate:
            Number(budget.totalAmount) > 0
              ? ((used / Number(budget.totalAmount)) * 100).toFixed(2)
              : '0.00',
          byCategory: buildCategoryBreakdown(
            budget,
            budget.allocations
          ),
        },
      });
    }

    const totals = yearly.reduce(
      (acc, y) => {
        if (!y.budget) return acc;

        acc.total += y.budget.total;
        acc.allocated += y.budget.allocated;
        acc.used += y.budget.used;
        acc.remaining += y.budget.remaining;

        return acc;
      },
      { total: 0, allocated: 0, used: 0, remaining: 0 }
    );

    return {
      mode: 'ALL',
      totals,
      yearly,
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

  const allocated = budget.allocations.reduce(
    (sum, a) => sum + Number(a.allocatedAmount || 0),
    0
  );

  const used = budget.allocations.reduce(
    (sum, a) => sum + Number(a.usedAmount || 0),
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
    total: await db.user.count({
      where: { deletedAt: null },
    }),
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
        user: {
          select: { id: true, fullName: true },
        },
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
      administrativeAmount: Number(budget.administrativeAmount),
      youthAmount: Number(budget.youthAmount),
      allocated,
      used,
      remaining,
      utilizationRate:
        Number(budget.totalAmount) > 0
          ? ((used / Number(budget.totalAmount)) * 100).toFixed(2)
          : '0.00',
      byCategory: buildCategoryBreakdown(
        budget,
        budget.allocations
      ),
    },
    procurement,
    approvals,
    users,
    logs,
  };
};