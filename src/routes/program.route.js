import express from 'express';

import {
  addProgramDocuments,
  createProgram,
  deleteProgram,
  getProgramById,
  getPrograms,
  toggleProgramStatus,
  updateProgram,
  approveProgram,
  rejectProgram,
} from '../controllers/program.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { uploadProgramImage } from '../middlewares/upload.middleware.js';

const router = express.Router();

/* ======================================================
   CREATE PROGRAM (MULTIPLE DOCUMENT IMAGES)
====================================================== */
router.post(
  '/',
  authMiddleware,
  uploadProgramImage.array('documents', 10), // ✅ multiple images
  createProgram
);

/* ======================================================
   GET ALL
====================================================== */
router.get('/', authMiddleware, getPrograms);

/* ======================================================
   GET BY ID
====================================================== */
router.get('/:id', authMiddleware, getProgramById);

/* ======================================================
   UPDATE PROGRAM (NO IMAGE UPLOAD HERE)
====================================================== */
router.put(
  '/:id',
  authMiddleware,
  updateProgram
);

/* ======================================================
   ADD PROGRAM DOCUMENT IMAGES (SEPARATE ENDPOINT)
====================================================== */
router.post(
  '/:id/documents',
  authMiddleware,
  uploadProgramImage.array('documents', 10),
  addProgramDocuments
);

/* ======================================================
   TOGGLE STATUS
====================================================== */
router.patch(
  '/toggle-status/:id',
  authMiddleware,
  toggleProgramStatus
);
/* ======================================================
   APPROVE PROGRAM
====================================================== */

router.patch(
  "/:id/approve",
  authMiddleware,
  approveProgram
)

/* ======================================================
   REJECT PROGRAM
====================================================== */

router.patch(
  "/:id/reject",
  authMiddleware,
  rejectProgram
)

/* ======================================================
   DELETE (SOFT)
====================================================== */
router.delete('/:id', authMiddleware, deleteProgram);

export default router;
