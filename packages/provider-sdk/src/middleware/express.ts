import type { Hash } from 'viem';
import { PaymentVerifier } from '../verify.js';

export interface RequirePaymentOptions {
  amount: number;
  token?: 'USDC' | 'USDT';
  recipient?: string;
  network?: 'mainnet' | 'testnet';
  rpcUrl?: string;
  txHashHeader?: string;
}

export interface PaymentRequest {
  headers: Record<string, string | string[] | undefined>;
}

export interface PaymentResponse {
  status(code: number): PaymentResponse;
  json(body: unknown): void;
}

export type NextFunction = () => void;

export function createPaymentMiddleware(options: RequirePaymentOptions) {
  const {
    amount,
    token = 'USDC',
    recipient,
    network = 'testnet',
    rpcUrl,
    txHashHeader = 'x-payment-tx-hash',
  } = options;

  const verifier = new PaymentVerifier({ network, rpcUrl });

  return async (
    req: PaymentRequest,
    res: PaymentResponse,
    next: NextFunction
  ) => {
    const txHash = req.headers[txHashHeader];

    if (!txHash || typeof txHash !== 'string') {
      return res.status(402).json({
        error: 'Payment required',
        message: `Include transaction hash in ${txHashHeader} header`,
        amount,
        token,
      });
    }

    const result = await verifier.verifyPayment({
      txHash: txHash as Hash,
      expectedAmount: amount,
      expectedRecipient: recipient,
      token,
    });

    if (!result.valid) {
      return res.status(402).json({
        error: 'Payment verification failed',
        message: result.error,
      });
    }

    // Attach payment info to request for downstream use
    (req as PaymentRequest & { payment: typeof result }).payment = result;
    next();
  };
}

// Convenience wrapper for Express
export function requirePayment(options: RequirePaymentOptions) {
  return createPaymentMiddleware(options);
}
