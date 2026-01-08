# Agent Payment Rails

Payment SDK enabling AI agents to autonomously pay for APIs, compute, and services using stablecoin microtransactions on Tempo blockchain.

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run demo
pnpm --filter @agent-pay/demo start

# Start API server
pnpm --filter @agent-pay/api dev

# Start dashboard
pnpm --filter @agent-pay/dashboard dev
```

## Packages

| Package | Description |
|---------|-------------|
| `@agent-pay/sdk` | Core SDK for AI developers |
| `@agent-pay/provider-sdk` | SDK for API providers to verify payments |
| `@agent-pay/api` | Backend API for webhooks and analytics |
| `@agent-pay/dashboard` | React dashboard for wallet management |
| `@agent-pay/shared` | Shared types and utilities |

## Usage

### For AI Developers

```typescript
import { AgentPayClient } from '@agent-pay/sdk';

const client = new AgentPayClient({ network: 'testnet' });

// Generate wallet (store privateKey securely)
const { address, privateKey } = client.generateWallet();
const signer = client.createSigner(privateKey);

// Send payment
const receipt = await client.sendPayment({
  signer,
  to: '0xAPIProviderAddress',
  amount: 0.05,
  metadata: {
    agentId: 'research-agent',
    service: 'openai-api',
  },
});
```

### For API Providers

```typescript
import { requirePayment } from '@agent-pay/provider-sdk';

// Express middleware
app.use('/api', requirePayment({
  amount: 0.05,
  token: 'USDC',
}));
```

## Architecture

```
agent-pay/
├── packages/
│   ├── sdk/           # @agent-pay/sdk
│   ├── provider-sdk/  # @agent-pay/provider-sdk
│   ├── api/           # @agent-pay/api
│   ├── dashboard/     # @agent-pay/dashboard
│   └── shared/        # @agent-pay/shared
└── apps/
    └── demo/          # Demo application
```

## License

MIT
