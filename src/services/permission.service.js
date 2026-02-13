import { db } from '../config/db.config.js';

export const getAllPermissions = async () => {
  return db.permission.findMany({
    where: { deletedAt: null },
    orderBy: { module: 'asc' },
  });
};

export const getPermissionsByKeys = async (keys = []) => {
  return db.permission.findMany({
    where: {
      key: { in: keys },
      deletedAt: null,
    },
  });
};
