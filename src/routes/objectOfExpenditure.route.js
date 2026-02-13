import express from 'express';

import {
  createObjectOfExpenditure,
  deleteObjectOfExpenditure,
  getObjectOfExpenditureById,
  getObjectsOfExpenditure,
  updateObjectOfExpenditure,
} from '../controllers/objectOfExpenditure.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

/* ======================================================
   OBJECT OF EXPENDITURE ROUTES
====================================================== */

router.post('/', authMiddleware, createObjectOfExpenditure);
router.get('/', authMiddleware, getObjectsOfExpenditure);
router.get('/:id', authMiddleware, getObjectOfExpenditureById);
router.put('/:id', authMiddleware, updateObjectOfExpenditure);
router.delete('/:id', authMiddleware, deleteObjectOfExpenditure);

export default router;
