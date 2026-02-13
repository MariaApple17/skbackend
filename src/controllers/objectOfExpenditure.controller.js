import * as service from '../services/objectOfExpenditure.service.js';

/* ================= CREATE ================= */
export const createObjectOfExpenditure = async (req, res) => {
  try {
    const data = await service.createObjectOfExpenditureService(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ================= READ (LIST) ================= */
export const getObjectsOfExpenditure = async (req, res) => {
  try {
    const result = await service.getObjectsOfExpenditureService(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ================= READ (SINGLE) ================= */
export const getObjectOfExpenditureById = async (req, res) => {
  try {
    const data = await service.getObjectOfExpenditureByIdService(+req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE ================= */
export const updateObjectOfExpenditure = async (req, res) => {
  try {
    const data = await service.updateObjectOfExpenditureService(
      +req.params.id,
      req.body
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ================= DELETE ================= */
export const deleteObjectOfExpenditure = async (req, res) => {
  try {
    await service.deleteObjectOfExpenditureService(+req.params.id);
    res.json({ success: true, message: 'Object of expenditure deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
