import { BaseConnector } from '../core/connector.js';
import type { ConnectorCapability, Money, TimestampedRecord } from '../core/types.js';

export type PropertyCapability = Extract<ConnectorCapability, `property.${string}`>;

export interface PropertyAsset extends TimestampedRecord {
  readonly name: string;
  readonly type: 'residential' | 'commercial' | 'land' | 'vehicle' | 'other';
  readonly estimatedValue: Money;
}

export abstract class PropertyConnector extends BaseConnector<
  PropertyAsset,
  PropertyCapability
> {}
