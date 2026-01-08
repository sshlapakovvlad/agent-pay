import type { DbInstance } from './schema.js';

export interface WalletRecord {
  id: string;
  agent_id: string;
  address: string;
  daily_limit: number | null;
  per_tx_limit: number | null;
  created_at: number;
}

export interface TransactionRecord {
  id: string;
  wallet_id: string;
  tx_hash: string;
  to_address: string;
  amount: number;
  token: string;
  metadata: string | null;
  status: string;
  created_at: number;
}

export function createWalletRepository(db: DbInstance) {
  const insert = db.prepare(`
    INSERT INTO wallets (id, agent_id, address, daily_limit, per_tx_limit)
    VALUES (?, ?, ?, ?, ?)
  `);

  const findById = db.prepare(`SELECT * FROM wallets WHERE id = ?`);
  const findByAddress = db.prepare(`SELECT * FROM wallets WHERE address = ?`);
  const findAll = db.prepare(`SELECT * FROM wallets ORDER BY created_at DESC`);

  return {
    create(wallet: Omit<WalletRecord, 'created_at'>): WalletRecord {
      insert.run(
        wallet.id,
        wallet.agent_id,
        wallet.address,
        wallet.daily_limit,
        wallet.per_tx_limit
      );
      return findById.get(wallet.id) as WalletRecord;
    },
    findById(id: string): WalletRecord | undefined {
      return findById.get(id) as WalletRecord | undefined;
    },
    findByAddress(address: string): WalletRecord | undefined {
      return findByAddress.get(address) as WalletRecord | undefined;
    },
    findAll(): WalletRecord[] {
      return findAll.all() as WalletRecord[];
    },
  };
}

export function createTransactionRepository(db: DbInstance) {
  const insert = db.prepare(`
    INSERT INTO transactions (id, wallet_id, tx_hash, to_address, amount, token, metadata, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const findById = db.prepare(`SELECT * FROM transactions WHERE id = ?`);
  const findByHash = db.prepare(`SELECT * FROM transactions WHERE tx_hash = ?`);
  const findByWallet = db.prepare(`
    SELECT * FROM transactions WHERE wallet_id = ? ORDER BY created_at DESC LIMIT ?
  `);
  const updateStatus = db.prepare(`UPDATE transactions SET status = ? WHERE id = ?`);

  return {
    create(tx: Omit<TransactionRecord, 'created_at'>): TransactionRecord {
      insert.run(
        tx.id,
        tx.wallet_id,
        tx.tx_hash,
        tx.to_address,
        tx.amount,
        tx.token,
        tx.metadata,
        tx.status
      );
      return findById.get(tx.id) as TransactionRecord;
    },
    findById(id: string): TransactionRecord | undefined {
      return findById.get(id) as TransactionRecord | undefined;
    },
    findByHash(hash: string): TransactionRecord | undefined {
      return findByHash.get(hash) as TransactionRecord | undefined;
    },
    findByWallet(walletId: string, limit = 100): TransactionRecord[] {
      return findByWallet.all(walletId, limit) as TransactionRecord[];
    },
    updateStatus(id: string, status: string): void {
      updateStatus.run(status, id);
    },
  };
}

export function createDailySpendingRepository(db: DbInstance) {
  const upsert = db.prepare(`
    INSERT INTO daily_spending (wallet_id, date, total)
    VALUES (?, ?, ?)
    ON CONFLICT (wallet_id, date)
    DO UPDATE SET total = total + excluded.total
  `);

  const getSpending = db.prepare(`
    SELECT total FROM daily_spending WHERE wallet_id = ? AND date = ?
  `);

  return {
    addSpending(walletId: string, date: string, amount: number): void {
      upsert.run(walletId, date, amount);
    },
    getSpending(walletId: string, date: string): number {
      const row = getSpending.get(walletId, date) as { total: number } | undefined;
      return row?.total ?? 0;
    },
  };
}
