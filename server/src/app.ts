import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import rateLimit from 'express-rate-limit';

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));

// Set security headers
app.use(helmet());

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

import authRoutes from './modules/auth/auth.routes';
import profileRoutes from './modules/profiles/profiles.routes';
import listingRoutes from './modules/listings/listings.routes';
import interestRoutes from './modules/interests/interests.routes';
import chatRoutes from './modules/chat/chat.routes';
import uploadRoutes from './modules/upload/upload.routes';

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Error handling middleware
app.use(errorHandler);

export default app;
