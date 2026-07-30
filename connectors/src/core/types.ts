export type CurrencyCode = string;
export type IsoTimestamp = string;

export interface Money {
  readonly amountMinor: number;
  readonly currency: CurrencyCode;
}

export type ConnectorCapability =
  | 'banking.accounts.read'
  | 'banking.balances.read'
  | 'brokerage.accounts.read'
  | 'brokerage.holdings.read'
  | 'subscriptions.read'
  | 'property.read'
  | 'business.accounts.read'
  | 'insurance.policies.read'
  | 'credit.liabilities.read';

export type AuthenticationMetadata =
  | {
      readonly kind: 'oauth2';
      readonly authorizationUrl: string;
      readonly scopes: readonly string[];
    }
  | {
      readonly kind: 'api-token';
      readonly documentationUrl: string;
      readonly scopes: readonly string[];
    };

export interface ProviderMetadata {
  readonly id: string;
  readonly displayName: string;
  readonly authentication: AuthenticationMetadata;
}

export interface ConnectRequest {
  readonly consentId: string;
  readonly redirectUri: string;
}

export interface Connection {
  readonly connectionId: string;
  readonly providerId: string;
  readonly connectedAt: IsoTimestamp;
}

export interface DisconnectResult {
  readonly connectionId: string;
  readonly providerId: string;
  readonly revokedAt: IsoTimestamp;
}

export interface ConnectorHealth {
  readonly status: 'healthy' | 'degraded' | 'unavailable';
  readonly checkedAt: IsoTimestamp;
  readonly message?: string;
}

export interface SourceMetadata {
  readonly providerId: string;
  readonly syncedAt: IsoTimestamp;
  readonly freshness: 'realtime' | 'recent' | 'stale';
}

export interface SyncResult<TRecord> {
  readonly records: readonly TRecord[];
  readonly nextCursor?: string;
  readonly hasMore: boolean;
  readonly source: SourceMetadata;
}

export interface TimestampedRecord {
  readonly id: string;
  readonly updatedAt: IsoTimestamp;
}
