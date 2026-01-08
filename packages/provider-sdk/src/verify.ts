import {
  createPublicClient,
  http,
  decodeEventLog,
  type Hash,
  type PublicClient,
} from 'viem';
import { tempoTestnet, tempo } from './chains.js';
import {
  areAddressesEqual,
  parseMetadata,
  type PaymentMetadata,
  TOKENS,
} from '@agent-pay/shared';

export interface VerifyPaymentParams {
  txHash: Hash;
  expectedAmount: number;
  expectedRecipient?: string;
  token?: 'USDC' | 'USDT';
}

export interface VerificationResult {
  valid: boolean;
  error?: string;
  from?: string;
  to?: string;
  amount?: bigint;
  metadata?: PaymentMetadata;
  blockNumber?: bigint;
}

const TIP20_TRANSFER_EVENT = {
  name: 'Transfer',
  type: 'event',
  inputs: [
    { name: 'from', type: 'address', indexed: true },
    { name: 'to', type: 'address', indexed: true },
    { name: 'amount', type: 'uint256', indexed: false },
    { name: 'memo', type: 'string', indexed: false },
  ],
} as const;

export class PaymentVerifier {
  private client: PublicClient;
  private network: 'mainnet' | 'testnet';

  constructor(config: { network: 'mainnet' | 'testnet'; rpcUrl?: string }) {
    this.network = config.network;
    const chain = config.network === 'mainnet' ? tempo : tempoTestnet;
    this.client = createPublicClient({
      chain,
      transport: http(config.rpcUrl),
    });
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerificationResult> {
    const { txHash, expectedAmount, expectedRecipient, token = 'USDC' } = params;

    try {
      const receipt = await this.client.getTransactionReceipt({ hash: txHash });

      if (receipt.status !== 'success') {
        return { valid: false, error: 'Transaction failed' };
      }

      // Parse transfer event from logs
      const transferLog = receipt.logs.find((log) => {
        try {
          const decoded = decodeEventLog({
            abi: [TIP20_TRANSFER_EVENT],
            data: log.data,
            topics: log.topics,
          });
          return decoded.eventName === 'Transfer';
        } catch {
          return false;
        }
      });

      if (!transferLog) {
        return { valid: false, error: 'No transfer event found' };
      }

      const decoded = decodeEventLog({
        abi: [TIP20_TRANSFER_EVENT],
        data: transferLog.data,
        topics: transferLog.topics,
      }) as { args: { from: string; to: string; amount: bigint; memo: string } };

      const { from, to, amount, memo } = decoded.args;

      // Verify recipient
      if (
        expectedRecipient &&
        !areAddressesEqual(to, expectedRecipient)
      ) {
        return { valid: false, error: 'Recipient mismatch' };
      }

      // Verify amount
      const tokenConfig = TOKENS[token];
      const expectedAmountWei = BigInt(
        Math.floor(expectedAmount * 10 ** tokenConfig.decimals)
      );
      if (amount < expectedAmountWei) {
        return { valid: false, error: 'Insufficient payment amount' };
      }

      // Parse metadata
      const metadata = memo ? parseMetadata(memo) : undefined;

      return {
        valid: true,
        from,
        to,
        amount,
        metadata: metadata ?? undefined,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      };
    }
  }

  async getPaymentMetadata(txHash: Hash): Promise<PaymentMetadata | null> {
    const result = await this.verifyPayment({
      txHash,
      expectedAmount: 0,
    });
    return result.metadata ?? null;
  }
}
