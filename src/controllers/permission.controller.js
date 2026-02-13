import { getAllPermissions } from '../services/permission.service.js';

/* ================= GET ALL ================= */
export const getPermissions = async (req, res) => {
  try {
    const permissions = await getAllPermissions();
    res.json({ success: true, data: permissions });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
