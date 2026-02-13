import express from 'express';

import {
  login,
  me,
  register,
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', authMiddleware, register);
router.post('/login', login);

/* =========================
   AUTHENTICATED
========================= */
router.get('/me', authMiddleware, me);

export default router;
