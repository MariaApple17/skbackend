import { db } from '../config/db.config.js';

/* ======================================================
   HELPERS
====================================================== */
const isNonEmptyString = (val) =>
  typeof val === 'string' && val.trim().length > 0;

/* ================= GET ================= */
export const getSystemProfile = async () => {
  const fiscalYear = await db.fiscalYear.findFirst({
    where: { isActive: true },
  });

  if (!fiscalYear) {
    throw {
      statusCode: 404,
      message: 'No active fiscal year found',
    };
  }

  let profile = await db.systemProfile.findUnique({
    where: { fiscalYearId: fiscalYear.id },
    include: { fiscalYear: true },
  });

  // ✅ auto-create default
  if (!profile) {
    profile = await db.systemProfile.create({
      data: {
        fiscalYearId: fiscalYear.id,
        systemName: 'SK Budget Management System',
        systemDescription: 'Default system profile',
        location: 'Baranggay BongBong, Trinidad, Bohol',
        logoUrl: '',
      },
      include: { fiscalYear: true },
    });
  }

  return profile;
};

/* ================= UPDATE ================= */
export const updateSystemProfile = async (payload) => {
  const fiscalYear = await db.fiscalYear.findFirst({
    where: { isActive: true },
  });

  if (!fiscalYear) {
    throw {
      statusCode: 404,
      message: 'No active fiscal year found',
    };
  }

  const profile = await db.systemProfile.findUnique({
    where: { fiscalYearId: fiscalYear.id },
  });

  if (!profile) {
    throw {
      statusCode: 404,
      message: 'System profile not found',
    };
  }

  /* ================= VALIDATION ================= */

  // systemName is required when provided
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

  // ❌ Prevent empty update
  if (Object.keys(payload).length === 0) {
    throw {
      statusCode: 400,
      message: 'No valid fields provided for update',
    };
  }

  /* ================= UPDATE ================= */
  return db.systemProfile.update({
    where: { id: profile.id },
    data: payload,
  });
};
