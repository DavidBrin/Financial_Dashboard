export type ConnectorErrorCode =
  | 'aborted'
  | 'authentication'
  | 'rate_limited'
  | 'provider_unavailable'
  | 'invalid_cursor'
  | 'unknown';

export interface ConnectorErrorOptions {
  readonly code: ConnectorErrorCode;
  readonly message: string;
  readonly providerId: string;
  readonly retryable: boolean;
  readonly cause?: unknown;
}

export class ConnectorError extends Error {
  readonly code: ConnectorErrorCode;
  readonly providerId: string;
  readonly retryable: boolean;

  constructor(options: ConnectorErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = 'ConnectorError';
    this.code = options.code;
    this.providerId = options.providerId;
    this.retryable = options.retryable;
  }
}

export function normalizeConnectorError(
  error: unknown,
  providerId: string,
): ConnectorError {
  if (error instanceof ConnectorError) {
    return error;
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return new ConnectorError({
      code: 'aborted',
      message: 'Connector operation was aborted',
      providerId,
      retryable: false,
      cause: error,
    });
  }

  return new ConnectorError({
    code: 'unknown',
    message: error instanceof Error ? error.message : 'Unknown connector failure',
    providerId,
    retryable: false,
    cause: error,
  });
}

export function throwIfAborted(signal: AbortSignal, providerId: string): void {
  if (signal.aborted) {
    throw new ConnectorError({
      code: 'aborted',
      message: 'Connector operation was aborted',
      providerId,
      retryable: false,
      cause: signal.reason,
    });
  }
}
