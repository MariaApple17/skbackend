import { Router } from 'express';

import {
  approveRequest,
  completeRequest,
  createRequest,
  deleteRequest,
  getAllRequests,
  getDraftRequest,
  markPurchased,
  rejectRequest,
  submitRequest,
  updateRequest,
  uploadProof,
} from '../controllers/procurement.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = Router();

/* =========================
   AUTHENTICATED ROUTES
========================= */

router.post('/', authMiddleware, createRequest);
router.put('/:id', authMiddleware, updateRequest);
router.patch('/:id/submit', authMiddleware, submitRequest);
router.patch('/:id/approve', authMiddleware, approveRequest);
router.patch('/:id/reject', authMiddleware, rejectRequest);
router.patch('/:id/purchase', authMiddleware, markPurchased);
router.patch('/:id/complete', authMiddleware, completeRequest);
router.get('/', authMiddleware, getAllRequests);
router.get('/:id/draft', authMiddleware, getDraftRequest);
router.delete('/:id', authMiddleware, deleteRequest);

/* =========================
   FILE UPLOAD (CLOUDINARY)
========================= */

router.post(
  '/upload-proof',
  authMiddleware,        // ✅ auth first
  upload.single('file'),// ✅ reuse baseUpload
  uploadProof            // ✅ cloudinary controller
);

export default router;
