/**
 * Example: API Provider Integration
 *
 * Shows how an API provider (like OpenAI, Replicate, etc.)
 * would integrate Agent Payment Rails to accept payments.
 */

import { PaymentVerifier, requirePayment } from '@agent-pay/provider-sdk';

// Example using the middleware with Express-like framework
function expressExample() {
  // In your Express app:
  // app.use('/api/chat', requirePayment({
  //   amount: 0.002,  // $0.002 per request
  //   token: 'USDC',
  //   recipient: '0xYourPaymentAddress',
  //   network: 'testnet',
  // }));

  console.log('Express middleware example:');
  console.log(`
  import { requirePayment } from '@agent-pay/provider-sdk';

  app.use('/api/chat', requirePayment({
    amount: 0.002,  // $0.002 per request
    token: 'USDC',
    network: 'testnet',
  }));

  app.post('/api/chat', (req, res) => {
    // Payment already verified by middleware
    const payment = req.payment;
    console.log('Paid by agent:', payment.metadata?.agentId);

    // Process request...
    res.json({ response: 'Hello from paid API!' });
  });
  `);
}

// Example using direct verification
async function directVerificationExample() {
  const verifier = new PaymentVerifier({
    network: 'testnet',
  });

  console.log('Direct verification example:');
  console.log(`
  const verifier = new PaymentVerifier({ network: 'testnet' });

  async function handleRequest(txHash: string) {
    const result = await verifier.verifyPayment({
      txHash,
      expectedAmount: 0.002,
      expectedRecipient: '0xYourAddress',
    });

    if (!result.valid) {
      throw new Error('Payment verification failed: ' + result.error);
    }

    // Payment verified, process request
    console.log('Payment from:', result.from);
    console.log('Amount:', result.amount);
    console.log('Agent ID:', result.metadata?.agentId);
  }
  `);
}

console.log('=== Provider Integration Examples ===\n');
expressExample();
console.log('');
directVerificationExample();
