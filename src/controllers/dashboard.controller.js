import * as dashboardService from '../services/dashboard.service.js';

export const getDashboard = async (req, res) => {
  try {
    /**
     * Supported query params:
     * ?mode=ALL
     * ?year=2024
     * ?fiscalYearId=3
     */
    const { mode, year, fiscalYearId } = req.query;

    const data = await dashboardService.getDashboardData({
      mode: mode === 'ALL' ? 'ALL' : 'YEAR',
      year: year ? Number(year) : undefined,
      fiscalYearId: fiscalYearId ? Number(fiscalYearId) : undefined,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('❌ Dashboard Error:', error);

    /* ================= BUSINESS LOGIC ERRORS ================= */
    const knownErrors = [
      'No fiscal year with a budget exists',
      'No active fiscal year set',
      'Fiscal year not found',
      'No budget found for this fiscal year',
    ];

    if (knownErrors.includes(error.message)) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    /* ================= SYSTEM ERRORS ================= */
    return res.status(500).json({
      success: false,
      message: 'Dashboard service error',
    });
  }
};
