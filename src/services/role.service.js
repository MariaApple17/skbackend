import { db } from '../config/db.config.js';
import { seedPermissionsIfEmpty } from '../seeders/permission.seeder.js';
import {
  getAllPermissions,
  getPermissionsByKeys,
} from './permission.service.js';

/* ======================================================
   CREATE ROLE
====================================================== */
export const createRoleService = async (data) => {
  const { name, description, permissions = [] } = data;

  if (!name || !name.trim()) {
    throw new Error('Role name is required');
  }

  // Check if role name already exists (ignore soft-deleted)
  const existingRole = await db.role.findFirst({
    where: {
      name: name.trim(),
      deletedAt: null,
    },
  });

  if (existingRole) {
    throw new Error('Role name already exists');
  }

  // Ensure permissions exist
  await seedPermissionsIfEmpty();

  // If no permissions passed → assign ALL
  const permissionRecords = permissions.length
    ? await getPermissionsByKeys(permissions)
    : await getAllPermissions();

  return db.role.create({
    data: {
      name: name.trim(),
      description,
      permissions: {
        create: permissionRecords.map((p) => ({
          permissionId: p.id,
        })),
      },
    },
    include: {
      permissions: {
        include: { permission: true },
      },
    },
  });
};

/* ======================================================
   GET ALL ROLES
====================================================== */
export const getAllRolesService = async () => {
  return db.role.findMany({
    where: { deletedAt: null },
    include: {
      permissions: {
        include: { permission: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

/* ======================================================
   GET ROLE BY ID
====================================================== */
export const getRoleByIdService = async (id) => {
  return db.role.findFirst({
    where: { id, deletedAt: null },
    include: {
      permissions: {
        include: { permission: true },
      },
    },
  });
};

/* ======================================================
   UPDATE ROLE
====================================================== */
export const updateRoleService = async (id, data) => {
  const { name, description, permissions = [] } = data;

  const permissionRecords = permissions.length
    ? await getPermissionsByKeys(permissions)
    : await getAllPermissions();

  return db.role.update({
    where: { id },
    data: {
      name,
      description,
      permissions: {
        deleteMany: {}, // remove old permissions
        create: permissionRecords.map((p) => ({
          permissionId: p.id,
        })),
      },
    },
    include: {
      permissions: {
        include: { permission: true },
      },
    },
  });
};

/* ======================================================
   SOFT DELETE ROLE
====================================================== */
export const deleteRoleService = async (id) => {
  return db.role.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

/* ======================================================
   GET ROLE PERMISSIONS
====================================================== */
export const getRolePermissionsService = async (roleId) => {
  const role = await db.role.findFirst({
    where: { id: roleId, deletedAt: null },
    include: {
      permissions: {
        include: { permission: true },
      },
    },
  });

  return role?.permissions.map((rp) => rp.permission) || [];
};
