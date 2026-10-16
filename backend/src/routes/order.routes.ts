import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from '../controllers/order.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { createOrderSchema } from '../validators/order.validator';

const router = Router();

// All order operations require customer authentication
router.use(authenticateUser);

router.post('/', validateBody(createOrderSchema), createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);

export default router;
