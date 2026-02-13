import {
  getApprovalReport,
  getBudgetSummary,
  getProcurementReport,
  getProgramUtilization,
} from '../services/report.service.js';

/* ===============================
   BUDGET SUMMARY
   Query:
   - fiscalYearId
   - search
   - page
   - limit
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
   Query:
   - status
   - from
   - to
   - search
   - page
   - limit
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
   Query:
   - requestId
   - search
   - page
   - limit
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
   Query:
   - search
   - page
   - limit
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
