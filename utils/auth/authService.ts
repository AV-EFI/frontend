import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import type { AuthClient } from './authClient';
import { isSessionRejected, normalizeSession } from './session';
import { createSessionKeeper, RETRY_AFTER_ERROR_MS } from './sessionKeeper';
import { createSessionSync } from './sessionSync';
import type { SessionSyncOptions } from './sessionSync';
import type { AuthSession } from './types';

export interface AuthServiceOptions {
  client: AuthClient;
  /** Reactive session state; owned by the caller so it can live in Nuxt state. */
  session: Ref<AuthSession | null>;
  signInUrl: string;
  redirect: (url: string) => void;
  navigation: {
    goHome: () => void;
    isOnProtectedRoute: () => boolean;
  };
  /** Browser-only collaborators; without them the service is a passive, state-only instance (SSR). */
  browser?: {
    storage: SessionSyncOptions['storage'];
    /** Source of user activity and of `storage` events from other tabs (the window). */
    events: SessionSyncOptions['events'];
  };
  /** Local clock in milliseconds. */
  now?: () => number;
  log?: (...args: unknown[]) => void;
}

/**
 * Session lifecycle: status checks, activity-based keepalive, sign-out and cross-tab sync.
 * Contains no Nuxt or DOM globals, so it can be unit-tested with injected collaborators.
 */
export function createAuthService(options: AuthServiceOptions) {
  const { client, session, navigation } = options;
  const now = options.now ?? Date.now;
  const log = options.log ?? (() => {});
  const loading = ref(false);
  const error = ref<unknown>(null);
  const isAuthenticated = computed(() => !!session.value);
  let refreshInFlight = false;

  const sync = options.browser
    ? createSessionSync({
      storage: options.browser.storage,
      events: options.browser.events,
      now,
      onSession: (next) => {
        session.value = next;
        keeper?.scheduleCheck();
      },
      onLogout: () => {
        session.value = null;
        keeper?.stop();
        navigation.goHome();
      },
    })
    : null;

  const keeper = options.browser
    ? createSessionKeeper({
      check: () => getSession(),
      refresh: () => refreshSession(),
      hasSession: () => !!session.value,
      deadline: () => session.value?.expiresAtLocal ?? null,
      activityTarget: options.browser.events,
      now,
    })
    : null;

  function setSession(next: AuthSession | null) {
    session.value = next;
    sync?.persist(next);
    if (!next) {
      client.forgetCsrfToken();
    }
  }

  /** The server no longer accepts the session (expired or not refreshable). */
  function endSession() {
    setSession(null);
    keeper?.stop();
    if (navigation.isOnProtectedRoute()) {
      navigation.goHome();
    }
  }

  async function getSession() {
    log('getSession called');
    loading.value = true;
    error.value = null;
    const wasAuthenticated = !!session.value;
    try {
      const next = normalizeSession(await client.getSession(), now() / 1000);
      if (!next && wasAuthenticated) {
        endSession();
      } else {
        setSession(next);
        keeper?.scheduleCheck();
      }
    } catch (e) {
      log('Error fetching session', e);
      error.value = e;
      if (wasAuthenticated && !isSessionRejected(e)) {
        // Transient failure (network, 5xx): keep local state and check again later.
        keeper?.scheduleCheck(RETRY_AFTER_ERROR_MS);
      } else if (wasAuthenticated) {
        endSession();
      } else {
        setSession(null);
      }
    } finally {
      loading.value = false;
    }
  }

  /** Extends the session; reserved for genuine user activity (see session keeper). */
  async function refreshSession() {
    if (!session.value || refreshInFlight) {
      return;
    }
    refreshInFlight = true;
    try {
      const next = normalizeSession(await client.refresh(), now() / 1000);
      if (next) {
        setSession(next);
        keeper?.scheduleCheck();
      } else {
        endSession();
      }
    } catch (e) {
      log('Error refreshing session', e);
      if (isSessionRejected(e)) {
        endSession();
      }
      // Other failures are transient; the next activity after the throttle window retries.
    } finally {
      refreshInFlight = false;
    }
  }

  async function signOut() {
    log('Sign-out called');
    try {
      await client.signOut();
    } catch (e) {
      log('Error during sign-out request', e);
    } finally {
      setSession(null);
      sync?.broadcastLogout();
      keeper?.stop();
      navigation.goHome();
    }
  }

  function signIn() {
    options.redirect(options.signInUrl);
  }

  /** Restores the persisted session and follows changes made in other tabs. */
  function init() {
    const restored = sync?.restore();
    if (restored) {
      session.value = restored;
    }
    sync?.listen();
  }

  function startSessionPolling() {
    keeper?.start();
    return getSession();
  }

  function stopSessionPolling() {
    keeper?.stop();
  }

  return {
    data: session,
    loading,
    error,
    isAuthenticated,
    init,
    getSession,
    refreshSession,
    startSessionPolling,
    stopSessionPolling,
    signIn,
    signOut,
  };
}

export type AuthService = ReturnType<typeof createAuthService>;
