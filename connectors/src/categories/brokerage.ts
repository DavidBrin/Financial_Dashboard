import { BaseConnector } from '../core/connector.js';
import type { ConnectorCapability, Money, TimestampedRecord } from '../core/types.js';

export type BrokerageCapability = Extract<ConnectorCapability, `brokerage.${string}`>;

export interface BrokerageHolding extends TimestampedRecord {
  readonly accountId: string;
  readonly symbol: string;
  readonly quantity: number;
  readonly marketValue: Money;
}

export abstract class BrokerageConnector extends BaseConnector<
  BrokerageHolding,
  BrokerageCapability
> {}
