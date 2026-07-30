import { BankingConnector, type BankAccount, type BankingCapability } from '../categories/banking.js';
import { ConnectorError, throwIfAborted } from '../core/errors.js';
import type {
  ConnectRequest,
  Connection,
  ConnectorHealth,
  DisconnectResult,
  ProviderMetadata,
  SyncResult,
} from '../core/types.js';

export interface InMemoryBankConnectorOptions {
  readonly records: readonly BankAccount[];
  readonly pageSize?: number;
  readonly syncedAt?: string;
}

const PROVIDER_ID = 'in-memory-bank';

export class InMemoryBankConnector extends BankingConnector {
  readonly metadata: ProviderMetadata = {
    id: PROVIDER_ID,
    displayName: 'In-memory Bank',
    authentication: {
      kind: 'oauth2',
      authorizationUrl: 'https://example.test/connect',
      scopes: ['accounts:read', 'balances:read'],
    },
  };

  readonly capabilities: readonly BankingCapability[] = [
    'banking.accounts.read',
    'banking.balances.read',
  ];

  readonly #records: readonly BankAccount[];
  readonly #pageSize: number;
  readonly #syncedAt: string;

  constructor(options: InMemoryBankConnectorOptions) {
    super();
    this.#records = [...options.records];
    const requestedPageSize = options.pageSize ?? Math.max(this.#records.length, 1);
    this.#pageSize = Number.isSafeInteger(requestedPageSize) && requestedPageSize > 0
      ? requestedPageSize
      : 1;
    this.#syncedAt = options.syncedAt ?? new Date().toISOString();
  }

  async connect(request: ConnectRequest, signal: AbortSignal): Promise<Connection> {
    throwIfAborted(signal, PROVIDER_ID);

    return {
      connectionId: `${PROVIDER_ID}:${request.consentId}`,
      providerId: PROVIDER_ID,
      connectedAt: new Date().toISOString(),
    };
  }

  async disconnect(connectionId: string, signal: AbortSignal): Promise<DisconnectResult> {
    throwIfAborted(signal, PROVIDER_ID);

    return {
      connectionId,
      providerId: PROVIDER_ID,
      revokedAt: new Date().toISOString(),
    };
  }

  async health(signal: AbortSignal): Promise<ConnectorHealth> {
    throwIfAborted(signal, PROVIDER_ID);

    return {
      status: 'healthy',
      checkedAt: new Date().toISOString(),
    };
  }

  async sync(cursor: string | undefined, signal: AbortSignal): Promise<SyncResult<BankAccount>> {
    throwIfAborted(signal, PROVIDER_ID);

    const offset = cursor === undefined ? 0 : Number(cursor);
    if (!Number.isSafeInteger(offset) || offset < 0) {
      throw new ConnectorError({
        code: 'invalid_cursor',
        message: `Invalid sync cursor: ${cursor}`,
        providerId: PROVIDER_ID,
        retryable: false,
      });
    }

    const records = this.#records.slice(offset, offset + this.#pageSize);
    const nextOffset = offset + records.length;
    const hasMore = nextOffset < this.#records.length;

    return {
      records,
      ...(hasMore ? { nextCursor: String(nextOffset) } : {}),
      hasMore,
      source: {
        providerId: PROVIDER_ID,
        syncedAt: this.#syncedAt,
        freshness: 'realtime',
      },
    };
  }
}
