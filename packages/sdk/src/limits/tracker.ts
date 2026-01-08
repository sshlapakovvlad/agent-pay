import {
  validateSpendingLimit,
  getRemainingDailyLimit,
  getLimitPercentageUsed,
  type SpendingLimit,
} from '@agent-pay/shared';

export interface SpendingTrackerConfig {
  daily?: number;
  perTransaction?: number;
}

export class SpendingTracker {
  private dailySpent: number = 0;
  private lastResetDate: string;
  private config: SpendingTrackerConfig;

  constructor(config: SpendingTrackerConfig) {
    this.config = config;
    this.lastResetDate = this.getCurrentDate();
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private checkAndReset(): void {
    const today = this.getCurrentDate();
    if (today !== this.lastResetDate) {
      this.dailySpent = 0;
      this.lastResetDate = today;
    }
  }

  canSpend(amount: number): boolean {
    this.checkAndReset();
    return validateSpendingLimit({
      dailySpent: this.dailySpent,
      dailyLimit: this.config.daily,
      perTransactionLimit: this.config.perTransaction,
      amount,
    });
  }

  recordSpend(amount: number): void {
    this.checkAndReset();
    this.dailySpent += amount;
  }

  getDailySpent(): number {
    this.checkAndReset();
    return this.dailySpent;
  }

  getRemainingDaily(): number | undefined {
    this.checkAndReset();
    return getRemainingDailyLimit(this.dailySpent, this.config.daily);
  }

  getPercentageUsed(): number | undefined {
    this.checkAndReset();
    return getLimitPercentageUsed(this.dailySpent, this.config.daily);
  }

  getConfig(): SpendingTrackerConfig {
    return { ...this.config };
  }
}
