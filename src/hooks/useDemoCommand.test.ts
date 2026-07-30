import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CommandGateway, CommandResult } from '@/data/commands';
import { useDemoCommand } from './useDemoCommand';

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

describe('useDemoCommand', () => {
  it('ignores duplicate submissions while the first command is pending', async () => {
    const pending = deferred<CommandResult>();
    const send = vi.fn<CommandGateway['send']>().mockReturnValue(pending.promise);
    const { result } = renderHook(() => useDemoCommand({ send }));

    let first!: Promise<CommandResult | undefined>;
    let duplicate!: Promise<CommandResult | undefined>;
    act(() => {
      first = result.current.submit('/api/v1/accounts/sync', 'POST', {});
      duplicate = result.current.submit('/api/v1/accounts/sync', 'POST', {});
    });

    expect(result.current.status).toBe('pending');
    expect(send).toHaveBeenCalledOnce();
    await expect(duplicate).resolves.toBeUndefined();

    await act(async () => {
      pending.resolve({ status: 'staged', requestId: 'request-1', message: 'Demo mode: request staged' });
      await first;
    });
    expect(result.current.status).toBe('staged');
  });

  it('resets a completed command to idle', async () => {
    const gateway: CommandGateway = {
      send: vi.fn().mockResolvedValue({
        status: 'sent',
        requestId: 'request-2',
        message: 'Request received',
      }),
    };
    const { result } = renderHook(() => useDemoCommand(gateway));

    await act(() => result.current.submit('/api/v1/accounts/sync', 'POST', {}));
    expect(result.current.result).toEqual({
      status: 'sent',
      requestId: 'request-2',
      message: 'Request received',
    });

    act(() => result.current.reset());

    expect(result.current.status).toBe('idle');
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
