/**
 * Demo: AI Agent Paying for OpenAI API
 *
 * This demonstrates the Agent Payment Rails flow:
 * 1. Create an agent wallet
 * 2. Agent makes OpenAI API call
 * 3. Agent pays for the call using stablecoins
 * 4. Provider verifies payment before returning response
 */

import { AgentPayClient, SpendingTracker } from '@agent-pay/sdk';
import { PaymentVerifier } from '@agent-pay/provider-sdk';

// Configuration
const OPENAI_PRICE_PER_1K_TOKENS = 0.002; // $0.002 per 1K tokens for GPT-4-turbo

async function main() {
  console.log('=== Agent Payment Rails Demo ===\n');

  // 1. Initialize SDK
  const client = new AgentPayClient({
    network: 'testnet',
  });

  // 2. Generate agent wallet (in production, developer stores the key securely)
  console.log('1. Generating agent wallet...');
  const { address, privateKey } = client.generateWallet();
  console.log(`   Agent wallet: ${address}`);

  // 3. Create signer from private key
  const signer = client.createSigner(privateKey);

  // 4. Create spending tracker with limits
  const tracker = client.createSpendingTracker({
    daily: 10, // $10/day limit
    perTransaction: 1, // $1/tx limit
  });

  console.log('   Daily limit: $10');
  console.log('   Per-tx limit: $1\n');

  // 5. Simulate AI agent workflow
  console.log('2. Agent workflow started...');

  // Agent wants to make an OpenAI API call
  const estimatedTokens = 1500;
  const estimatedCost = (estimatedTokens / 1000) * OPENAI_PRICE_PER_1K_TOKENS;

  console.log(`   Estimated tokens: ${estimatedTokens}`);
  console.log(`   Estimated cost: $${estimatedCost.toFixed(4)}`);

  // Check spending limits before paying
  if (!tracker.canSpend(estimatedCost)) {
    console.log('   ❌ Payment blocked by spending limit');
    return;
  }

  console.log('   ✓ Within spending limits\n');

  // 6. Simulate payment (would be real on mainnet)
  console.log('3. Sending payment...');
  console.log(`   To: 0xOpenAIPaymentAddress (simulated)`);
  console.log(`   Amount: $${estimatedCost.toFixed(4)} USDC`);
  console.log(`   Metadata: { agentId: "research-agent", service: "openai-api" }`);

  // In production, this would call:
  // const receipt = await client.sendPayment({
  //   signer,
  //   to: '0xOpenAIPaymentAddress',
  //   amount: estimatedCost,
  //   metadata: {
  //     agentId: 'research-agent',
  //     service: 'openai-api',
  //     endpoint: '/v1/chat/completions',
  //     model: 'gpt-4-turbo',
  //     tokens: estimatedTokens,
  //   },
  // });

  // Simulate successful payment
  const mockTxHash = '0x' + 'a'.repeat(64);
  console.log(`   ✓ Payment sent: ${mockTxHash.slice(0, 18)}...\n`);

  // 7. Record spending
  tracker.recordSpend(estimatedCost);
  console.log(`4. Spending recorded`);
  console.log(`   Daily spent: $${tracker.getDailySpent().toFixed(4)}`);
  console.log(`   Remaining: $${tracker.getRemainingDaily()?.toFixed(4) ?? 'unlimited'}`);
  console.log(`   Usage: ${tracker.getPercentageUsed()?.toFixed(1)}%\n`);

  // 8. Provider-side verification (simulated)
  console.log('5. Provider verifying payment...');
  console.log('   ✓ Payment verified');
  console.log('   ✓ Returning API response to agent\n');

  // Summary
  console.log('=== Demo Complete ===');
  console.log('');
  console.log('Flow demonstrated:');
  console.log('  1. Agent generates wallet');
  console.log('  2. Agent checks spending limits');
  console.log('  3. Agent sends stablecoin payment with metadata');
  console.log('  4. Provider verifies payment');
  console.log('  5. Provider returns API response');
  console.log('');
  console.log('Next steps:');
  console.log('  - Fund agent wallet with testnet USDC');
  console.log('  - Connect to real Tempo testnet RPC');
  console.log('  - Integrate with actual OpenAI API');
}

main().catch(console.error);
