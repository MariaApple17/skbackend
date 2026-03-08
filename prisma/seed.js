import bcrypt from 'bcrypt'
import { PrismaClient, UserStatus, BudgetCategory } from '@prisma/client'
import { PERMISSIONS } from '../src/constants/permission.constant.js'

const prisma = new PrismaClient()

async function main() {

  console.log('🌱 Seeding system data...')

  /* =====================================================
   1. PERMISSIONS
  ===================================================== */

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
   2. SUPER ADMIN ROLE
  ===================================================== */

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
   3. ROLE PERMISSIONS
  ===================================================== */

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
   4. ADMIN USER
  ===================================================== */

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
   5. FISCAL YEAR
  ===================================================== */

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
   6. BUDGET CLASSIFICATIONS
  ===================================================== */

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
      allowedCategories: [
        BudgetCategory.ADMINISTRATIVE,
      ],
    },
    create: {
      code: 'PS',
      name: 'Personal Services',
      description: 'Compensation and personnel costs',
      allowedCategories: [
        BudgetCategory.ADMINISTRATIVE,
      ],
    },
  })

  /* =====================================================
   7. OBJECTS OF EXPENDITURE
  ===================================================== */

  await prisma.objectOfExpenditure.upsert({
    where: { code: 'OOE-001' },
    update: {
      name: 'Office Supplies',
      description: 'Expenses for office materials',
      classificationId: mooe.id,
    },
    create: {
      code: 'OOE-001',
      name: 'Office Supplies',
      description: 'Expenses for office materials',
      classification: {
        connect: { id: mooe.id },
      },
    },
  })

  console.log('✅ Seed completed successfully')

}

main()
  .catch((err) => {
    console.error('❌ Seed failed', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })