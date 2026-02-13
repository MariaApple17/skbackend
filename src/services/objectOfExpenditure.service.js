import { db } from '../config/db.config.js';

export const createObjectOfExpenditureService = async (data) => {
  const { code, name, description } = data;

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
    data: { code, name, description },
  });
};

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

export const getObjectOfExpenditureByIdService = async (id) => {
  const data = await db.objectOfExpenditure.findFirst({
    where: { id, deletedAt: null },
  });

  if (!data) {
    throw new Error('Object of expenditure not found');
  }

  return data;
};

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
          { code: data.code },
          { name: data.name },
        ],
        deletedAt: null,
      },
    });

    if (duplicate) {
      throw new Error('Object of expenditure code or name already exists');
    }
  }

  return db.objectOfExpenditure.update({
    where: { id },
    data,
  });
};

export const deleteObjectOfExpenditureService = async (id) => {
  return db.objectOfExpenditure.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
