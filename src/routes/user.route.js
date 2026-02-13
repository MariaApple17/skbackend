import express from 'express';

import {
  deleteUser,
  getUserById,
  getUsers,
  toggleUserStatus,
  updateUser,
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.patch('/:id/toggle-status', toggleUserStatus);
router.delete('/:id', deleteUser);

export default router;
