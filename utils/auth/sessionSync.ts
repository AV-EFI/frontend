import { isSessionExpired, normalizeSession } from './session';
import type { AuthSession } from './types';

const SESSION_KEY = 'auth_session';
const LOGOUT_KEY = 'auth_logout';

export interface SessionSyncOptions {
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  /** Receives `storage` events written by other tabs. */
  events: Pick<EventTarget, 'addEventListener' | 'removeEventListener'>;
  /** Local clock in milliseconds. */
  now: () => number;
  onSession: (session: AuthSession | null) => void;
  onLogout: () => void;
}

/** Persists the session in localStorage and mirrors session changes and logouts across tabs. */
export function createSessionSync(options: SessionSyncOptions) {
  const { storage } = options;

  function persist(session: AuthSession | null) {
    try {
      if (session) {
        storage.setItem(SESSION_KEY, JSON.stringify(session));
      } else {
        storage.removeItem(SESSION_KEY);
      }
    } catch {
      // Storage can be unavailable (private mode, quota); the in-memory session stays authoritative.
    }
  }

  /** Persisted session, or `null` when absent, unreadable or already expired. */
  function restore(): AuthSession | null {
    try {
      const saved = storage.getItem(SESSION_KEY);
      const session = saved ? normalizeSession(JSON.parse(saved), options.now() / 1000) : null;
      return isSessionExpired(session, options.now() / 1000) ? null : session;
    } catch {
      return null;
    }
  }

  function broadcastLogout() {
    try {
      storage.setItem(LOGOUT_KEY, options.now().toString());
      storage.removeItem(LOGOUT_KEY);
    } catch {
      // Other tabs notice the ended session on their next status check.
    }
  }

  function onStorage(event: Event) {
    const { key, newValue } = event as StorageEvent;
    if (!newValue) {
      return;
    }
    if (key === LOGOUT_KEY) {
      options.onLogout();
    } else if (key === SESSION_KEY) {
      try {
        options.onSession(normalizeSession(JSON.parse(newValue), options.now() / 1000));
      } catch {
        options.onSession(null);
      }
    }
  }

  /** Starts listening; returns the function that stops it. */
  function listen() {
    options.events.addEventListener('storage', onStorage);
    return () => options.events.removeEventListener('storage', onStorage);
  }

  return { persist, restore, broadcastLogout, listen };
}
