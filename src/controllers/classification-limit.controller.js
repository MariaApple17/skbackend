import {
  createClassificationLimitService,
  deleteClassificationLimitService,
  getClassificationLimitByIdService,
  getClassificationLimitsService,
  getLimitsByClassificationService,
  getRemainingBudgetService,
  updateClassificationLimitService,
} from '../services/classification-limit.service.js';

/* ======================================================
   CREATE CLASSIFICATION LIMIT
====================================================== */
export const createClassificationLimit = async (req, res) => {
  try {
    const data = await createClassificationLimitService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Classification limit created successfully',
      data,
    });
  } catch (error) {
    const status =
      error.message === 'Budget not found' ||
      error.message === 'Classification not found'
        ? 404
        : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   GET ALL CLASSIFICATION LIMITS
====================================================== */
export const getClassificationLimits = async (req, res) => {
  try {
    const { budgetId } = req.query;
    const data = await getClassificationLimitsService(budgetId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch classification limits',
    });
  }
};

/* ======================================================
   GET CLASSIFICATION LIMIT BY ID
====================================================== */
export const getClassificationLimitById = async (req, res) => {
  try {
    const data = await getClassificationLimitByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    const status =
      error.message === 'Classification limit not found' ? 404 : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   UPDATE CLASSIFICATION LIMIT
====================================================== */
export const updateClassificationLimit = async (req, res) => {
  try {
    const data = await updateClassificationLimitService(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: 'Classification limit updated successfully',
      data,
    });
  } catch (error) {
    const status =
      error.message === 'Classification limit not found' ? 404 : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   DELETE CLASSIFICATION LIMIT
====================================================== */
export const deleteClassificationLimit = async (req, res) => {
  try {
    await deleteClassificationLimitService(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Classification limit deleted successfully',
    });
  } catch (error) {
    const status =
      error.message === 'Classification limit not found' ? 404 : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   GET LIMITS BY CLASSIFICATION ID
====================================================== */
export const getLimitsByClassification = async (req, res) => {
  try {
    const data = await getLimitsByClassificationService(
      req.params.classificationId
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    const status =
      error.message === 'Classification not found' ? 404 : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   GET REMAINING BUDGET
====================================================== */
export const getRemainingBudget = async (req, res) => {
  try {
    const data = await getRemainingBudgetService(req.params.budgetId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    const status = error.message === 'Budget not found' ? 404 : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};