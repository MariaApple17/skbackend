import { db } from '../config/db.config.js';

const PROGRAM_APPROVALS_REQUIRED = 4;
const PROGRAM_APPROVER_ROLES = [
  'SK CHAIRPERSON',
  'SK KAGAWAD',
];

const parseBooleanQuery = (value) => {
  if (value === true || value === 'true') {
    return true;
  }

  if (value === false || value === 'false') {
    return false;
  }

  return undefined;
};

const normalizeApprovalStatusFilter = (value) => {
  const normalized = value?.toString().trim().toUpperCase();

  if (!normalized) {
    return null;
  }

  if (normalized === 'PENDING' || normalized === 'UPCOMING') {
    return 'PENDING';
  }

  if (['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'].includes(normalized)) {
    return normalized;
  }

  return null;
};

const assertProgramDates = (startDate, endDate) => {
  if (!startDate || !endDate) {
    throw new Error('Start date and end date are required');
  }

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  if (
    Number.isNaN(parsedStartDate.getTime()) ||
    Number.isNaN(parsedEndDate.getTime())
  ) {
    throw new Error('Invalid program date');
  }

  if (parsedStartDate > parsedEndDate) {
    throw new Error('Start date cannot be after end date');
  }

  return {
    startDate: parsedStartDate,
    endDate: parsedEndDate,
  };
};

const assertUniqueProgramCode = async (
  code,
  excludeId = null
) => {
  if (!code?.trim()) {
    throw new Error('Program code is required');
  }

  const existing = await db.program.findFirst({
    where: {
      code: code.trim(),
      deletedAt: null,
      ...(excludeId && {
        id: {
          not: Number(excludeId),
        },
      }),
    },
  });

  if (existing) {
    throw new Error('Program code already exists');
  }
};

const getActiveFiscalYearId = async (requestedId) => {
  const parsedRequestedId = Number(requestedId);

  if (
    Number.isFinite(parsedRequestedId) &&
    parsedRequestedId > 0
  ) {
    return parsedRequestedId;
  }

  const activeFiscalYear = await db.fiscalYear.findFirst({
    where: {
      isActive: true,
      deletedAt: null,
    },
  });

  return activeFiscalYear?.id ?? null;
};

