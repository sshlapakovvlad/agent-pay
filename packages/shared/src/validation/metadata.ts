import type { PaymentMetadata } from '../types/payment.js';

const MAX_AGENT_ID_LENGTH = 64;
const MAX_SERVICE_LENGTH = 128;
const MAX_ENDPOINT_LENGTH = 256;
const MAX_MODEL_LENGTH = 64;

export interface MetadataValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateMetadata(
  metadata: PaymentMetadata
): MetadataValidationResult {
  const errors: string[] = [];

  if (!metadata.agentId || metadata.agentId.trim() === '') {
    errors.push('agentId is required');
  } else if (metadata.agentId.length > MAX_AGENT_ID_LENGTH) {
    errors.push(`agentId exceeds max length of ${MAX_AGENT_ID_LENGTH}`);
  }

  if (metadata.service && metadata.service.length > MAX_SERVICE_LENGTH) {
    errors.push(`service exceeds max length of ${MAX_SERVICE_LENGTH}`);
  }

  if (metadata.endpoint && metadata.endpoint.length > MAX_ENDPOINT_LENGTH) {
    errors.push(`endpoint exceeds max length of ${MAX_ENDPOINT_LENGTH}`);
  }

  if (metadata.model && metadata.model.length > MAX_MODEL_LENGTH) {
    errors.push(`model exceeds max length of ${MAX_MODEL_LENGTH}`);
  }

  if (metadata.tokens !== undefined && metadata.tokens < 0) {
    errors.push('tokens must be non-negative');
  }

  return { valid: errors.length === 0, errors };
}

export function serializeMetadata(metadata: PaymentMetadata): string {
  return JSON.stringify(metadata);
}

export function parseMetadata(raw: string): PaymentMetadata | null {
  try {
    return JSON.parse(raw) as PaymentMetadata;
  } catch {
    return null;
  }
}
