import { z } from 'zod';

export const createFoodSchema = z.object({
  name: z.string().min(2, 'Food name must be at least 2 characters').max(120),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  price: z.coerce.number().positive('Price must be greater than zero'),
  imageUrl: z.string().url('A valid image URL is required'),
  category: z.string().min(2, 'Category is required'),
  isVegetarian: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
});

export const updateFoodSchema = createFoodSchema.partial();

export const foodQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  isVegetarian: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
  isAvailable: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
  sort: z.enum(['price_asc', 'price_desc', 'name_asc', 'newest']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateFoodInput = z.infer<typeof createFoodSchema>;
export type UpdateFoodInput = z.infer<typeof updateFoodSchema>;
export type FoodQueryInput = z.infer<typeof foodQuerySchema>;
