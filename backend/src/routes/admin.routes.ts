import { Router } from 'express';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  createFood,
  updateFood,
  deleteFood,
} from '../controllers/admin.controller';
import { authenticateUser, requireAdmin } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { createFoodSchema, updateFoodSchema } from '../validators/food.validator';
import { updateOrderStatusSchema } from '../validators/order.validator';

const router = Router();

// Secure all admin routes on the backend
router.use(authenticateUser);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Orders management
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', validateBody(updateOrderStatusSchema), updateOrderStatus);

// Food menu management
router.post('/foods', validateBody(createFoodSchema), createFood);
router.patch('/foods/:id', validateBody(updateFoodSchema), updateFood);
router.delete('/foods/:id', deleteFood);

export default router;
