import { describe, expect, test } from 'vitest';
import { isSessionAuthenticatedForGuard } from '~/utils/auth/session';

describe('SSR route guard session check', () => {
  test('allows an authenticated session', async () => {
    await expect(isSessionAuthenticatedForGuard(async () => ({ authenticated: true }))).resolves.toBe(true);
  });

  test('denies a logged-out session', async () => {
    await expect(isSessionAuthenticatedForGuard(async () => ({ authenticated: false, user: null }))).resolves.toBe(false);
  });

  test('denies when the session endpoint fails', async () => {
    const failing = async () => {
      throw new Error('fetch failed');
    };
    await expect(isSessionAuthenticatedForGuard(failing)).resolves.toBe(false);
  });

  test('denies an empty response', async () => {
    await expect(isSessionAuthenticatedForGuard(async () => null)).resolves.toBe(false);
  });
});
