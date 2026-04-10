import { db } from '../config/db.config.js'

const normalizePositiveInt = (value, fieldName) => {
  const normalized = Number(value)
  if (!Number.isInteger(normalized) || normalized <= 0) {
    throw new Error(`Invalid ${fieldName}`)
  }
  return normalized
}

const ensureClassificationExists = async (classificationId) => {
  const normalizedClassificationId = normalizePositiveInt(
    classificationId,
    'classification id'
  )

  const classification = await db.budgetClassification.findFirst({
    where: {
      id: normalizedClassificationId,
      deletedAt: null,
    },
  })

  if (!classification) {
    console.warn(
      '[objectOfExpenditure.service] classification not found',
      { classificationId: normalizedClassificationId }
    )
    throw new Error('Classification not found')
  }

  return classification
}

/* ================= CREATE ================= */
export const createObjectOfExpenditureService = async (data) => {
  const { code, name, description, classificationId } = data

  if (!code || !name || !classificationId) {
    throw new Error('Code, name and classification are required')
  }

  const trimmedCode = String(code).trim()
  const trimmedName = String(name).trim()

  if (!trimmedCode || !trimmedName) {
    throw new Error('Code and name are required')
  }

  await ensureClassificationExists(classificationId)

  const exists = await db.objectOfExpenditure.findFirst({
    where: {
      deletedAt: null,
      OR: [
        { code: trimmedCode },
        { name: trimmedName },
      ],
    },
  })

  if (exists) {
    throw new Error('Object of expenditure code or name already exists')
  }

  return db.objectOfExpenditure.create({
    data: {
      code: trimmedCode,
      name: trimmedName,
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

  let classificationId
  if (query.classificationId !== undefined && query.classificationId !== null && query.classificationId !== '') {
    classificationId = Number(query.classificationId)
    if (!Number.isInteger(classificationId) || classificationId <= 0) {
      console.warn(
        '[objectOfExpenditure.service] invalid classification filter',
        { classificationId: query.classificationId }
      )
      throw new Error('Invalid classification id')
    }
  }

  const allowedSort = ['createdAt', 'code', 'name']
  const sortBy = allowedSort.includes(query.sortBy)
    ? query.sortBy
    : 'createdAt'

  const skip = (page - 1) * limit

  const where = {
    deletedAt: null,
    ...(classificationId && {
      classificationId,
    }),
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
export const getObjectOfExpenditureByIdService = async (idOrCode) => {
  const rawValue = String(idOrCode ?? '').trim()

  if (!rawValue) {
    throw new Error('Object of expenditure id or code is required')
  }

  const searchFilters = [
    { code: rawValue },
    { name: rawValue },
  ]

  const numericId = Number(rawValue)
  if (Number.isInteger(numericId) && numericId > 0) {
    searchFilters.unshift({ id: numericId })
  }

  const data = await db.objectOfExpenditure.findFirst({
    where: {
      deletedAt: null,
      OR: searchFilters,
    },
    include: {
      classification: true,
    },
  })

  if (!data) {
    console.warn(
      '[objectOfExpenditure.service] object of expenditure not found',
      { query: rawValue, searchFilters }
    )
    throw new Error('Object of expenditure not found')
  }

  return data
}

/* ================= UPDATE ================= */
export const updateObjectOfExpenditureService = async (id, data) => {
  const objectId = normalizePositiveInt(id, 'object id')

  const existing = await db.objectOfExpenditure.findFirst({
    where: {
      id: objectId,
      deletedAt: null,
    },
  })

  if (!existing) {
    throw new Error('Object of expenditure not found')
  }

  if (data.classificationId !== undefined && data.classificationId !== null) {
    await ensureClassificationExists(data.classificationId)
  }

  if (data.code || data.name) {
    const duplicate = await db.objectOfExpenditure.findFirst({
      where: {
        id: { not: objectId },
        deletedAt: null,
        OR: [
          data.code ? { code: String(data.code).trim() } : undefined,
          data.name ? { name: String(data.name).trim() } : undefined,
        ].filter(Boolean),
      },
    })

    if (duplicate) {
      throw new Error('Object of expenditure code or name already exists')
    }
  }

  return db.objectOfExpenditure.update({
    where: {
      id: objectId,
    },
    data: {
      ...(data.code && { code: String(data.code).trim() }),
      ...(data.name && { name: String(data.name).trim() }),
      ...(data.description !== undefined && {
        description: data.description?.trim() || null,
      }),
      ...(data.classificationId !== undefined &&
        data.classificationId !== null && {
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
  const objectId = normalizePositiveInt(id, 'object id')

  const existing = await db.objectOfExpenditure.findFirst({
    where: {
      id: objectId,
      deletedAt: null,
    },
  })

  if (!existing) {
    throw new Error('Object of expenditure not found')
  }

  return db.objectOfExpenditure.update({
    where: {
      id: objectId,
    },
    data: {
      deletedAt: new Date(),
    },
  })
}
