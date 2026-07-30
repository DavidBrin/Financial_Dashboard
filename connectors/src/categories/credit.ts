import { BaseConnector } from '../core/connector.js';
import type { ConnectorCapability, Money, TimestampedRecord } from '../core/types.js';

export type CreditCapability = Extract<ConnectorCapability, `credit.${string}`>;

export interface CreditLiability extends TimestampedRecord {
  readonly name: string;
  readonly type: 'credit-card' | 'mortgage' | 'student-loan' | 'auto-loan' | 'other';
  readonly balance: Money;
  readonly interestRate?: number;
}

export abstract class CreditConnector extends BaseConnector<
  CreditLiability,
  CreditCapability
> {}
