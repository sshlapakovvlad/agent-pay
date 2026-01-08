import type { AgentPayEvent } from '@agent-pay/shared';

export interface HandlerContext {
  log: (message: string) => void;
}

export async function handlePaymentSent(
  event: Extract<AgentPayEvent, { type: 'payment.sent' }>,
  ctx: HandlerContext
): Promise<void> {
  ctx.log(`Payment sent: ${event.txHash} - ${event.amount} from ${event.from}`);
  // Store transaction, update spending, trigger webhooks
}

export async function handlePaymentConfirmed(
  event: Extract<AgentPayEvent, { type: 'payment.confirmed' }>,
  ctx: HandlerContext
): Promise<void> {
  ctx.log(`Payment confirmed: ${event.txHash} at block ${event.blockNumber}`);
  // Update transaction status
}

export async function handleLimitApproaching(
  event: Extract<AgentPayEvent, { type: 'limit.approaching' }>,
  ctx: HandlerContext
): Promise<void> {
  ctx.log(
    `Limit approaching for ${event.walletId}: ${event.percentage}% used`
  );
  // Send webhook/email alert
}

export async function handleLimitExceeded(
  event: Extract<AgentPayEvent, { type: 'limit.exceeded' }>,
  ctx: HandlerContext
): Promise<void> {
  ctx.log(
    `Limit exceeded for ${event.walletId}: attempted ${event.attempted}, limit ${event.limit}`
  );
  // Send webhook/email alert
}

export async function routeEvent(
  event: AgentPayEvent,
  ctx: HandlerContext
): Promise<void> {
  switch (event.type) {
    case 'payment.sent':
      return handlePaymentSent(event, ctx);
    case 'payment.confirmed':
      return handlePaymentConfirmed(event, ctx);
    case 'limit.approaching':
      return handleLimitApproaching(event, ctx);
    case 'limit.exceeded':
      return handleLimitExceeded(event, ctx);
  }
}
