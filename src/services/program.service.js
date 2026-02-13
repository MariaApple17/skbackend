import { db } from '../config/db.config.js';

/* ======================================================
   CREATE PROGRAM (UPDATED: NO imageUrl)
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
    documents = [], // ✅ optional array of images
  } = data;

  // check unique code
  const existing = await db.program.findFirst({
    where: { code, deletedAt: null },
  });

  if (existing) {
    throw new Error('Program code already exists');
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

      // ✅ CREATE DOCUMENT IMAGES (OPTIONAL)
      ...(Array.isArray(documents) && documents.length > 0 && {
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
    include: {
      documents: true,
    },
  });
};

/* ======================================================
   GET ALL PROGRAMS (SEARCH, FILTER, SORT, PAGINATION)
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

  const where = {
    deletedAt: null,

    ...(isActive !== undefined && {
      isActive: isActive === 'true',
    }),

    ...(q && {
      OR: [
        { code: { contains: q, } },
        { name: { contains: q,  } },
        { description: { contains: q, } },
        { committeeInCharge: { contains: q, } },
        { beneficiaries: { contains: q,} },
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
        documents: true, // ✅ INCLUDE DOCUMENT IMAGES
      },
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
   GET PROGRAM BY ID (WITH DOCUMENTS)
====================================================== */
export const getProgramByIdService = async (id) => {
  const program = await db.program.findFirst({
    where: { id: Number(id), deletedAt: null },
    include: {
      documents: true, // ✅ INCLUDE DOCUMENT IMAGES
    },
  });

  if (!program) {
    throw new Error('Program not found');
  }

  return program;
};

/* ======================================================
   UPDATE PROGRAM (NO imageUrl, SAFE)
====================================================== */
export const updateProgramService = async (id, data) => {
  const programId = Number(id);

  const existing = await db.program.findFirst({
    where: { id: programId, deletedAt: null },
  });

  if (!existing) {
    throw new Error('Program not found');
  }

  const parseBoolean = (value) => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return undefined;
  };

  const parseDate = (value) => {
    if (value === undefined) return undefined;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      throw new Error(`Invalid date format: ${value}`);
    }
    return d;
  };

  const updateData = {};

  if (typeof data.code === 'string') updateData.code = data.code;
  if (typeof data.name === 'string') updateData.name = data.name;
  if (typeof data.description === 'string')
    updateData.description = data.description;
  if (typeof data.committeeInCharge === 'string')
    updateData.committeeInCharge = data.committeeInCharge;
  if (typeof data.beneficiaries === 'string')
    updateData.beneficiaries = data.beneficiaries;

  const isActive = parseBoolean(data.isActive);
  if (isActive !== undefined) updateData.isActive = isActive;

  if (data.startDate !== undefined)
    updateData.startDate = parseDate(data.startDate);
  if (data.endDate !== undefined)
    updateData.endDate = parseDate(data.endDate);

  if (
    updateData.startDate &&
    updateData.endDate &&
    updateData.startDate > updateData.endDate
  ) {
    throw new Error('Start date cannot be after end date');
  }

  return db.program.update({
    where: { id: programId },
    data: updateData,
    include: {
      documents: true,
    },
  });
};

/* ======================================================
   ADD PROGRAM DOCUMENT IMAGES (SEPARATE ENDPOINT)
====================================================== */
export const addProgramDocumentsService = async (id, documents) => {
  const programId = Number(id);

  // Verify program exists
  const existing = await db.program.findFirst({
    where: { id: programId, deletedAt: null },
  });

  if (!existing) {
    throw new Error('Program not found');
  }

  // Validate documents array
  if (!Array.isArray(documents) || documents.length === 0) {
    throw new Error('No documents provided');
  }

  // Add documents to the program using update with create nested
  return db.program.update({
    where: { id: programId },
    data: {
      documents: {
        create: documents.map((doc) => ({
          imageUrl: doc.imageUrl,
          title: doc.title ?? null,
          description: doc.description ?? null,
          uploadedBy: doc.uploadedBy ?? null,
        })),
      },
    },
    include: {
      documents: true,
    },
  });
};

/* ======================================================
   TOGGLE PROGRAM ACTIVE STATUS
====================================================== */
export const toggleProgramStatusService = async (id) => {
  const program = await getProgramByIdService(id);

  return db.program.update({
    where: { id: Number(id) },
    data: { isActive: !program.isActive },
  });
};

/* ======================================================
   SOFT DELETE PROGRAM (CASCADE DOCUMENTS)
====================================================== */
export const deleteProgramService = async (id) => {
  await getProgramByIdService(id);

  return db.program.update({
    where: { id: Number(id) },
    data: { deletedAt: new Date() },
  });
};