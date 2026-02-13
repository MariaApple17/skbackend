import { db } from '../config/db.config.js';

/* ======================================================
   GET USERS (SEARCH | FILTER | SORT | PAGINATION)
====================================================== */
export const getUsersService = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    status,
    roleId,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = query;

  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    AND: [
      search
        ? {
            OR: [
              { email: { contains: search } },
              { fullName: { contains: search } }
            ]
          }
        : {},
      status ? { status } : {},
      roleId ? { roleId: Number(roleId) } : {}
    ]
  };

  const [data, total] = await Promise.all([
    db.user.findMany({
      where,
      include: { role: true },
      skip: Number(skip),
      take: Number(limit),
      orderBy: { [sortBy]: sortOrder }
    }),
    db.user.count({ where })
  ]);

  return {
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};

/* ======================================================
   GET USER BY ID
====================================================== */
export const getUserByIdService = async (id) => {
  const user = await db.user.findFirst({
    where: { id: Number(id), deletedAt: null },
    include: { role: true }
  });

  if (!user) throw new Error('User not found');
  return user;
};

/* ======================================================
   UPDATE USER
====================================================== */
export const updateUserService = async (id, data) => {
  return db.user.update({
    where: { id: Number(id) },
    data
  });
};

/* ======================================================
   SOFT DELETE USER
====================================================== */
export const deleteUserService = async (id) => {
  return db.user.update({
    where: { id: Number(id) },
    data: { deletedAt: new Date() }
  });
};


/* ======================================================
   TOGGLE USER STATUS
====================================================== */
export const toggleUserStatusService = async (id) => {
  const user = await db.user.findFirst({
    where: {
      id: Number(id),
      deletedAt: null
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  let newStatus = 'ACTIVE';

  if (user.status === 'ACTIVE') newStatus = 'INACTIVE';
  else if (user.status === 'INACTIVE') newStatus = 'ACTIVE';
  else if (user.status === 'SUSPENDED') newStatus = 'ACTIVE';

  return db.user.update({
    where: { id: Number(id) },
    data: { status: newStatus }
  });
};
