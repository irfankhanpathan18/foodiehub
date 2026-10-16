# 🍔 FoodieHub - Modern Full-Stack Food Ordering Platform

[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-22C55E?style=for-the-badge)](https://foodiehub.vercel.app)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20TailwindCSS-FF6B35?style=for-the-badge&logo=react)](https://vercel.com)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20%2B%20TypeScript-1F2937?style=for-the-badge&logo=node.js)](https://render.com)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Prisma%20ORM-336791?style=for-the-badge&logo=postgresql)](https://prisma.io)

**FoodieHub** is an attractive, modern, responsive full-stack food delivery web application built with industry best practices for high performance, security, and scalability. It is architected specifically for independent production deployment: **Frontend on Vercel** and **Backend & PostgreSQL on Render**.

---

## 🎨 Design System & Branding

- **Primary Brand Color**: Vibrant Foodie Orange (`#FF6B35`)
- **Secondary Color**: Deep Dark Charcoal (`#1F2937`)
- **Background**: Soft Warm Cream (`#FFF9F2`)
- **Accent**: Fresh Botanical Green (`#22C55E`)
- **Typography**: `Plus Jakarta Sans` / `Inter` with modern line heights and font weights
- **Cards**: Pure white cards with rounded corners (`rounded-3xl`) and subtle elevation shadows (`shadow-soft` & `shadow-hover`)
- **Visual Feedback**: Real-time loading skeletons, interactive quantity steppers, toast notifications, slide-over cart drawer, and dietary indicators (Indian standard green/red circular indicators).

---

## 🚀 Key Features

### 🛒 Customer Experience
- **Interactive Homepage**:
  - Hero banner highlighting 30-minute delivery and 50k+ customers.
  - Live search bar and category tabs (Indian, Biryani, Pizza, Burgers, Chinese, Desserts, Beverages).
  - Pure Veg / Non-Veg toggle filters and price sorting.
  - Popular Dishes carousel and "Why Choose Us" trust guarantees.
- **Dedicated Menu Catalog (`/menu`)**:
  - Filter across 24+ delicious dishes with authentic Indian & Continental items.
  - Real-time search by keywords and ingredients.
  - High-resolution food photography.
- **Detailed Dish Modal (`FoodDetailsModal`)**:
  - High-res dish imagery, comprehensive description, dietary classification, portion selector, and real-time total calculator.
- **Slide-Over Shopping Cart (`CartDrawer`)**:
  - Persistent shopping cart backed by `localStorage`.
  - Dynamic free-delivery progress bar (Free delivery above ₹500, else ₹40).
  - Quantity steppers (`-` / `+`), item removal, and subtotal calculation.
- **Secure Checkout & Order Placement (`/checkout`)**:
  - Customer contact and delivery address form with validation.
  - Authoritative backend pricing and availability checks (prevents tampering or purchasing out-of-stock food).
  - Financial calculations executed in integer paise to eliminate floating-point drift.
  - Functional **Cash on Delivery (COD)** payment flow.
- **Order Success & Tracking (`/order-success/:orderNumber` & `/orders`)**:
  - Unique order numbers (e.g. `FH-20261016-4821`).
  - Color-coded status tracking: `PENDING` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED` ➔ `CANCELLED`.
  - Eligible order cancellation when order is in `PENDING` status.

### 🛡️ Admin Dashboard (`/admin`)
- **Protected Access**:
  - Backend authorization middleware strictly verifying `ADMIN` role.
- **Business Performance Analytics**:
  - Total sales in Indian Rupees (₹), delivered sales, total order counts, customer registrations, and active menu items.
  - Order status distribution breakdown.
- **Live Order Management**:
  - Filter orders by status (`ALL`, `PENDING`, `CONFIRMED`, `PREPARING`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`).
  - Search by order reference number, customer name, or phone.
  - Instant order status updates synced directly with the database.
- **Menu Catalog Management**:
  - Add new dishes with image URL, description, category, and pricing.
  - Edit existing dishes and prices.
  - Instant one-click toggle for dish availability (In Stock / Out of Stock).
  - Delete dishes with confirmation dialog.

### 🔐 Security & Reliability
- Password hashing with **bcrypt** (salt rounds = 10).
- Stateless JWT authentication via HTTP Authorization headers and HttpOnly cookies.
- Request validation using **Zod** schemas for all inputs.
- Safe logging without exposing passwords or tokens.
- Centralized error handling preventing internal stack trace leaks in production.
- Rate limiting on authentication routes.

