import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Strict security check: prevent unconfigured JWT_SECRET in production
if (isProduction && !process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is missing in production environment.');
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || (isProduction ? '' : 'dev_jwt_secret_for_local_development_only_12345'),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
