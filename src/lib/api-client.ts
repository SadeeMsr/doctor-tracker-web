import { API_BASE_PATH } from './constants';

export interface ApiErrorBody {
  error: { code: string; message: string; details?: unknown; requestId?: string };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, body: ApiErrorBody['error']) {
    super(body.message);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.code;
    this.details = body.details;
  }
}

type QueryValue = string | number | boolean | null | undefined;

interface RequestOptions extends Omit<RequestInit, 'body'> {
  query?: Record<string, QueryValue>;
  body?: unknown;
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

/**
 * Single-flight refresh: if ten requests 401 at once, only one refresh call is made
 * and the rest wait for it.
 */
let refreshPromise: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  refreshPromise ??= fetch(`${API_BASE_PATH}/auth/refresh`, {
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
    return new ApiError(res.status, {
      code: 'NETWORK_ERROR',
      message: res.statusText || 'Request failed',
    });
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, body, skipRefresh, headers, ...init } = options;

  const res = await fetch(buildUrl(path, query), {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });

  if (res.status === 401 && !skipRefresh && !path.startsWith('/auth/')) {
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
