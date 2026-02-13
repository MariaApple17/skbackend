import {
  createRoleService,
  deleteRoleService,
  getAllRolesService,
  getRoleByIdService,
  getRolePermissionsService,
  updateRoleService,
} from '../services/role.service.js';

/* ================= CREATE ================= */
export const createRole = async (req, res) => {
  try {
    const role = await createRoleService(req.body);
    res.status(201).json({ success: true, data: role });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET ALL ================= */
export const getRoles = async (req, res) => {
  try {
    const roles = await getAllRolesService();
    res.json({ success: true, data: roles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET BY ID ================= */
export const getRoleById = async (req, res) => {
  try {
    const role = await getRoleByIdService(Number(req.params.id));

    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    res.json({ success: true, data: role });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE ================= */
export const updateRole = async (req, res) => {
  try {
    const role = await updateRoleService(
      Number(req.params.id),
      req.body
    );
    res.json({ success: true, data: role });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DELETE ================= */
export const deleteRole = async (req, res) => {
  try {
    await deleteRoleService(Number(req.params.id));
    res.json({ success: true, message: "Role deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET PERMISSIONS ================= */
export const getRolePermissions = async (req, res) => {
  try {
    const permissions = await getRolePermissionsService(
      Number(req.params.id)
    );
    res.json({ success: true, data: permissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
