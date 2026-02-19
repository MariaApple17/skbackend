import bcrypt from 'bcrypt';

import {
  BudgetCategory,
  PrismaClient,
  UserStatus,
} from '@prisma/client';

import { PERMISSIONS } from '../src/constants/permission.constant.js';

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding system data...')

  /* =====================================================
   * 1. PERMISSIONS
   * ===================================================== */
  const permissions = []

  for (const perm of PERMISSIONS) {
    const permission = await prisma.permission.upsert({
      where: { key: perm.key },
      update: {
        module: perm.module,
        description: `${perm.module} - ${perm.key}`,
      },
      create: {
        key: perm.key,
        module: perm.module,
        description: `${perm.module} - ${perm.key}`,
      },
    })

    permissions.push(permission)
  }

  /* =====================================================
   * 2. SUPER ADMIN ROLE
   * ===================================================== */
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {
      description: 'System Super Administrator',
    },
    create: {
      name: 'SUPER_ADMIN',
      description: 'System Super Administrator',
    },
  })

  /* =====================================================
   * 3. ROLE ⇄ PERMISSIONS
   * ===================================================== */
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    })
  }

  /* =====================================================
   * 4. ADMIN USER
   * ===================================================== */
  const passwordHash = await bcrypt.hash('Admin@12345', 10)

  await prisma.user.upsert({
    where: { email: 'admin@system.local' },
    update: {
      roleId: superAdminRole.id,
      status: UserStatus.ACTIVE,
    },
    create: {
      email: 'admin@system.local',
      password: passwordHash,
      fullName: 'System Super Admin',
      status: UserStatus.ACTIVE,
      roleId: superAdminRole.id,
    },
  })

  /* =====================================================
   * 5. FISCAL YEAR (ONLY ONE ACTIVE)
   * ===================================================== */
  await prisma.fiscalYear.updateMany({
    data: { isActive: false },
  })

  const fiscalYear = await prisma.fiscalYear.upsert({
    where: { year: 2025 },
    update: {
      isActive: true,
    },
    create: {
      year: 2025,
      isActive: true,
    },
  })

  /* =====================================================
   * 6. BUDGET (TOTAL AMOUNT PER FY)
   * ===================================================== */
  const budget = await prisma.budget.upsert({
    where: {
      fiscalYearId: fiscalYear.id, // requires @unique
    },
    update: {
      totalAmount: 1_000_000_000.00,
      administrativeAmount: 400_000_000.00,
      youthAmount: 600_000_000.00,
    },
    create: {
      fiscalYearId: fiscalYear.id,
      totalAmount: 1_000_000_000.00,
      administrativeAmount: 400_000_000.00,
      youthAmount: 600_000_000.00,
    },
  })

  /* =====================================================
   * 7. CLASSIFICATIONS (CATEGORY-AWARE)
   * ===================================================== */
  const mooe = await prisma.budgetClassification.upsert({
    where: { code: 'MOOE' },
    update: {
      name: 'Maintenance and Other Operating Expenses',
      description: 'Common operating expenses',
      allowedCategories: [
        BudgetCategory.ADMINISTRATIVE,
        BudgetCategory.YOUTH,
      ],
    },
    create: {
      code: 'MOOE',
      name: 'Maintenance and Other Operating Expenses',
      description: 'Common operating expenses',
      allowedCategories: [
        BudgetCategory.ADMINISTRATIVE,
        BudgetCategory.YOUTH,
      ],
    },
  })

  const ps = await prisma.budgetClassification.upsert({
    where: { code: 'PS' },
    update: {
      name: 'Personal Services',
      description: 'Compensation and personnel costs',
      allowedCategories: [BudgetCategory.ADMINISTRATIVE],
    },
    create: {
      code: 'PS',
      name: 'Personal Services',
      description: 'Compensation and personnel costs',
      allowedCategories: [BudgetCategory.ADMINISTRATIVE],
    },
  })

  /* =====================================================
   * 8. OBJECTS OF EXPENDITURE
   * ===================================================== */
  const officeSupplies = await prisma.objectOfExpenditure.upsert({
    where: { code: 'OOE-001' },
    update: {
      name: 'Office Supplies',
      description: 'Expenses for office materials',
    },
    create: {
      code: 'OOE-001',
      name: 'Office Supplies',
      description: 'Expenses for office materials',
    },
  })

  /* =====================================================
   * 9. SAMPLE PROGRAM
   * ===================================================== */
  const youthProgram = await prisma.program.upsert({
    where: { code: 'PRG-001' },
    update: {
      name: 'Youth Development Program',
      description: 'Skills and training activities for youth',
      committeeInCharge: 'Education Committee',
      beneficiaries: 'Youth constituents',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true,
    },
    create: {
      code: 'PRG-001',
      name: 'Youth Development Program',
      description: 'Skills and training activities for youth',
      committeeInCharge: 'Education Committee',
      beneficiaries: 'Youth constituents',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true,
    },
  })

  /* =====================================================
   * 10. CLASSIFICATION LIMITS BY CATEGORY
   * ===================================================== */
  await prisma.budgetClassificationLimit.upsert({
    where: {
      budgetId_classificationId_category: {
        budgetId: budget.id,
        classificationId: mooe.id,
        category: BudgetCategory.ADMINISTRATIVE,
      },
    },
    update: { limitAmount: 300_000_000.00 },
    create: {
      budgetId: budget.id,
      classificationId: mooe.id,
      category: BudgetCategory.ADMINISTRATIVE,
      limitAmount: 300_000_000.00,
    },
  })

  await prisma.budgetClassificationLimit.upsert({
    where: {
      budgetId_classificationId_category: {
        budgetId: budget.id,
        classificationId: mooe.id,
        category: BudgetCategory.YOUTH,
      },
    },
    update: { limitAmount: 600_000_000.00 },
    create: {
      budgetId: budget.id,
      classificationId: mooe.id,
      category: BudgetCategory.YOUTH,
      limitAmount: 600_000_000.00,
    },
  })

  await prisma.budgetClassificationLimit.upsert({
    where: {
      budgetId_classificationId_category: {
        budgetId: budget.id,
        classificationId: ps.id,
        category: BudgetCategory.ADMINISTRATIVE,
      },
    },
    update: { limitAmount: 100_000_000.00 },
    create: {
      budgetId: budget.id,
      classificationId: ps.id,
      category: BudgetCategory.ADMINISTRATIVE,
      limitAmount: 100_000_000.00,
    },
  })

  /* =====================================================
   * 11. SAMPLE ALLOCATION
   * ===================================================== */
  const existingAllocation = await prisma.budgetAllocation.findFirst({
    where: {
      budgetId: budget.id,
      programId: youthProgram.id,
      classificationId: mooe.id,
      category: BudgetCategory.YOUTH,
      objectOfExpenditureId: officeSupplies.id,
      deletedAt: null,
    },
  })

  if (existingAllocation) {
    await prisma.budgetAllocation.update({
      where: { id: existingAllocation.id },
      data: {
        allocatedAmount: 50_000_000.00,
      },
    })
  } else {
    await prisma.budgetAllocation.create({
      data: {
        budgetId: budget.id,
        programId: youthProgram.id,
        classificationId: mooe.id,
        category: BudgetCategory.YOUTH,
        objectOfExpenditureId: officeSupplies.id,
        allocatedAmount: 50_000_000.00,
      },
    })
  }

  console.log('✅ All tables seeded & connected successfully')
}

main()
  .catch((err) => {
    console.error('❌ Seed failed', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
