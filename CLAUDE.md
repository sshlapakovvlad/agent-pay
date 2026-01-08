# Agent Payment Rails - Development Guidelines

## Project Context
Payment SDK enabling AI agents to autonomously pay for APIs using stablecoin microtransactions on Tempo blockchain.

## Agentic Development Constitution

### I. Minimal Implementation
Every feature MUST be implemented with minimal code focused on core functionality. Avoid unnecessary helper functions, verbose code, or features not directly supporting the goal. Simplicity over complexity is mandatory.

### II. Async-First Communication
Agents should use event-driven pipelines, synchronous calls only for external APIs or user-facing responses. Use message queues for job processing, status updates, and notifications.

### III. Pragmatic Testing
Agents MUST only write tests they can reliably execute in isolation. Focus on simple unit tests for pure functions that don't depend on external systems. NEVER write integration tests, E2E tests, or tests requiring external service integration. AVOID testing environment variables, analytics, logging, or infrastructure concerns. Tests MUST provide actual value, not false confidence.

### IV. Code Reuse First
Agents MUST study the existing repository for implementations before creating new code. ALWAYS reuse existing components, utilities, patterns, and solutions where possible. Only create new implementations when existing code cannot fulfill the requirement.

### V. Event-Driven Architecture
All system components MUST communicate through events and message queues. Direct synchronous calls between workers are prohibited.

## Project Structure
```
packages/
├── sdk/           # @agent-pay/sdk - Core SDK for AI developers
├── provider-sdk/  # @agent-pay/provider-sdk - Payment verification
├── api/           # @agent-pay/api - Backend API
├── dashboard/     # @agent-pay/dashboard - React dashboard
└── shared/        # @agent-pay/shared - Types and utilities
apps/
└── demo/          # Demo application
```

## Key Commands
```bash
pnpm install          # Install dependencies
pnpm build            # Build all packages
pnpm dev              # Run in development mode
pnpm --filter @agent-pay/demo start    # Run demo
pnpm --filter @agent-pay/api dev       # Run API server
pnpm --filter @agent-pay/dashboard dev # Run dashboard
```

## Tech Stack
- **Runtime**: Node.js 20+, TypeScript
- **Monorepo**: Turborepo + pnpm workspaces
- **Blockchain**: Tempo (via viem@2.43.0+)
- **API**: Hono
- **Queue**: BullMQ + Redis
- **Database**: SQLite/Turso
- **Dashboard**: Next.js 14, Tailwind, TanStack Query

## Development Preferences
- Language: English
- Communication: Direct and objective, no unnecessary praise
- Focus on product-market fit signals, not just cool tech
- Always ask clarifying questions before implementing
