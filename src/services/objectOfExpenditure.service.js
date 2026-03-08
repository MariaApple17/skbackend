import { db } from '../config/db.config.js'

/* ================= CREATE ================= */
export const createObjectOfExpenditureService = async (data) => {
  const { code, name, description, classificationId } = data

  if (!code || !name || !classificationId) {
    throw new Error('Code, name and classification are required')
  }

  const exists = await db.objectOfExpenditure.findFirst({
    where: {
      deletedAt: null,
      OR: [
        { code: code.trim() },
        { name: name.trim() },
      ],
    },
  })

  if (exists) {
    throw new Error('Object of expenditure code or name already exists')
  }

  return db.objectOfExpenditure.create({
    data: {
      code: code.trim(),
      name: name.trim(),
      description: description?.trim() || null,
      classificationId: Number(classificationId),
    },
    include: {
      classification: true,
    },
  })
}

/* ================= READ (LIST WITH PAGINATION) ================= */
export const getObjectsOfExpenditureService = async (query) => {

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const q = query.q || ''
  const order = query.order === 'asc' ? 'asc' : 'desc'

  const allowedSort = ['createdAt', 'code', 'name']
  const sortBy = allowedSort.includes(query.sortBy)
    ? query.sortBy
    : 'createdAt'

  const skip = (page - 1) * limit

  const where = {
    deletedAt: null,
    ...(q && {
      OR: [
        {
          code: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
      ],
    }),
  }

  const [data, total] = await Promise.all([
    db.objectOfExpenditure.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: order,
      },
      include: {
        classification: true,
      },
    }),

    db.objectOfExpenditure.count({
      where,
    }),
  ])

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/* ================= READ (SINGLE) ================= */
export const getObjectOfExpenditureByIdService = async (id) => {

  const data = await db.objectOfExpenditure.findFirst({
    where: {
      id: Number(id),
      deletedAt: null,
    },
    include: {
      classification: true,
    },
  })

  if (!data) {
    throw new Error('Object of expenditure not found')
  }

  return data
}

/* ================= UPDATE ================= */
export const updateObjectOfExpenditureService = async (id, data) => {

  const existing = await db.objectOfExpenditure.findFirst({
    where: {
      id: Number(id),
      deletedAt: null,
    },
  })

  if (!existing) {
    throw new Error('Object of expenditure not found')
  }

  /* CHECK DUPLICATES */
  if (data.code || data.name) {

    const duplicate = await db.objectOfExpenditure.findFirst({
      where: {
        id: { not: Number(id) },
        deletedAt: null,
        OR: [
          data.code ? { code: data.code.trim() } : undefined,
          data.name ? { name: data.name.trim() } : undefined,
        ].filter(Boolean),
      },
    })

    if (duplicate) {
      throw new Error('Object of expenditure code or name already exists')
    }
  }

  return db.objectOfExpenditure.update({
    where: {
      id: Number(id),
    },
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
    include: {
      classification: true,
    },
  })
}

/* ================= DELETE (SOFT DELETE) ================= */
export const deleteObjectOfExpenditureService = async (id) => {

  const existing = await db.objectOfExpenditure.findFirst({
    where: {
      id: Number(id),
      deletedAt: null,
    },
  })

  if (!existing) {
    throw new Error('Object of expenditure not found')
  }

  return db.objectOfExpenditure.update({
    where: {
      id: Number(id),
    },
    data: {
      deletedAt: new Date(),
    },
  })
}