import { createAuthClient } from '~/utils/auth/authClient';
import type { AuthFetcher } from '~/utils/auth/authClient';
import { createAuthService } from '~/utils/auth/authService';
import type { AuthSession } from '~/utils/auth/types';

const PROTECTED_PATH_PREFIXES = ['/protected', '/admin'];

/** Provides `$auth`; in the browser it also restores the session and keeps it in sync and alive. */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public;
  const router = useRouter();

  const client = createAuthClient($fetch as unknown as AuthFetcher, {
    session: config.AUTH_SESSION_ENDPOINT,
    refresh: config.AUTH_REFRESH_ENDPOINT,
    signout: config.AUTH_SIGNOUT_ENDPOINT,
    csrf: config.AUTH_CSRF_ENDPOINT,
    signin: config.AUTH_SIGNIN_ENDPOINT,
  });

  const auth = createAuthService({
    client,
    session: useState<AuthSession | null>('auth:session', () => null),
    signInUrl: config.AUTH_SIGNIN_ENDPOINT,
    redirect: (url) => {
      window.location.href = url;
    },
    navigation: {
      goHome: () => router.push('/'),
      isOnProtectedRoute: () => PROTECTED_PATH_PREFIXES.some(prefix => router.currentRoute.value.path.startsWith(prefix)),
    },
    browser: import.meta.client ? { storage: localStorage, events: window } : undefined,
    log: import.meta.dev ? (...args) => console.log(`[auth ${new Date().toISOString()}]`, ...args) : undefined,
  });

  if (import.meta.client) {
    auth.init();
    nuxtApp.hook('app:mounted', () => {
      auth.startSessionPolling();
    });
  }

  return { provide: { auth } };
});
