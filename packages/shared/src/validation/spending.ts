import type { SpendingLimit } from '../types/wallet.js';

export interface SpendingCheckParams {
  dailySpent: number;
  dailyLimit?: number;
  perTransactionLimit?: number;
  amount: number;
}

export function validateSpendingLimit(params: SpendingCheckParams): boolean {
  const { dailySpent, dailyLimit, perTransactionLimit, amount } = params;

  if (perTransactionLimit !== undefined && amount > perTransactionLimit) {
    return false;
  }

  if (dailyLimit !== undefined && dailySpent + amount > dailyLimit) {
    return false;
  }

  return true;
}

export function getRemainingDailyLimit(
  dailySpent: number,
  dailyLimit?: number
): number | undefined {
  if (dailyLimit === undefined) return undefined;
  return Math.max(0, dailyLimit - dailySpent);
}

export function getLimitPercentageUsed(
  dailySpent: number,
  dailyLimit?: number
): number | undefined {
  if (dailyLimit === undefined || dailyLimit === 0) return undefined;
  return Math.min(100, (dailySpent / dailyLimit) * 100);
}
