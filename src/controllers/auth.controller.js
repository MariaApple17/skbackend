import {
  getMeService,
  loginUser,
  registerUser,
} from '../services/auth.service.js';

/* =========================
   REGISTER
========================= */
export const register = async (req, res) => {
  try {
    // create user (roleId is provided in request body)
    const created = await registerUser(req.body);

    // re-fetch full user with role + permissions
    const user = await getMeService(created.id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const payload = req.body;

    const data = await loginUser(payload);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   GET CURRENT USER
========================= */
export const me = async (req, res) => {
  try {
    // ✅ FIX: use req.user.id
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const user = await getMeService(req.user.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    const status =
      error.message === 'User ID is required' ||
      error.message === 'Invalid User ID' ||
      error.message === 'User not found' ||
      error.message.includes('Account')
        ? 401
        : 500;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

