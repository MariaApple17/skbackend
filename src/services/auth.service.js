import { db } from '../config/db.config.js';
import { generateToken } from '../utils/jwt.util.js';
import {
  comparePassword,
  hashPassword,
} from '../utils/password.util.js';

/* =========================
   REGISTER USER
========================= */
export const registerUser = async ({ email, password, fullName, roleId }) => {
  const exists = await db.user.findFirst({
    where: { email, deletedAt: null },
  });

  if (exists) {
    throw new Error('Email already exists');
  }

  if (!roleId) {
    throw new Error('Role ID is required');
  }

  const role = await db.role.findFirst({
    where: {
      id: Number(roleId),
      deletedAt: null,
    },
  });

  if (!role) {
    throw new Error('Invalid role ID');
  }

  const hashed = await hashPassword(password);

  return db.user.create({
    data: {
      email,
      password: hashed,
      fullName,
      roleId: role.id, // ✅ ROLE FROM REQUEST
    },
  });
};


/* =========================
   LOGIN USER
========================= */
export const loginUser = async (payload) => {
  // ✅ validate payload first
  if (!payload) {
    throw new Error('Request body is required');
  }

  if (!payload.email || !payload.password) {
    throw new Error('Email and password are required');
  }

  const user = await db.user.findFirst({
    where: {
      email: payload.email,
      deletedAt: null,
    },
    include: {
      role: {
        include: {
          permissions: {
            where: { deletedAt: null },
            include: { permission: true },
          },
        },
      },
    },
  });

  if (!user) throw new Error('Invalid credentials');
  if (user.status !== 'ACTIVE') {
    throw new Error(`Account ${user.status}`);
  }

  const isValid = await comparePassword(
    payload.password,
    user.password
  );

  if (!isValid) throw new Error('Invalid credentials');

  const role = user.role
    ? {
        id: user.role.id,
        name: user.role.name,
        permissions: user.role.permissions.map(p => p.permission.key),
      }
    : null;

  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      role,
    },
  };
};


/* =========================
   GET CURRENT USER
========================= */
export const getMeService = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  if (isNaN(Number(userId))) throw new Error('Invalid User ID');

  const user = await db.user.findFirst({
    where: {
      id: Number(userId),
      deletedAt: null,
    },
    include: {
      role: {
        include: {
          permissions: {
            where: { deletedAt: null },
            include: { permission: true },
          },
        },
      },
    },
  });

  if (!user) throw new Error('User not found');
  if (user.status !== 'ACTIVE')
    throw new Error(`Account ${user.status}`);

  const role = user.role
    ? {
        id: user.role.id,
        name: user.role.name,
        permissions: user.role.permissions.map(p => p.permission.key),
      }
    : null;

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    status: user.status,
    role,
    createdAt: user.createdAt,
  };
};
