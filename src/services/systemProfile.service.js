import { db } from '../config/db.config.js';

/* ======================================================
   HELPERS
====================================================== */
const isNonEmptyString = (val) =>
  typeof val === 'string' && val.trim().length > 0;

/* ======================================================
   RESOLVE FISCAL YEAR
====================================================== */
const resolveFiscalYear = async (fiscalYearId) => {
  let fiscalYear;

  if (fiscalYearId) {
    fiscalYear = await db.fiscalYear.findUnique({
      where: { id: Number(fiscalYearId) },
    });

    if (!fiscalYear) {
      throw {
        statusCode: 404,
        message: 'Fiscal year not found',
      };
    }
  } else {
    fiscalYear = await db.fiscalYear.findFirst({
      where: { isActive: true },
      orderBy: { year: 'desc' },
    });

    if (!fiscalYear) {
      throw {
        statusCode: 404,
        message: 'No active fiscal year found',
      };
    }
  }

  return fiscalYear;
};

/* ======================================================
   GET SYSTEM PROFILE
====================================================== */
export const getSystemProfile = async (fiscalYearId) => {
  const fiscalYear = await resolveFiscalYear(fiscalYearId);

  let profile = await db.systemProfile.findUnique({
    where: { fiscalYearId: fiscalYear.id },
    include: { fiscalYear: true },
  });

  // Auto-create profile if missing
  if (!profile) {
    profile = await db.systemProfile.create({
      data: {
        fiscalYearId: fiscalYear.id,
        systemName: 'SK Budget Management System',
        systemDescription: 'Default system profile',
        location: '',
        logoUrl: '',
      },
      include: { fiscalYear: true },
    });
  }

  return profile;
};

/* ======================================================
   UPDATE SYSTEM PROFILE
====================================================== */
export const updateSystemProfile = async (
  payload,
  fiscalYearId
) => {
  const fiscalYear = await resolveFiscalYear(fiscalYearId);

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
    include: { fiscalYear: true },
  });
};