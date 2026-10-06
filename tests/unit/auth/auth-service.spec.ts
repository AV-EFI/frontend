import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { ref } from 'vue';
import { createAuthService } from '~/utils/auth/authService';
import type { AuthClient } from '~/utils/auth/authClient';
import { isAuthenticatedSession, normalizeSession } from '~/utils/auth/session';
import type { AuthSession } from '~/utils/auth/types';

const START = new Date('2026-01-01T00:00:00Z');

function httpError(statusCode: number) {
  return Object.assign(new Error(`HTTP ${statusCode}`), { statusCode });
}

function sessionInfo(overrides: Record<string, unknown> = {}) {
  return {
    authenticated: true,
    user: { name: 'Test', orgid: 'org-1' },
    scopes: [],
    audience: null,
    server_time: 1_000_000,
    expires_at: 1_000_300,
    ...overrides,
  };
}

function fakeStorage(initial: Record<string, string> = {}) {
  const items = new Map(Object.entries(initial));
  return {
    items,
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
    removeItem: (key: string) => void items.delete(key),
  };
}

function setup(options: { storage?: ReturnType<typeof fakeStorage>; onProtectedRoute?: boolean; browser?: boolean } = {}) {
  const client = {
    getSession: vi.fn(async () => sessionInfo()),
    refresh: vi.fn(async () => sessionInfo()),
    signOut: vi.fn(async () => undefined),
    forgetCsrfToken: vi.fn(),
  };
  const events = new EventTarget();
  const storage = options.storage ?? fakeStorage();
  const goHome = vi.fn();
  const redirect = vi.fn();
  const session = ref<AuthSession | null>(null);
  const service = createAuthService({
    client: client as unknown as AuthClient,
    session,
    signInUrl: '/auth/signin/academiccloud',
    redirect,
    navigation: { goHome, isOnProtectedRoute: () => options.onProtectedRoute ?? true },
    browser: options.browser === false ? undefined : { storage, events },
  });
  return { client, events, storage, goHome, redirect, session, service };
}

function dispatchStorage(events: EventTarget, key: string, newValue: string | null) {
  events.dispatchEvent(Object.assign(new Event('storage'), { key, newValue }));
}

describe('session mapping', () => {
  test('anchors the deadline to the local clock using server_time', () => {
    const session = normalizeSession(sessionInfo({ server_time: 5, expires_at: 305 }), 2_000);

    expect(session?.expiresAtLocal).toBe(2_300);
    expect(session?.user?.institution).toBe('org-1');
  });

  test('treats a logged-out response as no session', () => {
    expect(normalizeSession({ authenticated: false, server_time: 5 }, 0)).toBeNull();
    expect(isAuthenticatedSession({ authenticated: false })).toBe(false);
  });

  test('falls back to the user when the authenticated flag is missing', () => {
    expect(isAuthenticatedSession({ user: { name: 'x' } })).toBe(true);
    expect(isAuthenticatedSession({})).toBe(false);
    expect(isAuthenticatedSession(null)).toBe(false);
  });

  test('keeps an already anchored deadline instead of re-deriving it', () => {
    const session = normalizeSession({ ...sessionInfo(), expiresAtLocal: 42 }, 9_999);

    expect(session?.expiresAtLocal).toBe(42);
  });
});

