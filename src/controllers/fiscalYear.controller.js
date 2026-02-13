import {
  createFiscalYearService,
  deleteFiscalYearService,
  getAllFiscalYearsService,
  getFiscalYearByIdService,
  updateFiscalYearService,
} from '../services/fiscalYear.service.js';

/* ======================================================
   CREATE
====================================================== */
export const createFiscalYear = async (req, res) => {
  try {
    const data = await createFiscalYearService(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ======================================================
   READ ALL
====================================================== */
export const getFiscalYears = async (_req, res) => {
  const data = await getAllFiscalYearsService();
  res.json({ success: true, data });
};

/* ======================================================
   READ ONE
====================================================== */
export const getFiscalYear = async (req, res) => {
  try {
    const data = await getFiscalYearByIdService(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

/* ======================================================
   UPDATE
====================================================== */
export const updateFiscalYear = async (req, res) => {
  try {
    const data = await updateFiscalYearService(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ======================================================
   DELETE (SOFT)
====================================================== */
export const deleteFiscalYear = async (req, res) => {
  try {
    const data = await deleteFiscalYearService(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
