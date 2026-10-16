import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import foodRoutes from './food.routes';
import orderRoutes from './order.routes';
import adminRoutes from './admin.routes';
import { prisma } from '../utils/prisma';

const router = Router();

// Health check endpoint
router.get('/health', async (req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error_connecting_to_db';
  }

  res.status(200).json({
    status: 'ok',
    service: 'FoodieHub REST API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/', foodRoutes); // Exposes /foods and /categories
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);

export default router;
