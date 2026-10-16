import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FoodieHub database seed...');

  // 1. Seed Admin User
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@foodiehub.com' },
    update: {
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
    create: {
      name: 'FoodieHub Admin',
      email: 'admin@foodiehub.com',
      passwordHash: adminPasswordHash,
      phone: '+91 9876543210',
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed Demo Customer User
  const customerPasswordHash = await bcrypt.hash('Customer@123456', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@foodiehub.com' },
    update: {
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
    },
    create: {
      name: 'Rahul Sharma',
      email: 'customer@foodiehub.com',
      passwordHash: customerPasswordHash,
      phone: '+91 9811223344',
      role: Role.CUSTOMER,
    },
  });
  console.log(`✅ Customer user seeded: ${customer.email}`);

  // 3. 24 Comprehensive Food Items across Categories
  const foodItems = [
    // --- Indian Specials ---
    {
      name: 'Paneer Butter Masala',
      description: 'Rich and creamy cottage cheese cubes simmered in a mildly spiced, velvety tomato-butter gravy with aromatic fenugreek leaves.',
      price: 280,
      category: 'Indian',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Butter Chicken (Murgh Makhani)',
      description: 'Tender tandoor-roasted chicken pieces cooked in a luxurious butter, cream, and fresh tomato gravy with signature spices.',
      price: 360,
      category: 'Indian',
      isVegetarian: false,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Dal Makhani',
      description: 'Slow-cooked whole black lentils and kidney beans prepared with butter, cream, and freshly ground spices overnight for maximum flavor.',
      price: 240,
      category: 'Indian',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Masala Dosa',
      description: 'Golden-crisp fermented crepe stuffed with spiced potato mash, served with coconut chutney and piping hot vegetable sambar.',
      price: 150,
      category: 'Indian',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Garlic Butter Naan (2 pcs)',
      description: 'Traditional clay-oven baked flatbread infused with freshly minced garlic, coriander, and generously brushed with melted butter.',
      price: 90,
      category: 'Indian',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    },

    // --- Biryani ---
    {
      name: 'Hyderabadi Chicken Dum Biryani',
      description: 'Authentic Hyderabadi delicacy with fragrant long-grain basmati rice, marinated succulent chicken pieces, fried onions, and saffron aroma.',
      price: 340,
      category: 'Biryani',
      isVegetarian: false,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Royal Veg Biryani',
      description: 'Fragrant basmati rice layered with garden-fresh vegetables, paneer cubes, roasted cashews, mint, and exotic royal spices.',
      price: 260,
      category: 'Biryani',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Mutton Dum Biryani',
      description: 'Slow dum-cooked tender mutton cuts paired with saffron-infused basmati rice, caramelized shallots, and rich spices.',
      price: 450,
      category: 'Biryani',
      isVegetarian: false,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    },

    // --- Pizza ---
    {
      name: 'Classic Margherita Pizza',
      description: 'Stone-baked thin crust pizza topped with San Marzano tomato sauce, fresh buffalo mozzarella, aromatic basil leaves, and extra virgin olive oil.',
      price: 310,
      category: 'Pizza',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Farmhouse Veggie Supreme Pizza',
      description: 'Loaded with crunchy bell peppers, black olives, sweet corn, mushrooms, red onions, and melted mozzarella cheese.',
      price: 380,
      category: 'Pizza',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Fiery Peri Peri Chicken Pizza',
      description: 'Zesty peri-peri marinated chicken chunks, spicy jalapenos, smoked paprika, and melted Monterey Jack & mozzarella blend.',
      price: 430,
      category: 'Pizza',
      isVegetarian: false,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    },

    // --- Burgers ---
    {
      name: 'Crispy Veggie Crunch Burger',
      description: 'Handcrafted spiced vegetable patty with crisp lettuce, ripe tomatoes, caramelized onions, and house secret burger sauce on toasted brioche.',
      price: 180,
      category: 'Burgers',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Smoky Gourmet Chicken Burger',
      description: 'Grilled tender chicken breast basted in smoky barbecue sauce, topped with melted cheddar cheese, crisp pickles, and garlic aioli.',
      price: 240,
      category: 'Burgers',
      isVegetarian: false,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Double Cheese Smash Burger',
      description: 'Double seasoned chicken patties smashed to crispy perfection with two layers of molten American cheese and relish.',
      price: 290,
      category: 'Burgers',
      isVegetarian: false,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Crispy Peri-Peri French Fries',
      description: 'Golden crunchy potato fries tossed in zesty peri-peri seasoning, served hot with creamy cheese dip.',
      price: 130,
      category: 'Burgers',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    },

    // --- Chinese ---
    {
      name: 'Veg Hakka Noodles',
      description: 'Wok-tossed thin egg-less noodles with crisp shredded cabbage, carrots, bell peppers, scallions, and light savory soy reduction.',
      price: 190,
      category: 'Chinese',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Chilli Chicken Gravy',
      description: 'Crispy chicken cubes tossed with fiery green chillies, diced onions, bell peppers in a tangy, spicy Indo-Chinese dark sauce.',
      price: 290,
      category: 'Chinese',
      isVegetarian: false,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Vegetable Dim Sums (6 pcs)',
      description: 'Steamed delicate translucent dumplings filled with finely diced oriental vegetables, water chestnuts, served with spicy red dip.',
      price: 210,
      category: 'Chinese',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
    },

    // --- Desserts ---
    {
      name: 'Hot Sizzling Chocolate Brownie',
      description: 'Decadent fudgy dark chocolate walnut brownie served warm with a drizzle of rich Belgian chocolate ganache.',
      price: 170,
      category: 'Desserts',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Gulab Jamun (2 pcs)',
      description: 'Warm, melt-in-mouth soft milk dumplings soaked in fragrant green cardamom and saffron rose-scented syrup.',
      price: 90,
      category: 'Desserts',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'New York Baked Cheesecake Slice',
      description: 'Creamy, velvety dense classic cheesecake on a crisp butter-graham cracker crust, served with fresh strawberry coulis.',
      price: 220,
      category: 'Desserts',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    },

    // --- Beverages ---
    {
      name: 'Royal Alphonso Mango Lassi',
      description: 'Thick, creamy chilled yogurt blend infused with pure Alphonso mango pulp, cardamom, and garnished with roasted pistachios.',
      price: 120,
      category: 'Beverages',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Cold Coffee with Vanilla Ice Cream',
      description: 'Rich blended espresso coffee with chilled creamy milk, topped with a scoop of Madagascar vanilla ice cream and chocolate syrup.',
      price: 140,
      category: 'Beverages',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Fresh Mint Lime Mojito',
      description: 'Refreshing thirst-quencher with muddled fresh garden mint leaves, freshly squeezed lime juice, raw cane sugar, and sparkling soda.',
      price: 110,
      category: 'Beverages',
      isVegetarian: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Upsert food items by name so seed can run repeatedly without duplication
  for (const item of foodItems) {
    const existing = await prisma.food.findFirst({ where: { name: item.name } });
    if (existing) {
      await prisma.food.update({
        where: { id: existing.id },
        data: item,
      });
    } else {
      await prisma.food.create({
        data: item,
      });
    }
  }

  console.log(`✅ Seeded ${foodItems.length} delicious food items!`);
  console.log('🎉 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
