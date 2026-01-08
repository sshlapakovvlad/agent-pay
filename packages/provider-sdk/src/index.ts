export {
  PaymentVerifier,
  type VerifyPaymentParams,
  type VerificationResult,
} from './verify.js';

export {
  createPaymentMiddleware,
  requirePayment,
  type RequirePaymentOptions,
  type PaymentRequest,
  type PaymentResponse,
  type NextFunction,
} from './middleware/express.js';

export { tempo, tempoTestnet } from './chains.js';

// Re-export shared types
export type { PaymentMetadata } from '@agent-pay/shared';
