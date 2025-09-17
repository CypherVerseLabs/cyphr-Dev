import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
import walletRoutes from './routes/walletRoutes';
import authRoutes from './routes/authRoutes';
import blockchainRoutes from './routes/blockchainRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// ✅ Parse JSON
app.use(express.json());

// ✅ API Routes
app.use('/api/users', userRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/auth', authRoutes);

// ✅ Mount blockchain routes directly under `/api`
app.use('/api', blockchainRoutes);

// ✅ Health check
app.get('/', (_req, res) => {
  res.send('🚀 API is running...');
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
