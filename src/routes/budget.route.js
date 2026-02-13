import { Router } from 'express';

import {
  createBudget,
  deleteBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
} from '../controllers/budget.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

/* ================= TOTAL BUDGET ROUTES ================= */
router.post('/', authMiddleware, createBudget);
router.get('/', authMiddleware, getAllBudgets);
router.get('/:id', authMiddleware, getBudgetById);
router.put('/:id', authMiddleware, updateBudget);
router.delete('/:id', authMiddleware, deleteBudget);

export default router;
