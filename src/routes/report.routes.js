import { Router } from 'express';

import {
  approvalReport,
  budgetSummary,
  procurementReport,
  programUtilization,
} from '../controllers/report.controller.js';

const router = Router();

router.get(
  "/budget-summary",
  budgetSummary
);

router.get(
  "/procurements",
  procurementReport
);

router.get(
  "/approvals",
  approvalReport
);

router.get(
  "/program-utilization",
  programUtilization
);

export default router;
