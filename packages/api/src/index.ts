export { initializeDatabase, type DbInstance } from './db/schema.js';

export {
  createWalletRepository,
  createTransactionRepository,
  createDailySpendingRepository,
  type WalletRecord,
  type TransactionRecord,
} from './db/repositories.js';

export {
  createEventQueue,
  createEventWorker,
  type QueueConfig,
  type EventHandler,
} from './events/queue.js';

export { routeEvent } from './events/handlers.js';

export { createWalletsRouter } from './routes/wallets.js';
export { createTransactionsRouter } from './routes/transactions.js';