---

## 📦 Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS & PostCSS
- **Routing**: React Router v6 (configured with SPA fallback in `vercel.json`)
- **Icons**: Lucide React
- **HTTP Client**: Axios with automatic JWT interceptors
- **State Management**: React Context API (`AuthContext`, `CartContext`, `ToastContext`)

### Backend
- **Runtime**: Node.js (v18+) with Express.js & TypeScript
- **Database ORM**: Prisma ORM with PostgreSQL
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Validation**: `zod`
- **Security**: `helmet`, `cors`, `cookie-parser`, `express-rate-limit`
- **Logging**: `morgan`
- **Testing**: `vitest` & `supertest`

---

## 🔑 Demo Login Credentials

For quick evaluation, pre-seeded accounts with 1-click autofill buttons are built right into the login page:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@foodiehub.com` | `Admin@123456` | Full Admin Dashboard, Orders Management, Menu CRUD |
| **Customer** | `customer@foodiehub.com` | `Customer@123456` | Order placement, Cart, Order tracking |

---

## 📁 Project Structure

```
nikita.food/
|-- frontend/
|   |-- src/
|   |   |-- components/       # Navbar, Footer, FoodCard, CartDrawer, FoodDetailsModal, StatusBadge
|   |   |-- pages/            # HomePage, MenuPage, LoginPage, RegisterPage, CheckoutPage, etc.
|   |   |-- context/          # AuthContext, CartContext, ToastContext
|   |   |-- services/         # Axios API client with baseURL and token interceptor
|   |   |-- types/            # TypeScript interfaces (User, Food, Order, CartItem)
|   |   |-- App.tsx           # React router routes & layout wrappers
|   |   |-- main.tsx          # Application entrypoint
|   |   |-- index.css         # Tailwind directives and custom animation styles
|   |-- public/               # Favicon & assets
|   |-- package.json
|   |-- vite.config.ts
|   |-- tailwind.config.js
|   |-- vercel.json           # Vercel SPA routing fallback rules
|   |-- .env.example
|
|-- backend/
|   |-- src/
|   |   |-- config/           # Environment variable loader
|   |   |-- controllers/      # auth, food, order, admin controllers
|   |   |-- middleware/       # auth, requireAdmin, validate, error handler
|   |   |-- routes/           # auth, food, order, admin, health check routes
|   |   |-- utils/            # prisma singleton, jwt, standardized response helpers
|   |   |-- validators/       # Zod schemas for request validation
|   |   |-- __tests__/        # Automated Vitest test suite
|   |   |-- app.ts            # Express application setup
|   |   |-- server.ts         # Server entrypoint binding to 0.0.0.0:PORT
|   |-- prisma/
|   |   |-- schema.prisma     # PostgreSQL data models (User, Food, Order, OrderItem)
|   |   |-- seed.ts           # Database seeder (Admin, Customer, 24 dishes)
|   |-- package.json
|   |-- tsconfig.json
|   |-- .env.example
|
|-- render.yaml               # Render Blueprint definition (Web service + PostgreSQL)
|-- .gitignore
|-- README.md
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18.x or v20.x+)
- npm (v9.x+)
- PostgreSQL database instance (local PostgreSQL or cloud connection string from Neon / Supabase / Render)

### 1. Clone & Install Dependencies

In the root directory, install both frontend and backend packages:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/foodiehub?schema=public
JWT_SECRET=your_jwt_secret_minimum_32_characters_long
FRONTEND_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Database Migrations & Seed Data

In the `backend/` directory:

```bash
# Push schema or run migration
npx prisma migrate dev --name init

# Seed database with sample dishes and demo accounts
npm run prisma:seed
```

