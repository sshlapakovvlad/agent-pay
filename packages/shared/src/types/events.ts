import type { PaymentMetadata } from './payment.js';

export interface PaymentSentEvent {
  type: 'payment.sent';
  txHash: string;
  from: string;
  to: string;
  amount: bigint;
  metadata?: PaymentMetadata;
  timestamp: number;
}

export interface PaymentConfirmedEvent {
  type: 'payment.confirmed';
  txHash: string;
  blockNumber: bigint;
  timestamp: number;
}

export interface LimitApproachingEvent {
  type: 'limit.approaching';
  walletId: string;
  used: number;
  limit: number;
  percentage: number;
}

export interface LimitExceededEvent {
  type: 'limit.exceeded';
  walletId: string;
  attempted: number;
  limit: number;
}

export type AgentPayEvent =
  | PaymentSentEvent
  | PaymentConfirmedEvent
  | LimitApproachingEvent
  | LimitExceededEvent;
