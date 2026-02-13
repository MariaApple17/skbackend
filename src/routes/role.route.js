import { Router } from 'express';

import {
  createRole,
  deleteRole,
  getRoleById,
  getRolePermissions,
  getRoles,
  updateRole,
} from '../controllers/role.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/", authMiddleware, createRole);
router.get("/", authMiddleware, getRoles);
router.get("/:id", authMiddleware, getRoleById);
router.put("/:id", authMiddleware, updateRole);
router.delete("/:id", authMiddleware, deleteRole);

router.get("/:id/permissions", authMiddleware, getRolePermissions);

export default router;
