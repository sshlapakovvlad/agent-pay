export interface PaymentMetadata {
  agentId: string;
  service?: string;
  endpoint?: string;
  model?: string;
  tokens?: number;
}

export interface PaymentRequest {
  to: string;
  amount: number;
  token?: 'USDC' | 'USDT';
  metadata?: PaymentMetadata;
}

export interface PaymentReceipt {
  txHash: string;
  from: string;
  to: string;
  amount: bigint;
  token: string;
  metadata?: PaymentMetadata;
  blockNumber: bigint;
  gasUsed: bigint;
}

export type PaymentStatus = 'pending' | 'confirmed' | 'failed';
