export type CommandStatus = 'pending' | 'sent' | 'staged' | 'failed';

export interface DemoCommand {
  requestId: string;
  timestamp: string;
  action: string;
  resourceType: string;
  resourceId: string;
  payload: unknown;
  status: CommandStatus;
}

export interface CommandResult {
  status: 'sent' | 'staged';
  requestId: string;
  message: string;
}

export interface CommandGateway {
  send(path: string, method: string, payload: unknown, signal?: AbortSignal): Promise<CommandResult>;
}

interface FetchCommandGatewayOptions {
  baseUrl?: string;
  fetcher?: typeof fetch;
  timeoutMs?: number;
  createRequestId?: () => string;
  now?: () => Date;
}

const STORAGE_KEY = 'financial-command-center:staged-commands';
const memoryCommands: DemoCommand[] = [];

function storage(): Storage | undefined {
  return typeof globalThis.window === 'undefined' ? undefined : globalThis.window.localStorage;
}

function readStoredCommands(): DemoCommand[] {
  const raw = storage()?.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  return Array.isArray(parsed) ? (parsed as DemoCommand[]) : [];
}

export function stageCommand(command: DemoCommand): DemoCommand {
  memoryCommands.push(command);
  try {
    const commands = readStoredCommands();
    commands.push(command);
    storage()?.setItem(STORAGE_KEY, JSON.stringify(commands));
  } catch {
    // In-memory staging keeps demo actions visible when storage is unavailable.
  }
  return command;
}

export function listStagedCommands(): DemoCommand[] {
  try {
    return readStoredCommands();
  } catch {
    return [...memoryCommands];
  }
}

function resourceFromPath(path: string): Pick<DemoCommand, 'resourceType' | 'resourceId'> {
  const segments = path.split('?')[0]?.split('/').filter(Boolean) ?? [];
  const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
  const resourceIndex = versionIndex >= 0 ? versionIndex + 1 : 0;
  return {
    resourceType: segments[resourceIndex] ?? 'command',
    resourceId: segments[resourceIndex + 1] ?? 'unknown',
  };
}

function isSuccessEnvelope(value: unknown): value is { requestId: string; message: string } {
  if (!value || typeof value !== 'object') return false;
  const envelope = value as Record<string, unknown>;
  return typeof envelope.requestId === 'string' && typeof envelope.message === 'string';
}

export class FetchCommandGateway implements CommandGateway {
  private readonly baseUrl: string;
  private readonly fetcher: typeof fetch;
  private readonly timeoutMs: number;
  private readonly createRequestId: () => string;
  private readonly now: () => Date;

  constructor(options: FetchCommandGatewayOptions = {}) {
    this.baseUrl = options.baseUrl?.replace(/\/$/, '') ?? '';
    this.fetcher = options.fetcher ?? globalThis.fetch.bind(globalThis);
    this.timeoutMs = options.timeoutMs ?? 8_000;
    this.createRequestId = options.createRequestId ?? (() => crypto.randomUUID());
    this.now = options.now ?? (() => new Date());
  }

  async send(path: string, method: string, payload: unknown, signal?: AbortSignal): Promise<CommandResult> {
    const requestId = this.createRequestId();
    const controller = new AbortController();
    const abort = () => controller.abort(signal?.reason);
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) abort();
    const timeout = globalThis.setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetcher(`${this.baseUrl}${path}`, {
        method,
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': requestId,
        },
        signal: controller.signal,
      });
      const contentType = response.headers.get('Content-Type') ?? '';
      if (!response.ok || !contentType.toLowerCase().includes('application/json')) {
        return this.stage(path, method, payload, requestId);
      }

      const envelope: unknown = await response.json();
      if (!isSuccessEnvelope(envelope)) {
        return this.stage(path, method, payload, requestId);
      }
      return { status: 'sent', requestId: envelope.requestId, message: envelope.message };
    } catch {
      return this.stage(path, method, payload, requestId);
    } finally {
      globalThis.clearTimeout(timeout);
      signal?.removeEventListener('abort', abort);
    }
  }

  private stage(path: string, method: string, payload: unknown, requestId: string): CommandResult {
    stageCommand({
      requestId,
      timestamp: this.now().toISOString(),
      action: `${method} ${path}`,
      ...resourceFromPath(path),
      payload,
      status: 'staged',
    });
    return { status: 'staged', requestId, message: 'Demo mode: request staged' };
  }
}
