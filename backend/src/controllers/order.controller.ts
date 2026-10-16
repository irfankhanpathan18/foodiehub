import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { CreateOrderInput } from '../validators/order.validator';

function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `FH-${dateStr}-${randomSuffix}`;
}

export async function createOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required to place an order.', 401);
      return;
    }

    const {
      customerName,
      customerPhone,
      deliveryAddress,
      city,
      state,
      postalCode,
      deliveryInstructions,
      items,
      paymentMethod,
    } = req.body as CreateOrderInput;

    const foodIds = items.map((i) => i.foodId);

    // Fetch authoritative food details and availability from database
    const foods = await prisma.food.findMany({
      where: {
        id: { in: foodIds },
      },
    });

    if (foods.length !== items.length) {
      sendError(res, 'One or more items in your cart could not be found.', 400);
      return;
    }

    // Verify availability
    const unavailableFoods = foods.filter((f) => !f.isAvailable);
    if (unavailableFoods.length > 0) {
      const names = unavailableFoods.map((f) => f.name).join(', ');
      sendError(
        res,
        `The following items are currently out of stock or unavailable: ${names}. Please remove them to proceed.`,
        400
      );
      return;
    }

    const foodMap = new Map(foods.map((f) => [f.id, f]));

    // Perform monetary calculations in integer paise to avoid floating-point issues
    let subtotalPaise = 0;
    const orderItemsData: Array<{
      foodId: string;
      foodName: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
    }> = [];

    for (const item of items) {
      const food = foodMap.get(item.foodId)!;
      const unitPricePaise = Math.round(food.price * 100);
      const lineTotalPaise = unitPricePaise * item.quantity;
      subtotalPaise += lineTotalPaise;

      orderItemsData.push({
        foodId: food.id,
        foodName: food.name,
        unitPrice: food.price,
        quantity: item.quantity,
        lineTotal: lineTotalPaise / 100,
      });
    }

    // Delivery fee rule: Free above ₹500 (50000 paise), else ₹40 (4000 paise)
    const deliveryFeePaise = subtotalPaise >= 50000 ? 0 : 4000;
    const totalPaise = subtotalPaise + deliveryFeePaise;

    const subtotal = subtotalPaise / 100;
    const deliveryFee = deliveryFeePaise / 100;
    const total = totalPaise / 100;

    const orderNumber = generateOrderNumber();

    // Transactional order creation
    const createdOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: req.user!.id,
          customerName,
          customerPhone,
          deliveryAddress,
          city,
          state,
          postalCode,
          deliveryInstructions,
          subtotal,
          deliveryFee,
          total,
          paymentMethod,
          paymentStatus: 'PENDING',
          status: 'PENDING',
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });

    sendSuccess(
      res,
      createdOrder,
      'Order placed successfully! We are preparing your delicious food.',
      201
    );
  } catch (error: any) {
    console.error('createOrder error:', error);
    sendError(res, 'Failed to place order. Please try again.', 500);
  }
}

export async function getMyOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    sendSuccess(res, orders, 'Your orders retrieved successfully.');
  } catch (error: any) {
    console.error('getMyOrders error:', error);
    sendError(res, 'Failed to fetch your orders.', 500);
  }
}

export async function getOrderById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      sendError(res, 'Order not found.', 404);
      return;
    }

    // Role check: Only the owner or an admin can access this order
    if (order.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      sendError(res, 'You are not authorized to view this order.', 403);
      return;
    }

    sendSuccess(res, order, 'Order details retrieved successfully.');
  } catch (error: any) {
    console.error('getOrderById error:', error);
    sendError(res, 'Failed to fetch order details.', 500);
  }
}

export async function cancelOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      sendError(res, 'Order not found.', 404);
      return;
    }

    // Customer can only cancel their own order
    if (order.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      sendError(res, 'You are not authorized to cancel this order.', 403);
      return;
    }

    // Only allow cancellation if order status is PENDING
    if (order.status !== 'PENDING') {
      sendError(
        res,
        `This order cannot be cancelled because it is already ${order.status.toLowerCase().replace(/_/g, ' ')}.`,
        400
      );
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
      include: {
        items: true,
      },
    });

    sendSuccess(res, updatedOrder, 'Order has been successfully cancelled.');
  } catch (error: any) {
    console.error('cancelOrder error:', error);
    sendError(res, 'Failed to cancel order.', 500);
  }
}
