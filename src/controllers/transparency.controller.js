import { getPublicBudgetPlanService } from '../services/transparency.service.js';

export const getPublicBudgetPlan = async (req, res) => {
  try {
    const data = await getPublicBudgetPlanService({
      year: req.query.year ? Number(req.query.year) : undefined,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    const known = [
      'Fiscal year not found',
      'No budget found for this fiscal year',
    ];

    return res.status(known.includes(error.message) ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};
