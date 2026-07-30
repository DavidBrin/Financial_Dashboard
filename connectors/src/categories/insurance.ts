import { BaseConnector } from '../core/connector.js';
import type { ConnectorCapability, Money, TimestampedRecord } from '../core/types.js';

export type InsuranceCapability = Extract<ConnectorCapability, `insurance.${string}`>;

export interface InsurancePolicy extends TimestampedRecord {
  readonly name: string;
  readonly type: 'life' | 'health' | 'home' | 'auto' | 'umbrella' | 'other';
  readonly premium: Money;
  readonly coverageAmount?: Money;
}

export abstract class InsuranceConnector extends BaseConnector<
  InsurancePolicy,
  InsuranceCapability
> {}
