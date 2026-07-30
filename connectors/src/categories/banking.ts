import { BaseConnector } from '../core/connector.js';
import type { ConnectorCapability, Money, TimestampedRecord } from '../core/types.js';

export type BankingCapability = Extract<ConnectorCapability, `banking.${string}`>;

export interface BankAccount extends TimestampedRecord {
  readonly name: string;
  readonly type: 'checking' | 'savings' | 'money-market' | 'certificate' | 'cash';
  readonly balance: Money;
}

export abstract class BankingConnector extends BaseConnector<
  BankAccount,
  BankingCapability
> {}
