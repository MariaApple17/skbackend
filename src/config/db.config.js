import { PrismaClient } from '@prisma/client';

const basePrisma = new PrismaClient();

/* ================= AUTO SYSTEM ACTIVITY LOGGER ================= */
const db = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const result = await query(args);

        const WRITE_OPS = ['create', 'update', 'delete'];

        if (
          WRITE_OPS.includes(operation) &&
          model !== 'SystemLog'
        ) {
          try {
            await basePrisma.systemLog.create({
              data: {
                level: 'INFO',
                message: `${model} ${operation}`,
              },
            });
          } catch (err) {
            console.error('⚠️ System log failed:', err);
          }
        }

        return result;
      },
    },
  },
});

/* ================= CONNECT DB ================= */
const connectDB = async () => {
  try {
    await db.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
};

/* ================= DISCONNECT DB ================= */
const disconnectDB = async () => {
  try {
    await db.$disconnect();
    console.log('🛑 Database disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting database:', error);
  }
};

export { connectDB, db, disconnectDB };
