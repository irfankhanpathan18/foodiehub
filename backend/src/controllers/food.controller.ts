import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { FoodQueryInput } from '../validators/food.validator';

export async function getFoods(req: Request, res: Response): Promise<void> {
  try {
    const query = req.query as unknown as FoodQueryInput;
    const { search, category, isVegetarian, isAvailable, sort, page = 1, limit = 20 } = query;

    const where: any = {};

    if (search && search.trim() !== '') {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
        { category: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'All') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (typeof isVegetarian === 'boolean') {
      where.isVegetarian = isVegetarian;
    }

    if (typeof isAvailable === 'boolean') {
      where.isAvailable = isAvailable;
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'name_asc') {
      orderBy = { name: 'asc' };
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const skip = (page - 1) * limit;

    const [foods, total] = await Promise.all([
      prisma.food.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.food.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    sendSuccess(res, foods, 'Food items retrieved successfully', 200, {
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error: any) {
    console.error('getFoods error:', error);
    sendError(res, 'Failed to fetch food items', 500);
  }
}

export async function getFoodById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const food = await prisma.food.findUnique({
      where: { id },
    });

    if (!food) {
      sendError(res, 'Food item not found', 404);
      return;
    }

    sendSuccess(res, food, 'Food item retrieved successfully');
  } catch (error: any) {
    console.error('getFoodById error:', error);
    sendError(res, 'Failed to fetch food item details', 500);
  }
}

export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const categoriesWithCount = await prisma.food.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
      orderBy: {
        category: 'asc',
      },
    });

    const categories = categoriesWithCount.map((c) => ({
      name: c.category,
      count: c._count.id,
    }));

    sendSuccess(res, categories, 'Categories retrieved successfully');
  } catch (error: any) {
    console.error('getCategories error:', error);
    sendError(res, 'Failed to fetch categories', 500);
  }
}
