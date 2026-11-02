import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import type { AuthClient } from './authClient';
import { isSessionExpired, isSessionRejected, normalizeSession } from './session';
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
  /** The reported session duration has run out; only the next user activity can renew it. */
  const sessionExpired = ref(false);
  let refreshInFlight = false;

  const sync = options.browser
    ? createSessionSync({
      storage: options.browser.storage,
      events: options.browser.events,
      now,
      onSession: (next) => {
        session.value = next;
        sessionExpired.value = isSessionExpired(next, now() / 1000);
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
    sessionExpired.value = isSessionExpired(next, now() / 1000);
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

  /**
   * The backend no longer reports the access token as valid. The refresh token may still be, but
   * renewing it is reserved for user activity: a timer must never keep an idle session alive.
   */
  function markExpired() {
    sessionExpired.value = true;
  }

  async function getSession() {
    log('getSession called');
    loading.value = true;
    error.value = null;
    const wasAuthenticated = !!session.value;
    try {
      const next = normalizeSession(await client.getSession(), now() / 1000);
      if (!next && wasAuthenticated) {
        // An expired access token is reported as logged out although the refresh token may still
        // be valid; the next user activity decides whether the session can be renewed.
        markExpired();
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
        markExpired();
      } else {
        setSession(null);
      }
    } finally {
      loading.value = false;
    }
  }

  /** Extends the session; run on user activity after the deadline. */
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
      } else {
        // Transient failure: keep local state and check again later.
        keeper?.scheduleCheck(RETRY_AFTER_ERROR_MS);
      }
    } finally {
      refreshInFlight = false;
    }
  }

  /**
   * Route-guard entry: a visitor whose access token has expired is not logged out while the refresh
   * token is still valid, so a status check that finds no session is followed by one refresh.
   */
  async function recoverSession() {
    await getSession();
    if (session.value) {
      return;
    }
    try {
      const next = normalizeSession(await client.refresh(), now() / 1000);
      if (next) {
        setSession(next);
        keeper?.scheduleCheck();
      }
    } catch (e) {
      log('No session to recover', e);
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

  /** Restores the persisted session, even past its deadline, and follows changes made in other tabs. */
  function init() {
    const restored = sync?.restore();
    if (restored) {
      session.value = restored;
      sessionExpired.value = isSessionExpired(restored, now() / 1000);
    }
    sync?.listen();
  }

  /** A reload counts as user activity: a persisted session past its deadline is renewed right away. */
  function startSessionPolling() {
    keeper?.start();
    return sessionExpired.value ? refreshSession() : getSession();
  }

  function stopSessionPolling() {
    keeper?.stop();
  }

  return {
    data: session,
    loading,
    error,
    isAuthenticated,
    sessionExpired,
    init,
    getSession,
    recoverSession,
    refreshSession,
    startSessionPolling,
    stopSessionPolling,
    signIn,
    signOut,
  };
}

export type AuthService = ReturnType<typeof createAuthService>;
