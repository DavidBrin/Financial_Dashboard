import type {
  ConnectRequest,
  Connection,
  ConnectorCapability,
  ConnectorHealth,
  DisconnectResult,
  ProviderMetadata,
  SyncResult,
} from './types.js';

export abstract class BaseConnector<
  TRecord,
  TCapability extends ConnectorCapability = ConnectorCapability,
> {
  abstract readonly metadata: ProviderMetadata;
  abstract readonly capabilities: readonly TCapability[];

  abstract connect(request: ConnectRequest, signal: AbortSignal): Promise<Connection>;
  abstract disconnect(connectionId: string, signal: AbortSignal): Promise<DisconnectResult>;
  abstract health(signal: AbortSignal): Promise<ConnectorHealth>;
  abstract sync(cursor: string | undefined, signal: AbortSignal): Promise<SyncResult<TRecord>>;
}
