import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import apiRoutes from './routes';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';

export const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration supporting local dev and deployed Vercel frontend
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Check if origin matches allowed origins or is a vercel.app domain
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) ||
        origin === config.frontendUrl;

      if (isAllowed) {
        callback(null, true);
      } else {
        // In development, be permissive; in production, enforce
        if (!config.isProduction) {
          callback(null, true);
        } else {
          callback(new Error(`CORS blocked for origin: ${origin}`));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Request body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Safe request logging (skipping authorization/passwords)
if (config.nodeEnv !== 'test') {
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms')
  );
}

// Rate limiting for sensitive authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 auth requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Mount main API
app.use('/api', apiRoutes);

// Root route for convenient browser check
app.get('/', (req, res) => {
  res.json({
    name: 'FoodieHub REST API',
    version: '1.0.0',
    status: 'online',
    health: '/api/health',
    docs: 'Available endpoints under /api',
  });
});

// Central 404 & error handling
app.use(notFoundHandler);
app.use(errorHandler);
