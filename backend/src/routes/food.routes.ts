import { Router } from 'express';
import { getFoods, getFoodById, getCategories } from '../controllers/food.controller';
import { validateQuery } from '../middleware/validate.middleware';
import { foodQuerySchema } from '../validators/food.validator';

const router = Router();

router.get('/foods', validateQuery(foodQuerySchema), getFoods);
router.get('/foods/:id', getFoodById);
router.get('/categories', getCategories);

export default router;
