import * as service from '../services/objectOfExpenditure.route.js';

/* ================= CREATE ================= */
export const createExpenditure = async (req, res) => {
  try {
    const data = await service.createExpenditureService(
      req.body,
      req.user.id
    );
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ================= READ (LIST) ================= */
export const getExpenditures = async (req, res) => {
  try {
    const result = await service.getExpendituresService(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ================= READ (SINGLE) ================= */
export const getExpenditureById = async (req, res) => {
  try {
    const data = await service.getExpenditureByIdService(+req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE ================= */
export const updateExpenditure = async (req, res) => {
  try {
    const data = await service.updateExpenditureService(
      +req.params.id,
      req.body
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ================= DELETE ================= */
export const deleteExpenditure = async (req, res) => {
  try {
    await service.deleteExpenditureService(+req.params.id);
    res.json({ success: true, message: 'Expenditure deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
