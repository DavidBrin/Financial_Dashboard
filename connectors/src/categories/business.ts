import { BaseConnector } from '../core/connector.js';
import type { ConnectorCapability, Money, TimestampedRecord } from '../core/types.js';

export type BusinessCapability = Extract<ConnectorCapability, `business.${string}`>;

export interface BusinessAccount extends TimestampedRecord {
  readonly name: string;
  readonly type: 'asset' | 'liability' | 'income' | 'expense' | 'equity';
  readonly balance: Money;
}

export abstract class BusinessConnector extends BaseConnector<
  BusinessAccount,
  BusinessCapability
> {}
