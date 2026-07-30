import { BaseConnector } from '../core/connector.js';
import type {
  ConnectorCapability,
  IsoTimestamp,
  Money,
  TimestampedRecord,
} from '../core/types.js';

export type SubscriptionCapability = Extract<ConnectorCapability, `subscriptions.${string}`>;

export interface Subscription extends TimestampedRecord {
  readonly merchant: string;
  readonly amount: Money;
  readonly cadence: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  readonly nextRenewalAt: IsoTimestamp;
}

export abstract class SubscriptionConnector extends BaseConnector<
  Subscription,
  SubscriptionCapability
> {}
