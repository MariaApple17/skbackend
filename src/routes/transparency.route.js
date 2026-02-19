import { Router } from 'express';

import { getPublicBudgetPlan } from '../controllers/transparency.controller.js';

const router = Router();

/* PUBLIC: SK Transparency */
router.get('/budget-plan', getPublicBudgetPlan);

export default router;
