import { Router } from 'express';

import {
  createClassificationLimit,
  deleteClassificationLimit,
  getClassificationLimitById,
  getClassificationLimits,
  getLimitsByClassification,
  getRemainingBudget,
  updateClassificationLimit,
} from '../controllers/classification-limit.controller.js';

const router = Router();

// GET /api/classification-limits
router.get('/', getClassificationLimits);

// GET /api/classification-limits/remaining/:budgetId
router.get('/remaining/:budgetId', getRemainingBudget);

// GET /api/classification-limits/classification/:classificationId
router.get('/classification/:classificationId', getLimitsByClassification);

// GET /api/classification-limits/:id
router.get('/:id', getClassificationLimitById);

// POST /api/classification-limits
router.post('/', createClassificationLimit);

// PUT /api/classification-limits/:id
router.put('/:id', updateClassificationLimit);

// DELETE /api/classification-limits/:id
router.delete('/:id', deleteClassificationLimit);

export default router;