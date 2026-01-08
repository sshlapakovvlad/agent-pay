import { Queue, Worker, type Job } from 'bullmq';
import type { AgentPayEvent } from '@agent-pay/shared';

const QUEUE_NAME = 'agent-pay-events';

export interface QueueConfig {
  redisUrl?: string;
}

export function createEventQueue(config: QueueConfig = {}) {
  const connection = config.redisUrl
    ? { url: config.redisUrl }
    : { host: 'localhost', port: 6379 };

  const queue = new Queue<AgentPayEvent>(QUEUE_NAME, { connection });

  return {
    async addEvent(event: AgentPayEvent): Promise<void> {
      await queue.add(event.type, event);
    },
    async close(): Promise<void> {
      await queue.close();
    },
  };
}

export type EventHandler = (event: AgentPayEvent) => Promise<void>;

export function createEventWorker(
  handler: EventHandler,
  config: QueueConfig = {}
) {
  const connection = config.redisUrl
    ? { url: config.redisUrl }
    : { host: 'localhost', port: 6379 };

  const worker = new Worker<AgentPayEvent>(
    QUEUE_NAME,
    async (job: Job<AgentPayEvent>) => {
      await handler(job.data);
    },
    { connection }
  );

  return {
    async close(): Promise<void> {
      await worker.close();
    },
  };
}
