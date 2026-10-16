import { app } from './app';
import { config } from './config';
import { prisma } from './utils/prisma';

const PORT = config.port;
const HOST = '0.0.0.0'; // Essential for Render and container environments

const server = app.listen(PORT, HOST, async () => {
  console.log(`===============================================`);
  console.log(`🚀 FoodieHub Backend API Server Started`);
  console.log(`📍 Listening on http://${HOST}:${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Allowed Frontend: ${config.frontendUrl}`);
  console.log(`===============================================`);

  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL database connected successfully.');
  } catch (error) {
    console.warn(
      '⚠️ Warning: Could not connect to PostgreSQL database. Please ensure DATABASE_URL is configured.'
    );
  }
});

// Graceful shutdown handling
const handleShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log('🔒 Closed active HTTP connections.');
    try {
      await prisma.$disconnect();
      console.log('🔌 Disconnected Prisma database client.');
    } catch (err) {
      console.error('Error disconnecting database:', err);
    }
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
