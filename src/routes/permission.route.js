import express from 'express';

import { getPermissions } from '../controllers/permission.controller.js';

const router = express.Router();

/* ================= GET ALL ================= */
router.get('/', getPermissions);

export default router;