### 4. Start Development Servers

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000 (Health check: http://localhost:5000/api/health)
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Vite dev server starts on http://localhost:5173
```

Visit `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing

Automated tests are written with **Vitest** and **Supertest** covering:
- Health check endpoints (`/api/health`)
- 404 handler with consistent JSON error responses
- Zod request body validation (invalid email, short password)
- Authentication enforcement on protected order routes
- Admin route authorization

To run the backend tests:
```bash
cd backend
npm test
```

---

## 🚀 Production Deployment Guide

### A. Deploy Database on Render (PostgreSQL)

1. Sign in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** ➔ **PostgreSQL**.
3. Set the database name: `foodiehub-db`, user: `foodiehub_user`.
4. Choose the region (e.g. `Oregon`) and select the Free tier.
5. Click **Create Database**.
6. Once provisioned, copy the **Internal Database URL** (or External Database URL if needed).

---

### B. Deploy Backend on Render (Web Service)

1. Push your repository to GitHub.
2. In the Render Dashboard, click **New +** ➔ **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Name**: `foodiehub-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Region**: Same region as your database (e.g. `Oregon`)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx prisma migrate deploy && node dist/server.js`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `DATABASE_URL`: Paste the PostgreSQL connection string from Step A.
   - `JWT_SECRET`: A secure random 32+ character string.
   - `FRONTEND_URL`: Your deployed Vercel frontend URL (e.g., `https://foodiehub.vercel.app`).
6. Under **Health Check Path**, enter: `/api/health`.
7. Click **Create Web Service**.
8. Once deployed, note down your Render backend URL:
   `https://foodiehub-backend.onrender.com`
9. **Seed initial dishes and admin**:
   In Render's web service tab, open the **Shell** console and execute:
   ```bash
   npx tsx prisma/seed.ts
   ```

---

### C. Deploy Frontend on Vercel

1. Sign in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and choose `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: Your deployed Render backend API URL (e.g. `https://foodiehub-backend.onrender.com/api`).
     *(Ensure `/api` is included at the end!)*
6. Click **Deploy**.
7. Vercel will build and deploy the application. Direct routes and page refreshes work smoothly due to the rewrite rules in `frontend/vercel.json`.
8. Once the frontend is live, ensure your backend's `FRONTEND_URL` environment variable on Render matches this Vercel domain.

---

## 📡 REST API Reference

### Public Endpoints
| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and database connectivity check | - |
| `GET` | `/api/foods` | Browse and filter dishes | `search`, `category`, `isVegetarian`, `sort`, `page`, `limit` |
| `GET` | `/api/foods/:id` | Get single dish details by UUID | - |
| `GET` | `/api/categories`| Get list of categories and counts | - |

### Authentication
| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new customer account | `{ name, email, password, phone }` |
| `POST` | `/api/auth/login` | Log in and receive JWT | `{ email, password }` |
| `POST` | `/api/auth/logout` | Clear session cookie | - |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Header: `Authorization: Bearer <token>` |

### Orders (Customer Authenticated)
| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Place order (validates prices & stock) | `{ customerName, customerPhone, deliveryAddress, city, state, postalCode, deliveryInstructions, items: [{ foodId, quantity }] }` |
| `GET` | `/api/orders/my` | Get orders belonging to user | - |
| `GET` | `/api/orders/:id` | Get specific order receipt | - |
| `PATCH` | `/api/orders/:id/cancel`| Cancel order (only allowed if PENDING) | - |

### Admin Endpoints (`requireAdmin`)
| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Key metrics, total sales, recent orders | - |
| `GET` | `/api/admin/orders` | List all orders with filters | `status`, `search`, `page`, `limit` |
| `PATCH` | `/api/admin/orders/:id/status`| Update order status | `{ status: "CONFIRMED" \| "PREPARING" \| "OUT_FOR_DELIVERY" \| "DELIVERED" \| "CANCELLED" }` |
| `POST` | `/api/admin/foods` | Create new food item | `{ name, description, price, imageUrl, category, isVegetarian, isAvailable }` |
| `PATCH` | `/api/admin/foods/:id` | Update food item or availability | Partial food object |
| `DELETE` | `/api/admin/foods/:id` | Remove dish from menu | - |

---

## 🛠️ Troubleshooting

### 1. Cross-Origin (CORS) Issues
If browser console warns about CORS blocking:
- Ensure the backend's `FRONTEND_URL` environment variable matches your Vercel frontend domain exactly (e.g. `https://foodiehub.vercel.app` without a trailing slash).
- Wildcard `*.vercel.app` is already allowed by default in `backend/src/app.ts`.

### 2. Direct URL Refresh Gives 404 on Vercel
- This is resolved by `frontend/vercel.json`, which redirects all paths to `/index.html` for client-side routing.

### 3. Database Migration on Render
- If Render backend fails on startup, confirm `DATABASE_URL` is configured in the environment variables. The startup command `npx prisma migrate deploy && node dist/server.js` automatically applies all pending database schema migrations.

---

## 📄 License

This project is licensed under the MIT License.
