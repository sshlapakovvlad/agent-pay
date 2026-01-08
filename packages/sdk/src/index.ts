export {
  AgentPayClient,
  type AgentPayClientConfig,
  type SendPaymentParams,
} from './client.js';

export { generateWallet, type GeneratedWallet } from './wallet/generate.js';

export {
  SpendingTracker,
  type SpendingTrackerConfig,
} from './limits/tracker.js';

export {
  TempoAdapter,
  type TempoAdapterConfig,
  type TransferParams,
  type TransferResult,
} from './tempo/adapter.js';

export { tempo, tempoTestnet, getChain, type Network } from './tempo/chains.js';

// Re-export shared types for convenience
export type {
  PaymentMetadata,
  PaymentReceipt,
  PaymentRequest,
  SpendingLimit,
  AgentWallet,
} from '@agent-pay/shared';
