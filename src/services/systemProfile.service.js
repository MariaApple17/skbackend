import { db } from '../config/db.config.js';

const isNonEmptyString = (val) =>
  typeof val === 'string' && val.trim().length > 0;

/* ======================================================
   GET SYSTEM PROFILE (GLOBAL)
====================================================== */
export const getSystemProfile = async () => {
  let profile = await db.systemProfile.findFirst();

  // Auto-create default profile if none exists
  if (!profile) {
    profile = await db.systemProfile.create({
      data: {
        systemName: 'SK360',
        systemDescription:
          'Project, Budget, and Report Monitoring System',
        location: '',
        logoUrl: '',
      },
    });
  }

  return profile;
};

/* ======================================================
   UPDATE SYSTEM PROFILE (GLOBAL)
====================================================== */
export const updateSystemProfile = async (payload) => {
  const profile = await db.systemProfile.findFirst();

  if (!profile) {
    throw {
      statusCode: 404,
      message: 'System profile not found',
    };
  }

  /* ================= VALIDATION ================= */

  if (
    payload.systemName !== undefined &&
    !isNonEmptyString(payload.systemName)
  ) {
    throw {
      statusCode: 400,
      message: 'System name must be a non-empty string',
    };
  }

  if (
    payload.systemDescription !== undefined &&
    typeof payload.systemDescription !== 'string'
  ) {
    throw {
      statusCode: 400,
      message: 'System description must be a string',
    };
  }

  if (
    payload.location !== undefined &&
    typeof payload.location !== 'string'
  ) {
    throw {
      statusCode: 400,
      message: 'Location must be a string',
    };
  }

  if (
    payload.logoUrl !== undefined &&
    typeof payload.logoUrl !== 'string'
  ) {
    throw {
      statusCode: 400,
      message: 'Logo URL must be a string',
    };
  }

  if (Object.keys(payload).length === 0) {
    throw {
      statusCode: 400,
      message: 'No valid fields provided for update',
    };
  }

  return db.systemProfile.update({
    where: { id: profile.id },
    data: payload,
  });
};