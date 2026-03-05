import { db } from "../config/db.config.js";

/* ======================================================
   CREATE PROGRAM (DEFAULT STATUS = DRAFT)
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

  /* ---------------- CHECK DUPLICATE CODE ---------------- */

  const existing = await db.program.findFirst({
    where: { code, deletedAt: null },
  });

  if (existing) {
    throw new Error("Program code already exists");
  }

  /* ---------------- ACTIVE FISCAL YEAR ---------------- */

  const activeFiscalYear = await db.fiscalYear.findFirst({
    where: { isActive: true, deletedAt: null },
  });

  if (!activeFiscalYear) {
    throw new Error("No active fiscal year found");
  }

  /* ---------------- CREATE PROGRAM ---------------- */

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

      status: "DRAFT", // ✅ FIXED ENUM

      fiscalYearId: activeFiscalYear.id,

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
   GET ALL PROGRAMS
====================================================== */
export const getAllProgramsService = async (query) => {
  const {
    q,
    isActive,
    startDateFrom,
    startDateTo,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = query;

  const activeFiscalYear = await db.fiscalYear.findFirst({
    where: { isActive: true, deletedAt: null },
  });

  if (!activeFiscalYear) {
    return {
      data: [],
      meta: { total: 0, page: 1, limit: Number(limit), totalPages: 0 },
    };
  }

  const where = {
    deletedAt: null,
    fiscalYearId: activeFiscalYear.id,

    ...(isActive !== undefined && {
      isActive: isActive === "true",
    }),

    ...(q && {
      OR: [
        { code: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { committeeInCharge: { contains: q, mode: "insensitive" } },
        { beneficiaries: { contains: q, mode: "insensitive" } },
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
      include: {
        documents: true,
        approvals: {
          include: {
            approver: true,
          },
        },
      },
    }),
    db.program.count({ where }),
  ]);

  /* FORMAT APPROVAL DATA FOR FRONTEND */

  const formatted = data.map((program) => ({
    ...program,
    approvalStatus: program.status.toLowerCase(),
    approvals: program.apvals?.map((a) => ({
      member: a.approver.fullName,
      decision: a.status.toLowerCase(),
      date: a.createdAt,
    })),
  }));

  return {
    data: formatted,
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
    include: {
      documents: true,
      approvals: {
        include: {
          approver: true,
        },
      },
    },
  });

  if (!program) {
    throw new Error("Program not found");
  }

  return program;
};

/* ======================================================
   APPROVE PROGRAM
====================================================== */
export const approveProgramService = async (programId, userId) => {
  programId = Number(programId);

  await getProgramByIdService(programId);

  const existingVote = await db.programApproval.findFirst({
    where: {
      programId,
      approverId: userId,
    },
  });

  if (existingVote) {
    throw new Error("You already voted for this program");
  }

  await db.programApproval.create({
    data: {
      programId,
      approverId: userId,
      status: "APPROVED",
    },
  });

  const approvals = await db.programApproval.count({
    where: {
      programId,
      status: "APPROVED",
    },
  });

  /* 3 APPROVALS = PROGRAM APPROVED */

  if (approvals >= 3) {
    await db.program.update({
      where: { id: programId },
      data: { status: "APPROVED" },
    });
  }

  return { message: "Program approved" };
};

/* ======================================================
   REJECT PROGRAM
====================================================== */
export const rejectProgramService = async (programId, userId) => {
  programId = Number(programId);

  await db.programApproval.create({
    data: {
      programId,
      approverId: userId,
      status: "REJECTED",
    },
  });

  await db.program.update({
    where: { id: programId },
    data: { status: "REJECTED" },
  });

  return { message: "Program rejected" };
};

/* ======================================================
   UPDATE PROGRAM
====================================================== */
export const updateProgramService = async (id, data) => {
  const programId = Number(id);

  await getProgramByIdService(programId);

  const updateData = {
    ...(data.code && { code: data.code }),
    ...(data.name && { name: data.name }),
    ...(data.description && { description: data.description }),
    ...(data.committeeInCharge && { committeeInCharge: data.committeeInCharge }),
    ...(data.beneficiaries && { beneficiaries: data.beneficiaries }),
    ...(data.isActive !== undefined && {
      isActive: data.isActive === true || data.isActive === "true",
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
   TOGGLE ACTIVE STATUS
====================================================== */
export const toggleProgramStatusService = async (id) => {
  const program = await getProgramByIdService(id);

  return db.program.update({
    where: { id: Number(id) },
    data: { isActive: !program.isActive },
  });
};

/* ======================================================
   DELETE PROGRAM (SOFT DELETE)
====================================================== */
export const deleteProgramService = async (id) => {
  await getProgramByIdService(id);

  return db.program.update({
    where: { id: Number(id) },
    data: { deletedAt: new Date() },
  });
};