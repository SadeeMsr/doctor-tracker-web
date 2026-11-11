import { vi } from 'vitest';

type Handler = (request: { url: URL; init: RequestInit; body: unknown }) => Response;

export const json = (status: number, body: unknown) =>
  new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

/** The API's error envelope, as the client expects it. */
export const apiError = (
  status: number,
  error: { code: string; message: string; details?: unknown },
) => json(status, { error: { ...error, requestId: 'req-test' } });

/**
 * Replaces `fetch` with a tiny router keyed by `METHOD /path` (query string ignored). Unmatched
 * requests fail loudly, so a test never hits the network by accident. Returns the mock to
 * inspect the calls that were made.
 * @example const fetchMock = mockApi({ 'POST /api/v1/doctors': () => json(201, { data: doctor }) });
 */
export function mockApi(routes: Record<string, Handler>) {
  const fetchMock = vi.fn((input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = new URL(String(input), 'http://localhost');
    const key = `${init.method ?? 'GET'} ${url.pathname}`;
    const handler = routes[key];
    if (!handler) return Promise.reject(new Error(`Unexpected request: ${key}`));
    const body: unknown = typeof init.body === 'string' ? JSON.parse(init.body) : undefined;
    return Promise.resolve(handler({ url, init, body }));
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

/** The parsed JSON body and headers of the n-th call to a mocked route. */
export function requestOf(fetchMock: ReturnType<typeof mockApi>, method: string, path: string) {
  const call = fetchMock.mock.calls.find(
    ([input, init]) =>
      (init?.method ?? 'GET') === method &&
      new URL(String(input), 'http://localhost').pathname === path,
  );
  const init = call?.[1] ?? {};
  return {
    body:
      typeof init.body === 'string'
        ? (JSON.parse(init.body) as Record<string, unknown>)
        : undefined,
    headers: (init.headers ?? {}) as Record<string, string>,
  };
}
