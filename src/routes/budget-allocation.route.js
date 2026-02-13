import express from 'express';

import {
  createBudgetAllocation,
  deleteBudgetAllocation,
  getAllBudgetAllocations,
  getBudgetAllocationById,
  getProgramBudgetSummary,
  getRemainingClassificationLimit,
  updateBudgetAllocation,
} from '../controllers/budget-allocation.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

/* CRUD */
router.post('/', authMiddleware, createBudgetAllocation);
router.get('/', authMiddleware, getAllBudgetAllocations);
router.get('/:id', authMiddleware, getBudgetAllocationById);
router.put('/:id', authMiddleware, updateBudgetAllocation);
router.delete('/:id', authMiddleware, deleteBudgetAllocation);

/* REPORT */
router.get('/reports/program-summary', authMiddleware, getProgramBudgetSummary);

/* GET REMAINING CLASSIFICATION LIMIT */
router.get('/remaining/:budgetId/:classificationId', authMiddleware, getRemainingClassificationLimit);

export default router;