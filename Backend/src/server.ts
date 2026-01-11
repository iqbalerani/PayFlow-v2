import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8001;

// ============ MIDDLEWARE ============

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3030',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // INCREASED: Limit each IP to 500 requests per windowMs (was 100)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============ ROUTES ============

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import invoiceRoutes from './routes/invoices';
import paymentRoutes from './routes/payments';
import aiRoutes from './routes/ai';
import webhookRoutes from './routes/webhooks';
import publicRoutes from './routes/public';

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'PayFlow Backend API'
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/public', publicRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============ START SERVER ============

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 PayFlow Backend API Server`);
  console.log(`📡 Running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
});

export default app;
