import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

import authRoutes from './routes/auth.route.js';
import budgetAllocationRoutes from './routes/budget-allocation.route.js';
import budgetRoutes from './routes/budget.route.js';
import classificationLimitRoutes from './routes/classification-limit.routes.js';
import classificationRoutes from './routes/classification.route.js';
import dashboardRoutes from './routes/dashboard.route.js';
import fiscalYearRoutes from './routes/fiscalYear.route.js';
import objectOfExpenditureRoutes from './routes/objectOfExpenditure.route.js';
import permissionRoutes from './routes/permission.route.js';
import procurementRoutes from './routes/procurement.route.js';
import programRoutes from './routes/program.route.js';
import reportRoutes from './routes/report.routes.js';
import roleRoutes from './routes/role.route.js';
import skOfficialRoutes from './routes/skOfficial.route.js';
import systemProfileRoutes from './routes/systemProfile.route.js';
import userRoutes from './routes/user.route.js';

const app = express();

/* ================= MIDDLEWARES ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ================= AUTH & RBAC ================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);

/* ================= BUDGET & DATA SETUP ================= */
app.use("/api/fiscal-years", fiscalYearRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/budget-allocations", budgetAllocationRoutes);

app.use("/api/programs", programRoutes);
app.use("/api/classifications", classificationRoutes);
app.use("/api/classification-limits", classificationLimitRoutes);
app.use("/api/objects-of-expenditure",objectOfExpenditureRoutes);

/* ================= PROCUREMENT ================= */
app.use("/api/procurement", procurementRoutes);

/* ================= DASHBOARD ================= */
app.use("/api/dashboard", dashboardRoutes);

/* ================= REPORTS ================= */
app.use("/api/reports", reportRoutes);

app.use('/api/sk-officials', skOfficialRoutes);

app.use('/api/system-profile', systemProfileRoutes);

/* ================= STATIC FILES ================= */
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

export default app;
