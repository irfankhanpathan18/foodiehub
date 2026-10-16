import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { CreateFoodInput, UpdateFoodInput } from '../validators/food.validator';
import { UpdateOrderStatusInput } from '../validators/order.validator';

export async function getDashboardStats(req: Request, res: Response): Promise<void> {
  try {
    const [
      totalOrders,
      totalCustomers,
      totalFoodItems,
      deliveredSalesAggregate,
      allSalesAggregate,
      recentOrders,
      statusCountsRaw,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.food.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: 'DELIVERED' },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELLED' } },
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
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
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ]);

    const statusCounts = statusCountsRaw.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    sendSuccess(res, {
      totalOrders,
      totalCustomers,
      totalFoodItems,
      totalSales: allSalesAggregate._sum.total || 0,
      deliveredSales: deliveredSalesAggregate._sum.total || 0,
      recentOrders,
      statusCounts,
    }, 'Admin dashboard metrics retrieved successfully.');
  } catch (error: any) {
    console.error('getDashboardStats error:', error);
    sendError(res, 'Failed to fetch admin dashboard statistics.', 500);
  }
}

export async function getAllOrders(req: Request, res: Response): Promise<void> {
  try {
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { orderNumber: { contains: search.trim(), mode: 'insensitive' } },
        { customerName: { contains: search.trim(), mode: 'insensitive' } },
        { customerPhone: { contains: search.trim(), mode: 'insensitive' } },
        { city: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
      prisma.order.count({ where }),
    ]);

    sendSuccess(res, orders, 'All orders retrieved successfully.', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('getAllOrders error:', error);
    sendError(res, 'Failed to fetch orders.', 500);
  }
}

export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body as UpdateOrderStatusInput;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      sendError(res, 'Order not found.', 404);
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(status === 'DELIVERED' ? { paymentStatus: 'COMPLETED' } : {}),
      },
      include: {
        items: true,
      },
    });

    sendSuccess(res, updatedOrder, `Order status updated to ${status}.`);
  } catch (error: any) {
    console.error('updateOrderStatus error:', error);
    sendError(res, 'Failed to update order status.', 500);
  }
}

export async function createFood(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body as CreateFoodInput;

    const food = await prisma.food.create({
      data,
    });

    sendSuccess(res, food, 'Food item created successfully.', 201);
  } catch (error: any) {
    console.error('createFood error:', error);
    sendError(res, 'Failed to create food item.', 500);
  }
}

export async function updateFood(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const data = req.body as UpdateFoodInput;

    const existing = await prisma.food.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, 'Food item not found.', 404);
      return;
    }

    const updatedFood = await prisma.food.update({
      where: { id },
      data,
    });

    sendSuccess(res, updatedFood, 'Food item updated successfully.');
  } catch (error: any) {
    console.error('updateFood error:', error);
    sendError(res, 'Failed to update food item.', 500);
  }
}

export async function deleteFood(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.food.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, 'Food item not found.', 404);
      return;
    }

    await prisma.food.delete({
      where: { id },
    });

    sendSuccess(res, null, 'Food item removed successfully.');
  } catch (error: any) {
    console.error('deleteFood error:', error);
    sendError(res, 'Failed to delete food item.', 500);
  }
}
