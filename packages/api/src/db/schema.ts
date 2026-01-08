import Database from 'better-sqlite3';

export function initializeDatabase(dbPath: string = ':memory:'): Database.Database {
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS wallets (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      address TEXT NOT NULL UNIQUE,
      daily_limit REAL,
      per_tx_limit REAL,
      created_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      wallet_id TEXT REFERENCES wallets(id),
      tx_hash TEXT NOT NULL UNIQUE,
      to_address TEXT NOT NULL,
      amount REAL NOT NULL,
      token TEXT DEFAULT 'USDC',
      metadata TEXT,
      status TEXT DEFAULT 'pending',
      created_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS daily_spending (
      wallet_id TEXT,
      date TEXT,
      total REAL DEFAULT 0,
      PRIMARY KEY (wallet_id, date)
    );

    CREATE TABLE IF NOT EXISTS webhooks (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      events TEXT NOT NULL,
      secret TEXT,
      created_at INTEGER DEFAULT (unixepoch())
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(wallet_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(tx_hash);
    CREATE INDEX IF NOT EXISTS idx_daily_spending_date ON daily_spending(date);
  `);

  return db;
}

export type DbInstance = Database.Database;
