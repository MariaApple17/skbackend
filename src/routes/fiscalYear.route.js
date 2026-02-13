import { Router } from 'express';

import {
  createFiscalYear,
  deleteFiscalYear,
  getFiscalYear,
  getFiscalYears,
  updateFiscalYear,
} from '../controllers/fiscalYear.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/',authMiddleware, createFiscalYear);
router.get('/',authMiddleware, getFiscalYears);
router.get('/:id',authMiddleware, getFiscalYear);
router.put('/:id', authMiddleware, updateFiscalYear);
router.delete('/:id', authMiddleware, deleteFiscalYear);

export default router;
