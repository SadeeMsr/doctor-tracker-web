import { API_BASE_PATH } from './constants';

export interface ApiErrorBody {
  error: { code: string; message: string; details?: unknown; requestId?: string };
}

/** Every failed request surfaces as this, whether the server answered or not. */
export class ApiError extends Error {
  /** HTTP status, or `0` when no response arrived (offline, DNS, connection refused). */
  readonly status: number;
  /** Stable error code from the API (see the API's AGENTS.md); branch on this, not `message`. */
  readonly code: string;
  readonly details?: unknown;
  readonly requestId?: string;

  constructor(status: number, body: ApiErrorBody['error']) {
    super(body.message);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.code;
    this.details = body.details;
    this.requestId = body.requestId;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

type QueryValue = string | number | boolean | null | undefined;

interface RequestOptions extends Omit<RequestInit, 'body'> {
  query?: Record<string, QueryValue>;
  body?: unknown;
  /** Sent as `Idempotency-Key`. Generate once per form session and reuse it on retries. */
  idempotencyKey?: string;
  /** Internal: prevents infinite refresh loops. */
  skipRefresh?: boolean;
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  }
  const qs = params.toString();
  return `${API_BASE_PATH}${path}${qs ? `?${qs}` : ''}`;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

/** `fetch` that turns "no response at all" into an `ApiError` with status 0. */
async function send(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    // Cancellation (e.g. TanStack Query aborting a stale request) is not a failure.
    if (isAbortError(error)) throw error;
    throw new ApiError(0, {
      code: 'NETWORK_ERROR',
      message: 'Network request failed',
    });
  }
}

/**
 * Single-flight refresh: if ten requests 401 at once, only one refresh call is made
 * and the rest wait for it.
 */
let refreshPromise: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  refreshPromise ??= send(`${API_BASE_PATH}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

async function parseError(res: Response): Promise<ApiError> {
  try {
    const body = (await res.json()) as ApiErrorBody;
    return new ApiError(res.status, body.error);
  } catch {
    // Not our JSON envelope (e.g. a proxy's HTML error page during a cold start).
    return new ApiError(res.status, {
      code: 'UNEXPECTED_RESPONSE',
      message: res.statusText || 'Unexpected response from the server',
    });
  }
}

/**
 * Endpoints where a 401 must not trigger refresh-and-retry: a failed login or logout is final,
 * and refreshing the refresh call would loop. Everything else, including `/auth/me`, refreshes
 * an expired access token and retries once, like any other request.
 */
const NO_REFRESH_PATHS: ReadonlySet<string> = new Set([
  '/auth/login',
  '/auth/refresh',
  '/auth/logout',
]);

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, body, skipRefresh, idempotencyKey, headers, ...init } = options;

  const res = await send(buildUrl(path, query), {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...(idempotencyKey && { 'Idempotency-Key': idempotencyKey }),
      ...headers,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });

  if (res.status === 401 && !skipRefresh && !NO_REFRESH_PATHS.has(path)) {
    const refreshed = await refreshSession();
    if (refreshed) return apiRequest<T>(path, { ...options, skipRefresh: true });

    if (typeof window !== 'undefined') {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      // Intentional hard navigation: a dead session must also drop every cached query.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`/login?next=${next}`);
    }
  }

  if (!res.ok) throw await parseError(res);
  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, query?: RequestOptions['query'], init?: RequestOptions) =>
    apiRequest<T>(path, { ...init, method: 'GET', query }),
  post: <T>(path: string, body?: unknown, init?: RequestOptions) =>
    apiRequest<T>(path, { ...init, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, init?: RequestOptions) =>
    apiRequest<T>(path, { ...init, method: 'PATCH', body }),
  delete: <T = void>(path: string, init?: RequestOptions) =>
    apiRequest<T>(path, { ...init, method: 'DELETE' }),
};
