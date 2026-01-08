// Types
export type {
  SpendingLimit,
  AgentWallet,
  WalletBalance,
} from './types/wallet.js';

export type {
  PaymentMetadata,
  PaymentRequest,
  PaymentReceipt,
  PaymentStatus,
} from './types/payment.js';

export type {
  PaymentSentEvent,
  PaymentConfirmedEvent,
  LimitApproachingEvent,
  LimitExceededEvent,
  AgentPayEvent,
} from './types/events.js';

// Validation
export {
  validateSpendingLimit,
  getRemainingDailyLimit,
  getLimitPercentageUsed,
  type SpendingCheckParams,
} from './validation/spending.js';

export {
  isValidAddress,
  checksumAddress,
  areAddressesEqual,
} from './validation/address.js';

export {
  validateMetadata,
  serializeMetadata,
  parseMetadata,
  type MetadataValidationResult,
} from './validation/metadata.js';

// Constants
export {
  TEMPO_MAINNET_CHAIN_ID,
  TEMPO_TESTNET_CHAIN_ID,
  TOKENS,
  DEFAULT_TOKEN,
  ESTIMATED_TX_FEE_USD,
  SPENDING_ALERT_THRESHOLD,
} from './constants/index.js';