const approvalInclude = {
  approver: {
    select: {
      id: true,
      email: true,
      fullName: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

const programInclude = {
  documents: {
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'asc',
    },
  },
  approvals: {
    include: approvalInclude,
    orderBy: {
      createdAt: 'asc',
    },
  },
};

const buildApprovalRecord = (approval) => ({
  id: approval.id,
  approverId: approval.approverId,
  userId: approval.approverId,
  member: approval.approver?.fullName ?? 'Unknown',
  role: approval.approver?.role?.name ?? 'Unknown',
  decision:
    approval.status === 'APPROVED'
      ? 'approved'
      : 'rejected',
  status: approval.status,
  remarks: approval.remarks ?? null,
  actedAt: approval.createdAt,
  date: approval.createdAt,
  createdAt: approval.createdAt,
  approver: approval.approver ?? null,
});

const buildApprovalSummary = (approvals) => {
  const approvedCount = approvals.filter(
    (approval) => approval.status === 'APPROVED'
  ).length;
  const rejectedCount = approvals.filter(
    (approval) => approval.status === 'REJECTED'
  ).length;
  const pendingCount = Math.max(
    0,
    PROGRAM_APPROVALS_REQUIRED - approvedCount
  );

  return {
    approvalsRequired: PROGRAM_APPROVALS_REQUIRED,
    approvedCount,
    rejectedCount,
    pendingCount,
    isComplete:
      approvedCount >= PROGRAM_APPROVALS_REQUIRED,
    isRejected: rejectedCount > 0,
    pendingLabel:
      pendingCount === 1
        ? '1 approval remaining'
        : `${pendingCount} approvals remaining`,
  };
};

const buildProgramResponse = (program) => {
  const approvals = (program.approvals ?? []).map(
    buildApprovalRecord
  );
  const approvalSummary = buildApprovalSummary(
    program.approvals ?? []
  );

  return {
    ...program,
    documents: program.documents ?? [],
    approvalStatus: program.status,
    approvals,
    approvalsCount: approvalSummary.approvedCount,
    approvalsRequired: approvalSummary.approvalsRequired,
    approvalSummary,
  };
};

const getProgramByIdOrThrow = async (
  id,
  include = programInclude
) => {
  const program = await db.program.findFirst({
    where: {
      id: Number(id),
      deletedAt: null,
    },
    include,
  });

  if (!program) {
    throw new Error('Program not found');
  }

  return program;
};

const assertApproverCanVote = async (userId) => {
  const user = await db.user.findFirst({
    where: {
      id: Number(userId),
      deletedAt: null,
      status: 'ACTIVE',
    },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const roleName = user.role?.name ?? '';

  if (!PROGRAM_APPROVER_ROLES.includes(roleName)) {
    throw new Error('You are not allowed to vote');
  }

  return user;
};

const assertNoExistingVote = async (programId, userId) => {
  const existingVote = await db.programApproval.findFirst({
    where: {
      programId: Number(programId),
      approverId: Number(userId),
    },
  });

  if (existingVote) {
    throw new Error('You already voted for this program');
  }
};

const getApprovalResult = async (programId) => {
  const program = await getProgramByIdOrThrow(programId);
  const approvalSummary = buildApprovalSummary(
    program.approvals ?? []
  );

  return {
    message:
      program.status === 'REJECTED'
        ? 'Rejection recorded'
        : 'Approval recorded',
    approvalsCount: approvalSummary.approvedCount,
    approvalsRequired: approvalSummary.approvalsRequired,
    pendingCount: approvalSummary.pendingCount,
    programStatus: program.status,
    data: buildProgramResponse(program),
  };
};

/* ======================================================
   CREATE PROGRAM
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

  if (
    !name?.trim() ||
    !committeeInCharge?.trim() ||
    !beneficiaries?.trim()
  ) {
    throw new Error(
      'Name, committee in charge, and beneficiaries are required'
    );
  }

  await assertUniqueProgramCode(code);

  const dates = assertProgramDates(startDate, endDate);
  const fiscalYearId = await getActiveFiscalYearId();

  if (!fiscalYearId) {
    throw new Error('No active fiscal year found');
  }

  const program = await db.program.create({
    data: {
      code: code.trim(),
      name: name.trim(),
      description: description?.trim() || null,
      committeeInCharge: committeeInCharge.trim(),
      beneficiaries: beneficiaries.trim(),
      startDate: dates.startDate,
      endDate: dates.endDate,
      isActive,
      fiscalYearId,
      status: 'SUBMITTED',
      ...(documents.length > 0 && {
        documents: {
          create: documents.map((document) => ({
            imageUrl: document.imageUrl,
            title: document.title ?? null,
            description: document.description ?? null,
            uploadedBy: document.uploadedBy ?? null,
          })),
        },
      }),
    },
    include: programInclude,
  });

  return buildProgramResponse(program);
};

/* ======================================================
   GET ALL PROGRAMS
====================================================== */

export const getAllProgramsService = async (query = {}) => {
  const {
    q,
    startDateFrom,
    startDateTo,
    approvalStatus,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
    isActive,
    fiscalYearId,
  } = query;

  const resolvedFiscalYearId =
    await getActiveFiscalYearId(fiscalYearId);
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(
    1000,
    Math.max(1, Number(limit) || 10)
  );
  const skip = (safePage - 1) * safeLimit;

  if (!resolvedFiscalYearId) {
    const emptyPagination = {
      total: 0,
      page: safePage,
      limit: safeLimit,
      totalPages: 0,
    };

    return {
      data: [],
      pagination: emptyPagination,
      meta: emptyPagination,
    };
  }

  const allowedSortFields = [
    'createdAt',
    'code',
    'name',
    'startDate',
    'endDate',
  ];
  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : 'createdAt';
  const safeSortOrder =
    sortOrder === 'asc' ? 'asc' : 'desc';

  const where = {
    deletedAt: null,
    fiscalYearId: resolvedFiscalYearId,
  };

  const normalizedApprovalStatus =
    normalizeApprovalStatusFilter(approvalStatus);

  if (normalizedApprovalStatus === 'PENDING') {
    where.status = {
      in: ['DRAFT', 'SUBMITTED'],
    };
  } else if (normalizedApprovalStatus) {
    where.status = normalizedApprovalStatus;
  }

  const normalizedIsActive = parseBooleanQuery(isActive);

  if (normalizedIsActive !== undefined) {
    where.isActive = normalizedIsActive;
  }

  if (q?.trim()) {
    where.OR = [
      {
        code: {
          contains: q.trim(),
          mode: 'insensitive',
        },
      },
      {
        name: {
          contains: q.trim(),
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: q.trim(),
          mode: 'insensitive',
        },
      },
      {
        committeeInCharge: {
          contains: q.trim(),
          mode: 'insensitive',
        },
      },
      {
        beneficiaries: {
          contains: q.trim(),
          mode: 'insensitive',
        },
      },
    ];
  }

  if (startDateFrom || startDateTo) {
    where.startDate = {
      ...(startDateFrom && {
        gte: new Date(startDateFrom),
      }),
      ...(startDateTo && {
        lte: new Date(startDateTo),
      }),
    };
  }

  const [rows, total] = await Promise.all([
    db.program.findMany({
      where,
      include: programInclude,
      orderBy: {
        [safeSortBy]: safeSortOrder,
      },
      skip,
      take: safeLimit,
    }),
    db.program.count({ where }),
  ]);

  const pagination = {
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.ceil(total / safeLimit),
  };

  return {
    data: rows.map(buildProgramResponse),
    pagination,
    meta: pagination,
  };
};

/* ======================================================
   GET PROGRAM BY ID
====================================================== */

export const getProgramByIdService = async (id) => {
  const program = await getProgramByIdOrThrow(id);
  return buildProgramResponse(program);
};

/* ======================================================
   APPROVE PROGRAM
====================================================== */

export const approveProgramService = async (
  programId,
  userId
) => {
  const program = await getProgramByIdOrThrow(programId, {
    approvals: true,
  });

  if (program.status === 'APPROVED') {
    throw new Error('Program already approved');
  }

  if (program.status === 'REJECTED') {
    throw new Error('Program already rejected');
  }

  await assertApproverCanVote(userId);
  await assertNoExistingVote(programId, userId);

  await db.programApproval.create({
    data: {
      programId: Number(programId),
      approverId: Number(userId),
      status: 'APPROVED',
    },
  });

  const approvedCount = await db.programApproval.count({
    where: {
      programId: Number(programId),
      status: 'APPROVED',
    },
  });

  if (approvedCount >= PROGRAM_APPROVALS_REQUIRED) {
    await db.program.update({
      where: {
        id: Number(programId),
      },
      data: {
        status: 'APPROVED',
      },
    });
  }

  return getApprovalResult(programId);
};

/* ======================================================
   REJECT PROGRAM
====================================================== */

export const rejectProgramService = async (
  programId,
  userId
) => {
  const program = await getProgramByIdOrThrow(programId, {
    approvals: true,
  });

  if (program.status === 'APPROVED') {
    throw new Error('Program already approved');
  }

  if (program.status === 'REJECTED') {
    throw new Error('Program already rejected');
  }

  await assertApproverCanVote(userId);
  await assertNoExistingVote(programId, userId);

  await db.programApproval.create({
    data: {
      programId: Number(programId),
      approverId: Number(userId),
      status: 'REJECTED',
    },
  });

  await db.program.update({
    where: {
      id: Number(programId),
    },
    data: {
      status: 'REJECTED',
    },
  });

  return getApprovalResult(programId);
};

/* ======================================================
   UPDATE PROGRAM
====================================================== */

export const updateProgramService = async (
  id,
  data
) => {
  const program = await getProgramByIdOrThrow(id, {
    approvals: true,
    documents: true,
  });

  const nextCode =
    typeof data.code === 'string'
      ? data.code.trim()
      : program.code;

  if (nextCode !== program.code) {
    await assertUniqueProgramCode(nextCode, id);
  }

  const nextStartDate =
    data.startDate !== undefined
      ? data.startDate
      : program.startDate;
  const nextEndDate =
    data.endDate !== undefined
      ? data.endDate
      : program.endDate;

  const dates = assertProgramDates(
    nextStartDate,
    nextEndDate
  );

  const updated = await db.program.update({
    where: {
      id: Number(id),
    },
    data: {
      code: nextCode,
      ...(data.name !== undefined && {
        name: data.name?.trim(),
      }),
      ...(data.description !== undefined && {
        description: data.description?.trim() || null,
      }),
      ...(data.committeeInCharge !== undefined && {
        committeeInCharge:
          data.committeeInCharge?.trim(),
      }),
      ...(data.beneficiaries !== undefined && {
        beneficiaries: data.beneficiaries?.trim(),
      }),
      startDate: dates.startDate,
      endDate: dates.endDate,
      ...(data.isActive !== undefined && {
        isActive: Boolean(data.isActive),
      }),
    },
    include: programInclude,
  });

  return buildProgramResponse(updated);
};

/* ======================================================
   ADD PROGRAM DOCUMENTS
====================================================== */

export const addProgramDocumentsService = async (
  id,
  documents = []
) => {
  await getProgramByIdOrThrow(id, {
    approvals: true,
    documents: true,
  });

  if (!documents.length) {
    return getProgramByIdService(id);
  }

  const updated = await db.program.update({
    where: {
      id: Number(id),
    },
    data: {
      documents: {
        create: documents.map((document) => ({
          imageUrl: document.imageUrl,
          title: document.title ?? null,
          description: document.description ?? null,
          uploadedBy: document.uploadedBy ?? null,
        })),
      },
    },
    include: programInclude,
  });

  return buildProgramResponse(updated);
};

/* ======================================================
   UPLOAD PROGRAM PROOF
====================================================== */

export const uploadProgramProofService = async (
  programId,
  fileUrl,
  userName,
  title = null
) => {
  await getProgramByIdOrThrow(programId, {
    approvals: true,
    documents: true,
  });

  await db.programDocumentImage.create({
    data: {
      programId: Number(programId),
      imageUrl: fileUrl,
      title: title?.trim() || null,
      uploadedBy: userName ?? 'SK Official',
    },
  });

  return getProgramByIdService(programId);
};

/* ======================================================
   TOGGLE ACTIVE STATUS
====================================================== */

export const toggleProgramStatusService = async (
  id
) => {
  const program = await getProgramByIdOrThrow(id, {
    approvals: true,
    documents: true,
  });

  const updated = await db.program.update({
    where: {
      id: Number(id),
    },
    data: {
      isActive: !program.isActive,
    },
    include: programInclude,
  });

  return buildProgramResponse(updated);
};

/* ======================================================
   DELETE PROGRAM
====================================================== */

export const deleteProgramService = async (id) => {
  await getProgramByIdOrThrow(id, {
    approvals: true,
    documents: true,
  });

  return db.program.update({
    where: {
      id: Number(id),
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
