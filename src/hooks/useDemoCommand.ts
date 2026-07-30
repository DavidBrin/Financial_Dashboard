import { useCallback, useRef, useState } from 'react';
import { FetchCommandGateway } from '@/data/commands';
import type { CommandGateway, CommandResult } from '@/data/commands';

export type DemoCommandHookStatus = 'idle' | 'pending' | 'sent' | 'staged' | 'error';

export interface DemoCommandHook {
  status: DemoCommandHookStatus;
  result: CommandResult | null;
  error: Error | null;
  submit: (
    path: string,
    method: string,
    payload: unknown,
    signal?: AbortSignal,
  ) => Promise<CommandResult | undefined>;
  reset: () => void;
}

const defaultGateway = new FetchCommandGateway({ baseUrl: import.meta.env.VITE_API_BASE_URL });

export function useDemoCommand(gateway: CommandGateway = defaultGateway): DemoCommandHook {
  const pendingRef = useRef(false);
  const [status, setStatus] = useState<DemoCommandHookStatus>('idle');
  const [result, setResult] = useState<CommandResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(
    async (path: string, method: string, payload: unknown, signal?: AbortSignal) => {
      if (pendingRef.current) return undefined;

      pendingRef.current = true;
      setStatus('pending');
      setResult(null);
      setError(null);
      try {
        const commandResult = await gateway.send(path, method, payload, signal);
        setResult(commandResult);
        setStatus(commandResult.status);
        return commandResult;
      } catch (cause) {
        const commandError = cause instanceof Error ? cause : new Error('Command failed');
        setError(commandError);
        setStatus('error');
        return undefined;
      } finally {
        pendingRef.current = false;
      }
    },
    [gateway],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, submit, reset };
}
