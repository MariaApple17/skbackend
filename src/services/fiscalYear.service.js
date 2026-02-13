import { db } from '../config/db.config.js';

/* ======================================================
   CREATE FISCAL YEAR
====================================================== */
export const createFiscalYearService = async ({ year, isActive = false }) => {
  const existing = await db.fiscalYear.findUnique({
    where: { year },
  });

  if (existing) {
    throw new Error('Fiscal year already exists');
  }

  // If setting active → deactivate others
  if (isActive) {
    await db.fiscalYear.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }

  return db.fiscalYear.create({
    data: { year, isActive },
  });
};

/* ======================================================
   GET ALL FISCAL YEARS
====================================================== */
export const getAllFiscalYearsService = async () => {
  return db.fiscalYear.findMany({
    where: { deletedAt: null },
    orderBy: { year: 'desc' },
  });
};

/* ======================================================
   GET SINGLE FISCAL YEAR
====================================================== */
export const getFiscalYearByIdService = async (id) => {
  const fy = await db.fiscalYear.findFirst({
    where: { id: Number(id), deletedAt: null },
  });

  if (!fy) {
    throw new Error('Fiscal year not found');
  }

  return fy;
};

/* ======================================================
   UPDATE FISCAL YEAR
====================================================== */
export const updateFiscalYearService = async (id, data) => {
  const fiscalYear = await getFiscalYearByIdService(id);

  if (data.isActive === true) {
    await db.fiscalYear.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }

  return db.fiscalYear.update({
    where: { id: fiscalYear.id },
    data,
  });
};

/* ======================================================
   SOFT DELETE FISCAL YEAR
====================================================== */
export const deleteFiscalYearService = async (id) => {
  const fiscalYear = await getFiscalYearByIdService(id);

  return db.fiscalYear.update({
    where: { id: fiscalYear.id },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });
};
