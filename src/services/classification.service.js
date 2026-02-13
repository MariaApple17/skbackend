import { db } from '../config/db.config.js';

/* ======================================================
   CREATE CLASSIFICATION (WITHOUT BUDGET LIMIT)
====================================================== */
export const createClassificationService = async (data) => {
  const { code, name, description } = data;

  /* ================= BASIC VALIDATION ================= */
  if (
    typeof code !== 'string' ||
    typeof name !== 'string' ||
    !code.trim() ||
    !name.trim()
  ) {
    throw new Error('Code and name are required');
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== 'string'
  ) {
    throw new Error('Invalid description');
  }

  /* ================= DUPLICATE CHECK ================= */
  const exists = await db.budgetClassification.findFirst({
    where: {
      OR: [
        { code: code.trim() },
        { name: name.trim() },
      ],
      deletedAt: null,
    },
  });

  if (exists) {
    throw new Error('Classification code or name already exists');
  }

  /* ================= CREATE CLASSIFICATION ================= */
  return db.budgetClassification.create({
    data: {
      code: code.trim(),
      name: name.trim(),
      description: description?.trim() || null,
    },
  });
};

/* ======================================================
   GET ALL CLASSIFICATIONS (WITH LIMITS)
====================================================== */
export const getClassificationsService = async () => {
  return db.budgetClassification.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      budgetLimits: {
        include: {
          budget: {
            select: {
              id: true,
              totalAmount: true,
            },
          },
        },
      },
    },
  });
};

/* ======================================================
   GET CLASSIFICATION BY ID (WITH LIMIT)
====================================================== */
export const getClassificationByIdService = async (id) => {
  if (!Number.isInteger(Number(id))) {
    throw new Error('Invalid classification id');
  }

  const classification = await db.budgetClassification.findFirst({
    where: { id: Number(id), deletedAt: null },
    include: {
      budgetLimits: {
        include: {
          budget: {
            select: {
              id: true,
              totalAmount: true,
            },
          },
        },
      },
    },
  });

  if (!classification) {
    throw new Error('Classification not found');
  }

  return classification;
};

/* ======================================================
   UPDATE CLASSIFICATION (WITHOUT BUDGET LIMIT)
====================================================== */
export const updateClassificationService = async (id, data) => {
  if (!Number.isInteger(Number(id))) {
    throw new Error('Invalid classification id');
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error('No data provided for update');
  }

  const classification = await db.budgetClassification.findFirst({
    where: { id: Number(id), deletedAt: null },
    include: {
      budgetLimits: true,
    },
  });

  if (!classification) {
    throw new Error('Classification not found');
  }

  /* ================= CODE CHANGE RULE ================= */
  if (data.code && classification.budgetLimits.length > 0) {
    throw new Error(
      'Cannot change classification code while it is used in budget limits'
    );
  }

  /* ================= DUPLICATE CHECK ================= */
  if (data.code || data.name) {
    const duplicate = await db.budgetClassification.findFirst({
      where: {
        OR: [
          data.code ? { code: data.code.trim() } : undefined,
          data.name ? { name: data.name.trim() } : undefined,
        ].filter(Boolean),
        deletedAt: null,
        NOT: { id: Number(id) },
      },
    });

    if (duplicate) {
      throw new Error('Classification code or name already exists');
    }
  }

  /* ================= UPDATE CLASSIFICATION ================= */
  return db.budgetClassification.update({
    where: { id: Number(id) },
    data: {
      ...(data.code && { code: data.code.trim() }),
      ...(data.name && { name: data.name.trim() }),
      ...(data.description !== undefined && {
        description: data.description?.trim() || null,
      }),
    },
  });
};

/* ======================================================
   DELETE CLASSIFICATION (SOFT DELETE)
====================================================== */
export const deleteClassificationService = async (id) => {
  if (!Number.isInteger(Number(id))) {
    throw new Error('Invalid classification id');
  }

  const classification = await db.budgetClassification.findFirst({
    where: { id: Number(id), deletedAt: null },
    include: {
      allocations: true,
      budgetLimits: true,
    },
  });

  if (!classification) {
    throw new Error('Classification not found');
  }

  if (classification.allocations.length > 0) {
    throw new Error(
      'Cannot delete classification with existing budget allocations'
    );
  }

  if (classification.budgetLimits.length > 0) {
    throw new Error(
      'Cannot delete classification with existing budget limits'
    );
  }

  return db.budgetClassification.update({
    where: { id: Number(id) },
    data: { deletedAt: new Date() },
  });
};