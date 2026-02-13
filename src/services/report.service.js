import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/* ===============================
   SHARED PAGINATION
================================ */
function getPagination(page = 1, limit = 10) {
  const take = Number(limit);
  const skip = (Number(page) - 1) * take;
  return { skip, take };
}

/* ===============================
   ACTIVE FISCAL YEAR (SINGLE SOURCE)
================================ */
async function getActiveFiscalYear() {
  return prisma.fiscalYear.findFirst({
    where: {
      isActive: true,
      deletedAt: null,
    },
    select: { id: true },
  });
}

/* ===============================
   BUDGET SUMMARY REPORT
   Active Fiscal Year ONLY
================================ */
export async function getBudgetSummary({
  search,
  page = 1,
  limit = 10,
} = {}) {
  const activeFY = await getActiveFiscalYear();
  if (!activeFY) {
    return { data: [], total: 0, page, limit };
  }

  const where = {
    deletedAt: null,
    budget: {
      fiscalYearId: activeFY.id,
    },
    ...(search && {
      OR: [
        { program: { name: { contains: search } } },
        { classification: { name: { contains: search } } },
        { object: { name: { contains: search } } },
      ],
    }),
  };

  const { skip, take } = getPagination(page, limit);

  const [data, total] = await Promise.all([
    prisma.budgetAllocation.findMany({
      where,
      skip,
      take,
      include: {
        program: true,
        classification: true,
        object: true,
        budget: { include: { fiscalYear: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.budgetAllocation.count({ where }),
  ]);

  return { data, total, page, limit };
}

/* ===============================
   PROCUREMENT REPORT
   Active Fiscal Year ONLY
================================ */
export async function getProcurementReport({
  status,
  from,
  to,
  search,
  page = 1,
  limit = 10,
} = {}) {
  const activeFY = await getActiveFiscalYear();
  if (!activeFY) {
    return { data: [], total: 0, page, limit };
  }

  const where = {
    deletedAt: null,
    ...(status && { status }),
    allocation: {
      budget: {
        fiscalYearId: activeFY.id,
      },
    },
    ...(search && {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
        { createdBy: { fullName: { contains: search } } },
        { allocation: { program: { name: { contains: search } } } },
      ],
    }),
    createdAt: {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to) : undefined,
    },
  };

  const { skip, take } = getPagination(page, limit);

  const [data, total] = await Promise.all([
    prisma.procurementRequest.findMany({
      where,
      skip,
      take,
      include: {
        vendor: true,
        items: true,
        createdBy: true,
        allocation: {
          include: {
            program: true,
            classification: true,
            budget: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.procurementRequest.count({ where }),
  ]);

  return { data, total, page, limit };
}

/* ===============================
   APPROVAL HISTORY REPORT
   Active Fiscal Year ONLY
================================ */
export async function getApprovalReport({
  requestId,
  search,
  page = 1,
  limit = 10,
} = {}) {
  const activeFY = await getActiveFiscalYear();
  if (!activeFY) {
    return { data: [], total: 0, page, limit };
  }

  const where = {
    deletedAt: null,
    ...(requestId && { requestId: Number(requestId) }),
    request: {
      allocation: {
        budget: {
          fiscalYearId: activeFY.id,
        },
      },
    },
    ...(search && {
      OR: [
        { status: { contains: search } },
        { remarks: { contains: search } },
        { approver: { fullName: { contains: search } } },
        { request: { title: { contains: search } } },
      ],
    }),
  };

  const { skip, take } = getPagination(page, limit);

  const [data, total] = await Promise.all([
    prisma.approval.findMany({
      where,
      skip,
      take,
      include: {
        approver: true,
        request: {
          include: {
            allocation: {
              include: { budget: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.approval.count({ where }),
  ]);

  return { data, total, page, limit };
}

/* ===============================
   PROGRAM UTILIZATION REPORT
   Active Fiscal Year ONLY
================================ */
export async function getProgramUtilization({
  search,
  page = 1,
  limit = 10,
} = {}) {
  const activeFY = await getActiveFiscalYear();
  if (!activeFY) {
    return { data: [], total: 0, page, limit };
  }

  const programs = await prisma.program.findMany({
    where: {
      deletedAt: null,
      ...(search && { name: { contains: search } }),
    },
    include: {
      allocations: {
        where: {
          budget: {
            fiscalYearId: activeFY.id,
          },
        },
      },
    },
  });

  const computed = programs.map(p => {
    const allocated = p.allocations.reduce(
      (sum, a) => sum + Number(a.allocatedAmount),
      0
    );
    const used = p.allocations.reduce(
      (sum, a) => sum + Number(a.usedAmount),
      0
    );

    return {
      programId: p.id,
      programName: p.name,
      allocated,
      used,
      remaining: allocated - used,
    };
  });

  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: computed.slice(start, end),
    total: computed.length,
    page,
    limit,
  };
}
