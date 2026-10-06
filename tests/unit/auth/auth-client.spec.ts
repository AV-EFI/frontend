import { describe, expect, test, vi } from 'vitest';
import { createAuthClient } from '~/utils/auth/authClient';
import type { AuthFetcher } from '~/utils/auth/authClient';

const endpoints = {
  session: '/auth/session',
  refresh: '/auth/refresh',
  signout: '/auth/signout',
  csrf: '/auth/csrf',
  signin: '/auth/signin/academiccloud',
};

function httpError(statusCode: number) {
  return Object.assign(new Error(`HTTP ${statusCode}`), { statusCode });
}

describe('auth client', () => {
  test('reads the session with credentials and never touches refresh or CSRF', async () => {
    const fetcher = vi.fn<AuthFetcher>(async () => ({ authenticated: false, server_time: 1 }));
    const client = createAuthClient(fetcher, endpoints);

    await client.getSession();

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith('/auth/session', { credentials: 'include' });
  });

  test('sends refresh as POST with the CSRF header and caches the token', async () => {
    const fetcher = vi.fn<AuthFetcher>(async (url) => (url === '/auth/csrf' ? { csrfToken: 'tok' } : { authenticated: true, server_time: 1 }));
    const client = createAuthClient(fetcher, endpoints);

    await client.refresh();
    await client.refresh();

    expect(fetcher.mock.calls.filter(([url]) => url === '/auth/csrf')).toHaveLength(1);
    const refreshCalls = fetcher.mock.calls.filter(([url]) => url === '/auth/refresh');
    expect(refreshCalls).toHaveLength(2);
    expect(refreshCalls[0]?.[1]).toEqual({ method: 'POST', credentials: 'include', headers: { 'X-CSRF-Token': 'tok' } });
  });

  test('refetches the token once on 403 and retries', async () => {
    let csrfCalls = 0;
    let postCalls = 0;
    const fetcher = vi.fn<AuthFetcher>(async (url) => {
      if (url === '/auth/csrf') {
        csrfCalls += 1;
        return { csrfToken: `tok-${csrfCalls}` };
      }
      postCalls += 1;
      if (postCalls === 1) throw httpError(403);
      return { authenticated: true, server_time: 1 };
    });
    const client = createAuthClient(fetcher, endpoints);

    await expect(client.refresh()).resolves.toMatchObject({ authenticated: true });
    expect(csrfCalls).toBe(2);
    expect(fetcher.mock.calls.at(-1)?.[1]?.headers).toEqual({ 'X-CSRF-Token': 'tok-2' });
  });

  test('gives up after a second 403', async () => {
    const fetcher = vi.fn<AuthFetcher>(async (url) => {
      if (url === '/auth/csrf') return { csrfToken: 'tok' };
      throw httpError(403);
    });
    const client = createAuthClient(fetcher, endpoints);

    await expect(client.signOut()).rejects.toMatchObject({ statusCode: 403 });
    expect(fetcher.mock.calls.filter(([url]) => url === '/auth/signout')).toHaveLength(2);
  });

  test('does not retry other errors', async () => {
    const fetcher = vi.fn<AuthFetcher>(async (url) => {
      if (url === '/auth/csrf') return { csrfToken: 'tok' };
      throw httpError(401);
    });
    const client = createAuthClient(fetcher, endpoints);

    await expect(client.refresh()).rejects.toMatchObject({ statusCode: 401 });
    expect(fetcher.mock.calls.filter(([url]) => url === '/auth/refresh')).toHaveLength(1);
  });

  test('fails when the CSRF endpoint returns no token', async () => {
    const client = createAuthClient(async () => ({}), endpoints);

    await expect(client.signOut()).rejects.toThrow('no token');
  });
});
