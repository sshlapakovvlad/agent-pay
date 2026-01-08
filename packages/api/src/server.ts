import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { initializeDatabase } from './db/schema.js';
import { createWalletsRouter } from './routes/wallets.js';
import { createTransactionsRouter } from './routes/transactions.js';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger());

// Database
const db = initializeDatabase(process.env.DATABASE_PATH || './agent-pay.db');

// Routes
app.route('/wallets', createWalletsRouter(db));
app.route('/transactions', createTransactionsRouter(db));

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }));

// API info
app.get('/', (c) =>
  c.json({
    name: 'Agent Payment Rails API',
    version: '0.1.0',
    endpoints: [
      'GET /wallets',
      'GET /wallets/:id',
      'POST /wallets',
      'GET /transactions?walletId=',
      'GET /transactions/:txHash',
    ],
  })
);

const port = parseInt(process.env.PORT || '3000', 10);

export default {
  port,
  fetch: app.fetch,
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  console.log(`API running at http://localhost:${port}`);
}
