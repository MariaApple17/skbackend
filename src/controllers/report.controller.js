import {
  getApprovalReport,
  getBudgetSummary,
  getProcurementReport,
  getProgramUtilization,
  getAccomplishmentReport,
  getFinancialStatusReport, // ✅ ADD THIS
} from '../services/report.service.js';

/* ===============================
   BUDGET SUMMARY
================================ */
export async function budgetSummary(req, res) {
  const result = await getBudgetSummary({
    fiscalYearId: req.query.fiscalYearId,
    search: req.query.search,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  });

  res.json({
    success: true,
    data: result.data,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
    },
  });
}

/* ===============================
   PROCUREMENT REPORT
================================ */
export async function procurementReport(req, res) {
  const result = await getProcurementReport({
    status: req.query.status,
    from: req.query.from,
    to: req.query.to,
    search: req.query.search,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  });

  res.json({
    success: true,
    data: result.data,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
    },
  });
}

/* ===============================
   APPROVAL REPORT
================================ */
export async function approvalReport(req, res) {
  const result = await getApprovalReport({
    requestId: req.query.requestId,
    search: req.query.search,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  });

  res.json({
    success: true,
    data: result.data,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
    },
  });
}

/* ===============================
   PROGRAM UTILIZATION
================================ */
export async function programUtilization(req, res) {
  const result = await getProgramUtilization({
    search: req.query.search,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  });

  res.json({
    success: true,
    data: result.data,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
    },
  });
}

/* ===============================
   ACCOMPLISHMENT REPORT
================================ */
export async function accomplishmentReport(req, res) {
  const result = await getAccomplishmentReport({
    search: req.query.search,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  });

  res.json({
    success: true,
    data: result.data,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
    },
  });
}

/* ===============================
   ✅ FINANCIAL STATUS REPORT
   Obligations from:
   - Procurement (MOOE)
   - Plantilla (Personal Services)
================================ */
export async function financialStatusReport(req, res) {
  try {
    const result = await getFinancialStatusReport();

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Financial Status Report Error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load financial status report',
    });
  }
}