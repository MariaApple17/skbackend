import { db } from '../config/db.config.js';
import { PERMISSIONS } from '../constants/permission.constant.js';

export const seedPermissionsIfEmpty = async () => {
  const count = await db.permission.count({
    where: { deletedAt: null },
  });

  if (count > 0) return;

  await db.permission.createMany({
    data: PERMISSIONS,
    skipDuplicates: true,
  });

  console.log('✅ Permissions seeded');
};
