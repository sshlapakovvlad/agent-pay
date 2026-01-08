import { Hono } from 'hono';
import type { DbInstance } from '../db/schema.js';
import {
  createTransactionRepository,
  createWalletRepository,
} from '../db/repositories.js';

export function createTransactionsRouter(db: DbInstance) {
  const router = new Hono();
  const transactions = createTransactionRepository(db);
  const wallets = createWalletRepository(db);

  router.get('/', (c) => {
    const walletId = c.req.query('walletId');
    if (!walletId) {
      return c.json({ error: 'walletId query param required' }, 400);
    }

    const wallet = wallets.findById(walletId);
    if (!wallet) {
      return c.json({ error: 'Wallet not found' }, 404);
    }

    const limit = parseInt(c.req.query('limit') || '100', 10);
    const txs = transactions.findByWallet(walletId, limit);
    return c.json({ transactions: txs });
  });

  router.get('/:txHash', (c) => {
    const tx = transactions.findByHash(c.req.param('txHash'));
    if (!tx) {
      return c.json({ error: 'Transaction not found' }, 404);
    }
    return c.json({ transaction: tx });
  });

  return router;
}
