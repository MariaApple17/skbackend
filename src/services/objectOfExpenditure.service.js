import { db } from '../config/db.config.js';

/* ================= CREATE ================= */
export const createObjectOfExpenditureService = async (data) => {
  const { code, name, description, classificationId } = data;

  if (!code || !name || !classificationId) {
    throw new Error('Code, name and classification are required');
  }

  const exists = await db.objectOfExpenditure.findFirst({
    where: {
      OR: [{ code }, { name }],
      deletedAt: null,
    },
  });

  if (exists) {
    throw new Error('Object of expenditure code or name already exists');
  }

  return db.objectOfExpenditure.create({
    data: {
      code: code.trim(),
      name: name.trim(),
      description: description?.trim() || null,
      classificationId: Number(classificationId), // ✅ REQUIRED
    },
  });
};

/* ================= READ (LIST) ================= */
export const getObjectsOfExpenditureService = async (query) => {
  const {
    q,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
  } = query;

  const where = {
    deletedAt: null,
    ...(q && {
      OR: [
        { code: { contains: q } },
        { name: { contains: q } },
      ],
    }),
  };

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    db.objectOfExpenditure.findMany({
      where,
      skip: +skip,
      take: +limit,
      orderBy: { [sortBy]: order },
      include: {
        classification: true, // ✅ So UI can show classification name
      },
    }),
    db.objectOfExpenditure.count({ where }),
  ]);

  return {
    data,
    pagination: {
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/* ================= READ (SINGLE) ================= */
export const getObjectOfExpenditureByIdService = async (id) => {
  const data = await db.objectOfExpenditure.findFirst({
    where: { id, deletedAt: null },
    include: {
      classification: true, // ✅ Include relation
    },
  });

  if (!data) {
    throw new Error('Object of expenditure not found');
  }

  return data;
};

/* ================= UPDATE ================= */
export const updateObjectOfExpenditureService = async (id, data) => {
  const existing = await db.objectOfExpenditure.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new Error('Object of expenditure not found');
  }

  if (data.code || data.name) {
    const duplicate = await db.objectOfExpenditure.findFirst({
      where: {
        id: { not: id },
        OR: [
          data.code ? { code: data.code } : undefined,
          data.name ? { name: data.name } : undefined,
        ].filter(Boolean),
        deletedAt: null,
      },
    });

    if (duplicate) {
      throw new Error('Object of expenditure code or name already exists');
    }
  }

  return db.objectOfExpenditure.update({
    where: { id },
    data: {
      ...(data.code && { code: data.code.trim() }),
      ...(data.name && { name: data.name.trim() }),
      ...(data.description !== undefined && {
        description: data.description?.trim() || null,
      }),
      ...(data.classificationId && {
        classificationId: Number(data.classificationId),
      }),
    },
  });
};

/* ================= DELETE ================= */
export const deleteObjectOfExpenditureService = async (id) => {
  return db.objectOfExpenditure.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};