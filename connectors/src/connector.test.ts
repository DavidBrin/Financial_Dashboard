import { describe, expect, it } from 'vitest';

import {
  ConnectorError,
  InMemoryBankConnector,
  normalizeConnectorError,
  type BankAccount,
} from './index.js';

const records: readonly BankAccount[] = [
  {
    id: 'account-checking',
    name: 'Household Checking',
    type: 'checking',
    balance: { amountMinor: 248_420, currency: 'USD' },
    updatedAt: '2026-07-30T16:00:00.000Z',
  },
  {
    id: 'account-savings',
    name: 'Emergency Savings',
    type: 'savings',
    balance: { amountMinor: 1_250_000, currency: 'USD' },
    updatedAt: '2026-07-30T16:00:00.000Z',
  },
];

describe('InMemoryBankConnector', () => {
  it('connects with consent-safe metadata and reports provider health', async () => {
    const connector = new InMemoryBankConnector({ records, pageSize: 1 });
    const signal = new AbortController().signal;

    const connection = await connector.connect(
      { consentId: 'consent-demo', redirectUri: 'https://example.test/callback' },
      signal,
    );
    const health = await connector.health(signal);

    expect(connection).toMatchObject({
      connectionId: 'in-memory-bank:consent-demo',
      providerId: 'in-memory-bank',
    });
    expect(health).toMatchObject({ status: 'healthy' });
    expect(connector.metadata.authentication).toEqual({
      kind: 'oauth2',
      authorizationUrl: 'https://example.test/connect',
      scopes: ['accounts:read', 'balances:read'],
    });
    expect(connector.capabilities).toEqual([
      'banking.accounts.read',
      'banking.balances.read',
    ]);
  });

  it('revokes a connection with normalized provider metadata', async () => {
    const connector = new InMemoryBankConnector({ records });
    const signal = new AbortController().signal;
    const connection = await connector.connect(
      { consentId: 'consent-revoke', redirectUri: 'https://example.test/callback' },
      signal,
    );

    const result = await connector.disconnect(connection.connectionId, signal);

    expect(result).toMatchObject({
      connectionId: 'in-memory-bank:consent-revoke',
      providerId: 'in-memory-bank',
    });
    expect(Number.isNaN(Date.parse(result.revokedAt))).toBe(false);
  });

  it('syncs normalized records by cursor with freshness and source metadata', async () => {
    const connector = new InMemoryBankConnector({
      records,
      pageSize: 1,
      syncedAt: '2026-07-30T17:00:00.000Z',
    });
    const signal = new AbortController().signal;

    const firstPage = await connector.sync(undefined, signal);
    const secondPage = await connector.sync(firstPage.nextCursor, signal);

    expect(firstPage).toEqual({
      records: [records[0]],
      nextCursor: '1',
      hasMore: true,
      source: {
        providerId: 'in-memory-bank',
        syncedAt: '2026-07-30T17:00:00.000Z',
        freshness: 'realtime',
      },
    });
    expect(secondPage).toEqual({
      records: [records[1]],
      hasMore: false,
      source: {
        providerId: 'in-memory-bank',
        syncedAt: '2026-07-30T17:00:00.000Z',
        freshness: 'realtime',
      },
    });
    expect(firstPage.records[0]?.balance).toEqual({
      amountMinor: 248_420,
      currency: 'USD',
    });
  });

  it('propagates cancellation as a typed non-retryable connector error', async () => {
    const connector = new InMemoryBankConnector({ records });
    const controller = new AbortController();
    controller.abort('navigation');

    await expect(connector.sync(undefined, controller.signal)).rejects.toMatchObject({
      name: 'ConnectorError',
      code: 'aborted',
      retryable: false,
      providerId: 'in-memory-bank',
    });
  });

  it('makes cursor progress when an invalid page size is requested', async () => {
    const connector = new InMemoryBankConnector({ records, pageSize: 0 });

    const page = await connector.sync(undefined, new AbortController().signal);

    expect(page.records).toEqual([records[0]]);
    expect(page.nextCursor).toBe('1');
  });
});

describe('normalizeConnectorError', () => {
  it('preserves typed errors and normalizes unknown failures', () => {
    const typed = new ConnectorError({
      code: 'rate_limited',
      message: 'Try later',
      providerId: 'provider-a',
      retryable: true,
    });

    expect(normalizeConnectorError(typed, 'provider-b')).toBe(typed);
    expect(normalizeConnectorError(new Error('socket closed'), 'provider-b')).toMatchObject({
      name: 'ConnectorError',
      code: 'unknown',
      message: 'socket closed',
      providerId: 'provider-b',
      retryable: false,
    });
  });
});
