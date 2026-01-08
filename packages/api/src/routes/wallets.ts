import { Hono } from 'hono';
import { randomUUID } from 'crypto';
import type { DbInstance } from '../db/schema.js';
import { createWalletRepository } from '../db/repositories.js';

export function createWalletsRouter(db: DbInstance) {
  const router = new Hono();
  const wallets = createWalletRepository(db);

  router.get('/', (c) => {
    const allWallets = wallets.findAll();
    return c.json({ wallets: allWallets });
  });

  router.get('/:id', (c) => {
    const wallet = wallets.findById(c.req.param('id'));
    if (!wallet) {
      return c.json({ error: 'Wallet not found' }, 404);
    }
    return c.json({ wallet });
  });

  router.post('/', async (c) => {
    const body = await c.req.json<{
      agentId: string;
      address: string;
      dailyLimit?: number;
      perTxLimit?: number;
    }>();

    const wallet = wallets.create({
      id: randomUUID(),
      agent_id: body.agentId,
      address: body.address,
      daily_limit: body.dailyLimit ?? null,
      per_tx_limit: body.perTxLimit ?? null,
    });

    return c.json({ wallet }, 201);
  });

  return router;
}
