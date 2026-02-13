import express from 'express';

import {
  createClassification,
  deleteClassification,
  getClassificationById,
  getClassifications,
  updateClassification,
} from '../controllers/classification.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

/* ======================================================
   CLASSIFICATION ROUTES (PROTECTED)
====================================================== */

router.post('/', authMiddleware, createClassification);
router.get('/', authMiddleware, getClassifications);
router.get('/:id', authMiddleware, getClassificationById);
router.put('/:id', authMiddleware, updateClassification);
router.delete('/:id', authMiddleware, deleteClassification);

export default router;
