import { BudgetCategory } from '@prisma/client';

export const BUDGET_REFERENCE_CLASSIFICATIONS = [
  {
    id: 1,
    code: 'PS',
    name: 'Personnel Services',
    description: 'Salaries and employee compensation',
    allowedCategories: [BudgetCategory.ADMINISTRATIVE],
  },
  {
    id: 2,
    code: 'MOOE',
    name: 'Maintenance and Other Operating Expenses',
    description: 'Operational expenses',
    allowedCategories: [
      BudgetCategory.ADMINISTRATIVE,
      BudgetCategory.YOUTH,
    ],
  },
  {
    id: 3,
    code: 'CO',
    name: 'Capital Outlay',
    description: 'Equipment and infrastructure',
    allowedCategories: [
      BudgetCategory.ADMINISTRATIVE,
      BudgetCategory.YOUTH,
    ],
  },
];

export const BUDGET_REFERENCE_OBJECTS_OF_EXPENDITURE = [
  {
    id: 1,
    code: '50101010',
    name: 'Honorarium',
    classificationId: 1,
  },
  {
    id: 2,
    code: '50102010',
    name: 'Personnel Economic Relief Allowance',
    classificationId: 1,
  },
  {
    id: 3,
    code: '50103010',
    name: 'Representation Allowance',
    classificationId: 1,
  },
  {
    id: 4,
    code: '50104010',
    name: 'Transportation Allowance',
    classificationId: 1,
  },
  {
    id: 5,
    code: '50201010',
    name: 'Traveling Expenses - Local',
    classificationId: 2,
  },
  {
    id: 6,
    code: '50202010',
    name: 'Training Expenses',
    classificationId: 2,
  },
  {
    id: 7,
    code: '50203010',
    name: 'Office Supplies Expenses',
    classificationId: 2,
  },
  {
    id: 8,
    code: '50204010',
    name: 'Water Expenses',
    classificationId: 2,
  },
  {
    id: 9,
    code: '50204020',
    name: 'Electricity Expenses',
    classificationId: 2,
  },
  {
    id: 10,
    code: '50205040',
    name: 'Internet Subscription Expenses',
    classificationId: 2,
  },
  {
    id: 11,
    code: '50211030',
    name: 'Consultancy Services',
    classificationId: 2,
  },
  {
    id: 12,
    code: '50212010',
    name: 'Janitorial Services',
    classificationId: 2,
  },
  {
    id: 13,
    code: '50213020',
    name: 'Repairs and Maintenance - Buildings',
    classificationId: 2,
  },
  {
    id: 14,
    code: '10604010',
    name: 'ICT Equipment',
    classificationId: 3,
  },
  {
    id: 15,
    code: '10604020',
    name: 'Office Equipment',
    classificationId: 3,
  },
  {
    id: 16,
    code: '10604030',
    name: 'Furniture and Fixtures',
    classificationId: 3,
  },
  {
    id: 17,
    code: '10604040',
    name: 'Transportation Equipment',
    classificationId: 3,
  },
];
