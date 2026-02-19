// src/middlewares/activeFiscalYear.middleware.js

import { db } from '../config/db.config.js';

export const activeFiscalYear = async (req, res, next) => {
  try {
    const activeFY = await db.fiscalYear.findFirst({
      where: { isActive: true },
    });

    console.log('DEBUG ACTIVE FY:', activeFY);

    if (!activeFY) {
      return res.status(400).json({
        success: false,
        message: 'No active fiscal year is set.',
      });
    }

    req.activeFiscalYearId = activeFY.id;
    req.activeFiscalYear = activeFY;

    next();
  } catch (error) {
    console.error('Active Fiscal Year Middleware Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to determine active fiscal year.',
    });
  }
};
