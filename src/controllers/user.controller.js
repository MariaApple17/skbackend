import {
  deleteUserService,
  getUserByIdService,
  getUsersService,
  toggleUserStatusService,
  updateUserService,
} from '../services/user.service.js';

/* ================= GET ALL ================= */
export const getUsers = async (req, res) => {
  try {
    const result = await getUsersService(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ================= GET BY ID ================= */
export const getUserById = async (req, res) => {
  try {
    const data = await getUserByIdService(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE ================= */
export const updateUser = async (req, res) => {
  try {
    const data = await updateUserService(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ================= DELETE ================= */
export const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ================= TOGGLE STATUS ================= */
export const toggleUserStatus = async (req, res) => {
  try {
    const data = await toggleUserStatusService(req.params.id);
    res.json({
      success: true,
      message: 'User status updated successfully',
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};