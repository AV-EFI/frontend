import { beforeEach, describe, expect, test, vi } from 'vitest';

const navigateToMock = vi.fn((path: string) => path);
const getSessionMock = vi.fn();

function setupGlobals(options?: {
  authGuardBypassInDev?: boolean;
  user?: Record<string, unknown> | null;
  userAfterSession?: Record<string, unknown> | null;
}) {
  const authState = {
    data: { value: { user: options?.user ?? null } },
    getSession: getSessionMock.mockImplementation(async () => {
      authState.data.value.user = options?.userAfterSession ?? null;
    }),
  };

  vi.stubGlobal('useRuntimeConfig', () => ({
    public: {
      authGuardBypassInDev: options?.authGuardBypassInDev ?? true,
      AUTH_SESSION_ENDPOINT: '/auth/session',
    },
  }));
  vi.stubGlobal('navigateTo', navigateToMock);
  vi.stubGlobal('useAuth', () => authState);
  vi.stubGlobal('defineNuxtRouteMiddleware', (fn: any) => fn);
}

async function importMiddleware() {
  vi.resetModules();
  return (await import('~/middleware/auth.global')).default as (to: { path: string }) => Promise<unknown>;
}

describe('auth.global middleware', () => {
  beforeEach(() => {
    navigateToMock.mockReset();
    getSessionMock.mockReset();
  });

  test('allows protected routes when dev bypass is enabled', async () => {
    setupGlobals({ authGuardBypassInDev: true, user: null });
    const middleware = await importMiddleware();

    const result = await middleware({ path: '/protected/me' });
    expect(result).toBeUndefined();
    expect(navigateToMock).not.toHaveBeenCalled();
  });

  test('redirects unauthenticated admin route to home', async () => {
    setupGlobals({ authGuardBypassInDev: true, user: null, userAfterSession: null });
    const middleware = await importMiddleware();

    const result = await middleware({ path: '/admin/user_tooltips' });
    expect(getSessionMock).toHaveBeenCalledTimes(1);
    expect(result).toBe('/');
    expect(navigateToMock).toHaveBeenCalledWith('/');
  });

  test('allows admin route when session resolves to a user', async () => {
    setupGlobals({
      authGuardBypassInDev: true,
      user: null,
      userAfterSession: { name: 'test-user' },
    });
    const middleware = await importMiddleware();

    const result = await middleware({ path: '/admin/user_tooltips' });
    expect(getSessionMock).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
    expect(navigateToMock).not.toHaveBeenCalled();
  });
});
