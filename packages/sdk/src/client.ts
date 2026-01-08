import type { Account, Hash } from 'viem';
import { TempoAdapter, type TempoAdapterConfig } from './tempo/adapter.js';
import { generateWallet, type GeneratedWallet } from './wallet/generate.js';
import {
  SpendingTracker,
  type SpendingTrackerConfig,
} from './limits/tracker.js';
import {
  isValidAddress,
  validateMetadata,
  type PaymentMetadata,
  type PaymentReceipt,
} from '@agent-pay/shared';

export interface AgentPayClientConfig {
  network: 'mainnet' | 'testnet';
  rpcUrl?: string;
}

export interface SendPaymentParams {
  signer: Account;
  to: string;
  amount: number;
  token?: 'USDC' | 'USDT';
  metadata?: PaymentMetadata;
}

export class AgentPayClient {
  private adapter: TempoAdapter;
  private config: AgentPayClientConfig;

  constructor(config: AgentPayClientConfig) {
    this.config = config;
    this.adapter = new TempoAdapter({
      network: config.network,
      rpcUrl: config.rpcUrl,
    });
  }

  generateWallet(): GeneratedWallet {
    return generateWallet();
  }

  createSigner(privateKey: `0x${string}`): Account {
    return this.adapter.createSigner(privateKey);
  }

  createSpendingTracker(config: SpendingTrackerConfig): SpendingTracker {
    return new SpendingTracker(config);
  }

  async getBalance(
    address: string,
    token: 'USDC' | 'USDT' = 'USDC'
  ): Promise<{ raw: bigint; formatted: string }> {
    if (!isValidAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }
    const balance = await this.adapter.getBalance(
      address as `0x${string}`,
      token
    );
    return {
      raw: balance,
      formatted: this.adapter.formatAmount(balance, token),
    };
  }

  async sendPayment(params: SendPaymentParams): Promise<PaymentReceipt> {
    const { signer, to, amount, token = 'USDC', metadata } = params;

    if (!isValidAddress(to)) {
      throw new Error(`Invalid recipient address: ${to}`);
    }

    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    if (metadata) {
      const validation = validateMetadata(metadata);
      if (!validation.valid) {
        throw new Error(`Invalid metadata: ${validation.errors.join(', ')}`);
      }
    }

    const result = await this.adapter.transfer({
      account: signer,
      to: to as `0x${string}`,
      amount,
      token,
      metadata,
    });

    return {
      txHash: result.txHash,
      from: signer.address,
      to: to as `0x${string}`,
      amount: this.adapter.parseAmount(amount, token),
      token,
      metadata,
      blockNumber: result.receipt.blockNumber,
      gasUsed: result.receipt.gasUsed,
    };
  }

  async getTransaction(txHash: Hash) {
    return this.adapter.getTransaction(txHash);
  }

  async waitForReceipt(txHash: Hash) {
    return this.adapter.getTransactionReceipt(txHash);
  }
}
