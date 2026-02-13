import * as budgetService from '../services/budget.service.js';

/* ======================================================
   CREATE
====================================================== */
export const createBudget = async (req, res) => {
  try {
    const budget = await budgetService.createBudgetService(req.body);
    res.status(201).json({
      success: true,
      message: 'Total budget created successfully',
      data: budget
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* ======================================================
   GET ALL
====================================================== */
export const getAllBudgets = async (req, res) => {
  try {
    const budgets = await budgetService.getAllBudgetsService();
    res.json({
      success: true,
      data: budgets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ======================================================
   GET ONE
====================================================== */
export const getBudgetById = async (req, res) => {
  try {
    const budget = await budgetService.getBudgetByIdService(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ======================================================
   UPDATE
====================================================== */
export const updateBudget = async (req, res) => {
  try {
    const budget = await budgetService.updateBudgetService(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: 'Budget updated successfully',
      data: budget
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* ======================================================
   DELETE (SOFT)
====================================================== */
export const deleteBudget = async (req, res) => {
  try {
    await budgetService.deleteBudgetService(req.params.id);
    res.json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
