export interface SpendingLimit {
  daily?: number;
  perTransaction?: number;
}

export interface AgentWallet {
  address: string;
  agentId: string;
  spendingLimit?: SpendingLimit;
}

export interface WalletBalance {
  address: string;
  usdc: bigint;
  usdt: bigint;
}
