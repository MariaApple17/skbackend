export const PERMISSIONS = [
  /* ================= DASHBOARD ================= */
  { key: 'DASHBOARD_VIEW', module: 'DASHBOARD' },

  /* ================= BUDGET PREPARATION ================= */
  { key: 'BUDGET_ALLOCATION_VIEW', module: 'BUDGET_PREPARATION' },
  { key: 'BUDGET_TOTAL_VIEW', module: 'BUDGET_PREPARATION' },

  /* ================= PROCUREMENT ================= */
  { key: 'PROCUREMENT_REQUEST_VIEW', module: 'PROCUREMENT' },
  { key: 'PROCUREMENT_MANAGE_VIEW', module: 'PROCUREMENT' },

  /* ================= DATA SETUP ================= */
  { key: 'FISCAL_YEAR_VIEW', module: 'DATA_SETUP' },
  { key: 'CLASSIFICATION_VIEW', module: 'DATA_SETUP' },
  { key: 'OBJECT_EXPENDITURES_VIEW', module: 'DATA_SETUP' },

  /* ================= PROGRAMS ================= */
  { key: 'PROGRAMS_VIEW', module: 'PROGRAMS_MANAGEMENT' },

  /* ================= USER MANAGEMENT ================= */
  { key: 'USERS_VIEW', module: 'USER_MANAGEMENT' },

  /* ================= ROLES & PERMISSIONS ================= */
  { key: 'ROLES_VIEW', module: 'ROLES_PERMISSION' },

  { key: 'REPORTS_VIEW', module: 'REPORTS_PERMISSION' },
];
