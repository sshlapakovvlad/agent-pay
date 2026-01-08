import {
  createPublicClient,
  createWalletClient,
  http,
  parseUnits,
  formatUnits,
  type PublicClient,
  type WalletClient,
  type Account,
  type Chain,
  type Hash,
  type TransactionReceipt,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { type Network, getChain } from './chains.js';
import {
  serializeMetadata,
  type PaymentMetadata,
  TOKENS,
} from '@agent-pay/shared';

export interface TempoAdapterConfig {
  network: Network;
  rpcUrl?: string;
}

export interface TransferParams {
  account: Account;
  to: `0x${string}`;
  amount: number;
  token?: 'USDC' | 'USDT';
  metadata?: PaymentMetadata;
}

export interface TransferResult {
  txHash: Hash;
  receipt: TransactionReceipt;
}

// TIP-20 transfer function selector and ABI
const TIP20_TRANSFER_ABI = [
  {
    name: 'transferWithMemo',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'memo', type: 'string' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export class TempoAdapter {
  private publicClient: PublicClient;
  private chain: Chain;
  private network: Network;

  constructor(config: TempoAdapterConfig) {
    this.network = config.network;
    this.chain = getChain(config.network);
    this.publicClient = createPublicClient({
      chain: this.chain,
      transport: http(config.rpcUrl),
    });
  }

  createSigner(privateKey: `0x${string}`): Account {
    return privateKeyToAccount(privateKey);
  }

  private getWalletClient(account: Account): WalletClient {
    return createWalletClient({
      account,
      chain: this.chain,
      transport: http(),
    });
  }

  private getTokenAddress(token: 'USDC' | 'USDT'): `0x${string}` {
    const tokenConfig = TOKENS[token];
    return (
      this.network === 'mainnet' ? tokenConfig.mainnet : tokenConfig.testnet
    ) as `0x${string}`;
  }

  async getBalance(
    address: `0x${string}`,
    token: 'USDC' | 'USDT' = 'USDC'
  ): Promise<bigint> {
    const tokenAddress = this.getTokenAddress(token);
    const balance = (await this.publicClient.readContract({
      address: tokenAddress,
      abi: TIP20_TRANSFER_ABI,
      functionName: 'balanceOf',
      args: [address],
    })) as bigint;
    return balance;
  }

  async transfer(params: TransferParams): Promise<TransferResult> {
    const { account, to, amount, token = 'USDC', metadata } = params;

    const walletClient = this.getWalletClient(account);
    const tokenAddress = this.getTokenAddress(token);
    const tokenConfig = TOKENS[token];
    const amountWei = parseUnits(amount.toString(), tokenConfig.decimals);
    const memo = metadata ? serializeMetadata(metadata) : '';

    const txHash = await walletClient.writeContract({
      account,
      chain: this.chain,
      address: tokenAddress,
      abi: TIP20_TRANSFER_ABI,
      functionName: 'transferWithMemo',
      args: [to, amountWei, memo],
    });

    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    return { txHash, receipt };
  }

  async getTransaction(txHash: Hash) {
    return this.publicClient.getTransaction({ hash: txHash });
  }

  async getTransactionReceipt(txHash: Hash) {
    return this.publicClient.getTransactionReceipt({ hash: txHash });
  }

  formatAmount(amount: bigint, token: 'USDC' | 'USDT' = 'USDC'): string {
    return formatUnits(amount, TOKENS[token].decimals);
  }

  parseAmount(amount: number | string, token: 'USDC' | 'USDT' = 'USDC'): bigint {
    return parseUnits(amount.toString(), TOKENS[token].decimals);
  }
}
