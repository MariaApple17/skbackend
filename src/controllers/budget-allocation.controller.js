import * as budgetAllocationService
  from '../services/budget-allocation.service.js';

/* ================= CREATE ================= */
export const createBudgetAllocation = async (req, res) => {
  try {
    const allocation =
      await budgetAllocationService.createBudgetAllocation(req.body);

    return res.status(201).json({
      success: true,
      message: 'Budget allocation created successfully',
      data: allocation,
    });
  } catch (error) {
    const status = getErrorStatus(error.message);

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
export const getAllBudgetAllocations = async (req, res) => {
  try {
    const {
      search,
      budgetId,
      programId,
      classificationId,
      objectOfExpenditureId,
      page,
      limit,
      sortBy,
      sortOrder,
    } = req.query;

    const result =
      await budgetAllocationService.getAllBudgetAllocations({
        search: search || undefined,
        budgetId: budgetId ? Number(budgetId) : undefined,
        programId: programId ? Number(programId) : undefined,
        classificationId: classificationId
          ? Number(classificationId)
          : undefined,
        objectOfExpenditureId: objectOfExpenditureId
          ? Number(objectOfExpenditureId)
          : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sortBy,
        sortOrder,
      });

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Get Budget Allocations Error:', error);

    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to fetch budget allocations',
    });
  }
};

/* ================= GET BY ID ================= */
export const getBudgetAllocationById = async (req, res) => {
  try {
    const data = await budgetAllocationService.getBudgetAllocationById(
      Number(req.params.id)
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    const status = getErrorStatus(error.message);

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
export const updateBudgetAllocation = async (req, res) => {
  try {
    const data = await budgetAllocationService.updateBudgetAllocation(
      Number(req.params.id),
      req.body
    );

    return res.status(200).json({
      success: true,
      message: 'Budget allocation updated successfully',
      data,
    });
  } catch (error) {
    const status = getErrorStatus(error.message);

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteBudgetAllocation = async (req, res) => {
  try {
    await budgetAllocationService.deleteBudgetAllocation(
      Number(req.params.id)
    );

    return res.status(200).json({
      success: true,
      message: 'Budget allocation deleted successfully',
    });
  } catch (error) {
    const status = getErrorStatus(error.message);

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= REPORT ================= */
export const getProgramBudgetSummary = async (_req, res) => {
  try {
    const data = await budgetAllocationService.getProgramBudgetSummary();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET REMAINING CLASSIFICATION LIMIT ================= */
export const getRemainingClassificationLimit = async (req, res) => {
  try {
    const { budgetId, classificationId } = req.params;

    const data =
      await budgetAllocationService.getRemainingClassificationLimit(
        Number(budgetId),
        Number(classificationId)
      );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    const status = getErrorStatus(error.message);

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= HELPER ================= */
const getErrorStatus = (message) => {
  if (!message) return 400;

  const notFoundPatterns = [
    'not found',
    'not set',
  ];

  const isNotFound = notFoundPatterns.some((pattern) =>
    message.toLowerCase().includes(pattern)
  );

  return isNotFound ? 404 : 400;
};