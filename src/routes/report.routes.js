import { Router } from 'express';

import {
  approvalReport,
  budgetSummary,
  procurementReport,
  programUtilization,
   accomplishmentReport,
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
router.get(
  "/accomplishment",
  accomplishmentReport
);


export default router;
