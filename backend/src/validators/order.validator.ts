import { z } from 'zod';

export const orderItemInputSchema = z.object({
  foodId: z.string().uuid('Invalid food item identifier'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(50, 'Max 50 items per dish'),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Full name is required').max(100),
  customerPhone: z
    .string()
    .min(10, 'Valid 10-digit phone number is required')
    .max(15),
  deliveryAddress: z.string().min(5, 'Delivery address is required').max(300),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  postalCode: z.string().min(4, 'Valid PIN/Postal code is required').max(10),
  deliveryInstructions: z.string().max(300).optional(),
  items: z.array(orderItemInputSchema).min(1, 'At least one item is required in the order'),
  paymentMethod: z.literal('CASH_ON_DELIVERY').default('CASH_ON_DELIVERY'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
