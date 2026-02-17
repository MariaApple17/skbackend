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

/* =====================================================
   FILE UPLOAD ROUTE (MUST BE ABOVE /:id ROUTES)
===================================================== */

router.post(
  '/upload-proof',
  authMiddleware,
  upload.single('file'), // must match frontend formData.append('file')
  uploadProof
);

/* =====================================================
   PROCUREMENT CRUD & STATUS ROUTES
===================================================== */

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

export default router;
