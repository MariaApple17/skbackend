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
router.get('/', getFiscalYears);
router.get('/:id', getFiscalYear);
router.put('/:id', authMiddleware, updateFiscalYear);
router.delete('/:id', authMiddleware, deleteFiscalYear);

export default router;