describe('auth service', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(START);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('persists an authenticated session and removes it again when logged out', async () => {
    const { service, storage, client } = setup();

    await service.getSession();
    expect(service.isAuthenticated.value).toBe(true);
    expect(storage.items.has('auth_session')).toBe(true);

    client.getSession.mockResolvedValueOnce({ authenticated: false, server_time: 1 } as never);
    await service.getSession();
    expect(service.isAuthenticated.value).toBe(false);
    expect(storage.items.has('auth_session')).toBe(false);
  });

  test('polling never calls refresh', async () => {
    const { service, client } = setup();

    await service.startSessionPolling();
    await vi.advanceTimersByTimeAsync(1_000_000);
    service.stopSessionPolling();

    expect(client.refresh).not.toHaveBeenCalled();
    expect(client.getSession.mock.calls.length).toBeGreaterThan(1);
  });

  test('checks the session again shortly after the computed deadline', async () => {
    const { service, client } = setup();

    await service.startSessionPolling();
    expect(client.getSession).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(299_000);
    expect(client.getSession).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(3_000);
    expect(client.getSession).toHaveBeenCalledTimes(2);
    service.stopSessionPolling();
  });

  test('does not poll faster than once a minute while the server reports a refreshable session past its deadline', async () => {
    const { service, client } = setup();
    client.getSession.mockResolvedValue(sessionInfo({ server_time: 1_000_000, expires_at: 999_990 }) as never);

    await service.startSessionPolling();
    await vi.advanceTimersByTimeAsync(300_000);
    service.stopSessionPolling();

    expect(client.getSession.mock.calls.length).toBeLessThanOrEqual(6);
    expect(service.isAuthenticated.value).toBe(true);
  });

  test('ends the session and leaves protected routes when the deadline check reports logged out', async () => {
    const { service, client, goHome } = setup();
    await service.startSessionPolling();
    client.getSession.mockResolvedValue({ authenticated: false, server_time: 1 } as never);

    await vi.advanceTimersByTimeAsync(303_000);

    expect(service.data.value).toBeNull();
    expect(goHome).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1_000_000);
    expect(client.getSession).toHaveBeenCalledTimes(2);
  });

  test('stays on public pages when the session ends', async () => {
    const { service, client, goHome } = setup({ onProtectedRoute: false });
    await service.getSession();
    client.getSession.mockRejectedValueOnce(httpError(401));

    await service.getSession();

    expect(service.data.value).toBeNull();
    expect(goHome).not.toHaveBeenCalled();
  });

  test('keeps the session on transient status check failures and retries', async () => {
    const { service, client } = setup();
    await service.startSessionPolling();
    client.getSession.mockRejectedValueOnce(httpError(503));
    await vi.advanceTimersByTimeAsync(302_000);

    expect(service.isAuthenticated.value).toBe(true);
    await vi.advanceTimersByTimeAsync(61_000);
    expect(client.getSession).toHaveBeenCalledTimes(3);
    service.stopSessionPolling();
  });

  test('throttles activity refreshes to one per minute', async () => {
    const { service, client, events } = setup();
    await service.startSessionPolling();

    events.dispatchEvent(new Event('mousemove'));
    events.dispatchEvent(new Event('keydown'));
    await vi.advanceTimersByTimeAsync(0);
    expect(client.refresh).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(61_000);
    events.dispatchEvent(new Event('click'));
    await vi.advanceTimersByTimeAsync(0);
    expect(client.refresh).toHaveBeenCalledTimes(2);
    service.stopSessionPolling();
  });

  test('ignores activity while logged out or after polling stopped', async () => {
    const { service, client, events } = setup();
    client.getSession.mockResolvedValue({ authenticated: false, server_time: 1 } as never);
    await service.startSessionPolling();
    events.dispatchEvent(new Event('click'));
    await vi.advanceTimersByTimeAsync(0);

    client.getSession.mockResolvedValue(sessionInfo());
    await service.getSession();
    service.stopSessionPolling();
    events.dispatchEvent(new Event('click'));
    await vi.advanceTimersByTimeAsync(0);

    expect(client.refresh).not.toHaveBeenCalled();
  });

  test('a rejected refresh clears local state, stops polling and leaves protected routes', async () => {
    const { service, client, events, goHome, storage } = setup();
    await service.startSessionPolling();
    client.refresh.mockRejectedValueOnce(httpError(401));

    events.dispatchEvent(new Event('click'));
    await vi.advanceTimersByTimeAsync(0);

    expect(service.data.value).toBeNull();
    expect(storage.items.has('auth_session')).toBe(false);
    expect(client.forgetCsrfToken).toHaveBeenCalled();
    expect(goHome).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1_000_000);
    expect(client.getSession).toHaveBeenCalledTimes(1);
  });

  test('a transient refresh failure keeps the session', async () => {
    const { service, client } = setup();
    await service.getSession();
    client.refresh.mockRejectedValueOnce(httpError(503));

    await service.refreshSession();

    expect(service.isAuthenticated.value).toBe(true);
  });

  test('sign-out clears state, notifies other tabs and navigates even if the request fails', async () => {
    const { service, client, goHome, storage } = setup();
    await service.getSession();
    client.signOut.mockRejectedValueOnce(httpError(500));

    await service.signOut();

    expect(client.signOut).toHaveBeenCalledTimes(1);
    expect(service.data.value).toBeNull();
    expect(storage.items.has('auth_session')).toBe(false);
    expect(goHome).toHaveBeenCalledTimes(1);
  });

  test('restores the persisted deadline instead of re-extending it', () => {
    const deadline = START.getTime() / 1000 + 10;
    const storage = fakeStorage({ auth_session: JSON.stringify({ ...sessionInfo(), expiresAtLocal: deadline }) });
    const { service } = setup({ storage });

    service.init();

    expect(service.data.value?.expiresAtLocal).toBe(deadline);
  });

  test('drops an already expired persisted session', () => {
    const storage = fakeStorage({
      auth_session: JSON.stringify({ ...sessionInfo(), expiresAtLocal: START.getTime() / 1000 - 5 }),
    });
    const { service } = setup({ storage });

    service.init();

    expect(service.data.value).toBeNull();
  });

  test('follows session and logout changes made in other tabs', () => {
    const { service, events, goHome } = setup();
    service.init();

    dispatchStorage(events, 'auth_session', JSON.stringify({ ...sessionInfo(), expiresAtLocal: START.getTime() / 1000 + 60 }));
    expect(service.isAuthenticated.value).toBe(true);

    dispatchStorage(events, 'auth_logout', '123');
    expect(service.data.value).toBeNull();
    expect(goHome).toHaveBeenCalledTimes(1);
  });

  test('ignores the removal half of the logout broadcast', () => {
    const { service, events, goHome } = setup();
    service.init();

    dispatchStorage(events, 'auth_logout', null);

    expect(goHome).not.toHaveBeenCalled();
  });

  test('works as a passive instance without browser collaborators', async () => {
    const { service, client } = setup({ browser: false });

    service.init();
    await service.startSessionPolling();

    expect(client.getSession).toHaveBeenCalledTimes(1);
    expect(service.isAuthenticated.value).toBe(true);
  });

  test('sign-in redirects to the configured endpoint', () => {
    const { service, redirect } = setup();

    service.signIn();

    expect(redirect).toHaveBeenCalledWith('/auth/signin/academiccloud');
  });
});
