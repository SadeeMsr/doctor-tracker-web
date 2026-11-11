import { beforeEach, describe, expect, it, vi } from 'vitest';

import { api, ApiError } from '@/lib/api-client';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const problem = (status: number, code: string) =>
  json(status, { error: { code, message: code, requestId: 'req-1' } });

describe('api client', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    // jsdom's location can't be spied on; swap in a stand-in to observe the login redirect.
    vi.stubGlobal('location', { pathname: '/patients', search: '?page=2', assign: vi.fn() });
  });

  it('refreshes an expired session once and retries the request', async () => {
    fetchMock
      .mockResolvedValueOnce(problem(401, 'UNAUTHORIZED'))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(json(200, { data: { id: 'd1' } }));

    await expect(api.get('/doctors/d1')).resolves.toEqual({ data: { id: 'd1' } });
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      '/api/v1/doctors/d1',
      '/api/v1/auth/refresh',
      '/api/v1/doctors/d1',
    ]);
  });

  it('also refreshes for /auth/me, so the user menu survives an expired access token', async () => {
    fetchMock
      .mockResolvedValueOnce(problem(401, 'UNAUTHORIZED'))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(json(200, { data: { name: 'Admin' } }));

    await api.get('/auth/me');

    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('never refreshes a failed login: the 401 is final', async () => {
    fetchMock.mockResolvedValueOnce(problem(401, 'UNAUTHORIZED'));

    await expect(api.post('/auth/login', { email: 'a', password: 'b' })).rejects.toMatchObject({
      status: 401,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('sends the user to /login when the refresh fails', async () => {
    fetchMock
      .mockResolvedValueOnce(problem(401, 'UNAUTHORIZED'))
      .mockResolvedValueOnce(problem(401, 'UNAUTHORIZED'));

    await expect(api.get('/patients')).rejects.toBeInstanceOf(ApiError);
    expect(window.location.assign).toHaveBeenCalledWith('/login?next=%2Fpatients%3Fpage%3D2');
  });

  it('turns the error envelope into an ApiError with code and request id', async () => {
    fetchMock.mockResolvedValueOnce(problem(409, 'CONFLICT'));

    await expect(api.post('/doctors', {})).rejects.toMatchObject({
      status: 409,
      code: 'CONFLICT',
      requestId: 'req-1',
    });
  });

  it('reports "no response" as a NETWORK_ERROR with status 0', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(api.get('/doctors')).rejects.toMatchObject({ status: 0, code: 'NETWORK_ERROR' });
  });

  it('sends arrays as repeated keys and the Idempotency-Key header on creates', async () => {
    fetchMock
      .mockResolvedValueOnce(json(200, { data: [] }))
      .mockResolvedValueOnce(json(201, { data: {} }));

    await api.get('/doctors', { hospital: ['Square Hospital, Dhaka', 'United'], search: '' });
    await api.post('/doctors/d1/patients', { name: 'X' }, { idempotencyKey: 'key-1' });

    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      '/api/v1/doctors?hospital=Square+Hospital%2C+Dhaka&hospital=United',
    );
    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
      headers: expect.objectContaining({ 'Idempotency-Key': 'key-1' }),
    });
  });
});
