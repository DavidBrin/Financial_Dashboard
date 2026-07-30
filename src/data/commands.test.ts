import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FetchCommandGateway,
  listStagedCommands,
  stageCommand,
  type DemoCommand,
} from './commands';

const successResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe('FetchCommandGateway', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: new MemoryStorage(),
    });
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('123e4567-e89b-42d3-a456-426614174000');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('sends the exact URL, method, JSON body, and command headers', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      successResponse({
        requestId: 'server-request-id',
        message: 'Cancellation request received',
      }),
    );
    const gateway = new FetchCommandGateway({ fetcher });

    await gateway.send(
      '/api/v1/subscriptions/music/cancellation-requests',
      'POST',
      { reason: 'unused' },
    );

    expect(fetcher).toHaveBeenCalledOnce();
    expect(fetcher).toHaveBeenCalledWith(
      '/api/v1/subscriptions/music/cancellation-requests',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ reason: 'unused' }),
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': '123e4567-e89b-42d3-a456-426614174000',
        },
      }),
    );
  });

  it('returns the validated JSON success envelope', async () => {
    const gateway = new FetchCommandGateway({
      fetcher: vi.fn<typeof fetch>().mockResolvedValue(
        successResponse({
          requestId: 'server-request-id',
          message: 'Cancellation request received',
        }),
      ),
    });

    await expect(gateway.send('/api/v1/subscriptions/music', 'PATCH', { hidden: true })).resolves.toEqual({
      status: 'sent',
      requestId: 'server-request-id',
      message: 'Cancellation request received',
    });
  });

  it('stages the command when the network request fails', async () => {
    const gateway = new FetchCommandGateway({
      fetcher: vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Failed to fetch')),
    });

    await expect(gateway.send('/api/v1/subscriptions/music', 'PATCH', { hidden: true })).resolves.toEqual({
      status: 'staged',
      requestId: '123e4567-e89b-42d3-a456-426614174000',
      message: 'Demo mode: request staged',
    });
    expect(listStagedCommands()).toEqual([
      expect.objectContaining({
        requestId: '123e4567-e89b-42d3-a456-426614174000',
        action: 'PATCH /api/v1/subscriptions/music',
        resourceType: 'subscriptions',
        resourceId: 'music',
        payload: { hidden: true },
        status: 'staged',
      }),
    ]);
  });

  it('stages an HTML 200 response instead of treating an SPA rewrite as success', async () => {
    const gateway = new FetchCommandGateway({
      fetcher: vi.fn<typeof fetch>().mockResolvedValue(
        new Response('<!doctype html><title>Financial Command Center</title>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        }),
      ),
    });

    await expect(gateway.send('/api/v1/subscriptions/music', 'DELETE', {})).resolves.toMatchObject({
      status: 'staged',
      message: 'Demo mode: request staged',
    });
    expect(listStagedCommands()).toHaveLength(1);
  });

  it('retains staged commands in memory when local storage is unavailable', () => {
    const command: DemoCommand = {
      requestId: 'offline-request',
      timestamp: '2026-07-30T12:00:00.000Z',
      action: 'POST /api/v1/accounts/sync',
      resourceType: 'accounts',
      resourceId: 'sync',
      payload: {},
      status: 'staged',
    };
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });

    stageCommand(command);

    expect(listStagedCommands()).toContainEqual(command);
  });

  it('aborts a request after the configured timeout and stages it', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn<typeof fetch>((_input, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      }),
    );
    const gateway = new FetchCommandGateway({ fetcher, timeoutMs: 50 });

    const result = gateway.send('/api/v1/accounts/sync', 'POST', {});
    await vi.advanceTimersByTimeAsync(50);

    await expect(result).resolves.toMatchObject({ status: 'staged' });
    expect(fetcher.mock.calls[0]?.[1]?.signal?.aborted).toBe(true);
  });
});
