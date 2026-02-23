import { db } from '../config/db.config.js';

/* ======================================================
   CREATE PROGRAM (ASSIGN TO ACTIVE FISCAL YEAR)
====================================================== */
export const createProgramService = async (data) => {
  const {
    code,
    name,
    description,
    committeeInCharge,
    beneficiaries,
    startDate,
    endDate,
    isActive = true,
    documents = [],
  } = data;

  // ✅ Check unique code
  const existing = await db.program.findFirst({
    where: { code, deletedAt: null },
  });

  if (existing) {
    throw new Error('Program code already exists');
  }

  // ✅ Get active fiscal year
  const activeFiscalYear = await db.fiscalYear.findFirst({
    where: { isActive: true, deletedAt: null },
  });

  if (!activeFiscalYear) {
    throw new Error('No active fiscal year found');
  }

  return db.program.create({
    data: {
      code,
      name,
      description,
      committeeInCharge,
      beneficiaries,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive,
      fiscalYearId: activeFiscalYear.id, // 🔥 always link to active FY

      ...(documents.length > 0 && {
        documents: {
          create: documents.map((d) => ({
            imageUrl: d.imageUrl,
            title: d.title ?? null,
            description: d.description ?? null,
            uploadedBy: d.uploadedBy ?? null,
          })),
        },
      }),
    },
    include: { documents: true },
  });
};

/* ======================================================
   GET ALL PROGRAMS (ONLY ACTIVE FISCAL YEAR)
====================================================== */
export const getAllProgramsService = async (query) => {
  const {
    q,
    isActive,
    startDateFrom,
    startDateTo,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  // ✅ Get active fiscal year (DO NOT CRASH)
  const activeFiscalYear = await db.fiscalYear.findFirst({
    where: { isActive: true, deletedAt: null },
  });

  if (!activeFiscalYear) {
    // return empty safely instead of crashing
    return {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: Number(limit),
        totalPages: 0,
      },
    };
  }

  const where = {
    deletedAt: null,
    fiscalYearId: activeFiscalYear.id, // 🔥 FILTER HERE

    ...(isActive !== undefined && {
      isActive: isActive === 'true',
    }),

    ...(q && {
      OR: [
        { code: { contains: q } },
        { name: { contains: q } },
        { description: { contains: q } },
        { committeeInCharge: { contains: q } },
        { beneficiaries: { contains: q } },
      ],
    }),

    ...((startDateFrom || startDateTo) && {
      startDate: {
        ...(startDateFrom && { gte: new Date(startDateFrom) }),
        ...(startDateTo && { lte: new Date(startDateTo) }),
      },
    }),
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [data, total] = await Promise.all([
    db.program.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: Number(limit),
      include: { documents: true },
    }),
    db.program.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

/* ======================================================
   GET PROGRAM BY ID
====================================================== */
export const getProgramByIdService = async (id) => {
  const program = await db.program.findFirst({
    where: { id: Number(id), deletedAt: null },
    include: { documents: true },
  });

  if (!program) {
    throw new Error('Program not found');
  }

  return program;
};

/* ======================================================
   UPDATE PROGRAM
====================================================== */
export const updateProgramService = async (id, data) => {
  const programId = Number(id);

  const existing = await db.program.findFirst({
    where: { id: programId, deletedAt: null },
  });

  if (!existing) {
    throw new Error('Program not found');
  }

  const updateData = {
    ...(data.code && { code: data.code }),
    ...(data.name && { name: data.name }),
    ...(data.description && { description: data.description }),
    ...(data.committeeInCharge && { committeeInCharge: data.committeeInCharge }),
    ...(data.beneficiaries && { beneficiaries: data.beneficiaries }),
    ...(data.isActive !== undefined && {
      isActive: data.isActive === true || data.isActive === 'true',
    }),
    ...(data.startDate && { startDate: new Date(data.startDate) }),
    ...(data.endDate && { endDate: new Date(data.endDate) }),
  };

  return db.program.update({
    where: { id: programId },
    data: updateData,
    include: { documents: true },
  });
};

/* ======================================================
   TOGGLE STATUS
====================================================== */
export const toggleProgramStatusService = async (id) => {
  const program = await getProgramByIdService(id);

  return db.program.update({
    where: { id: Number(id) },
    data: { isActive: !program.isActive },
  });
};

/* ======================================================
   SOFT DELETE
====================================================== */
export const deleteProgramService = async (id) => {
  await getProgramByIdService(id);

  return db.program.update({
    where: { id: Number(id) },
    data: { deletedAt: new Date() },
  });
};