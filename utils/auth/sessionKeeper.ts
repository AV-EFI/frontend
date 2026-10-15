const KEEPALIVE_THROTTLE_MS = 60_000;
const EXPIRY_CHECK_GRACE_MS = 2_000;
export const RETRY_AFTER_ERROR_MS = 60_000;
const MIN_TIMER_MS = 1_000;
const MAX_TIMER_MS = 2_147_483_647;
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll'] as const;

export interface SessionKeeperOptions {
  /** Read-only status check, run shortly after the deadline. */
  check: () => void | Promise<void>;
  /** Extends the session; run on throttled user activity. */
  refresh: () => void | Promise<void>;
  hasSession: () => boolean;
  /** Deadline on the local clock, unix seconds. */
  deadline: () => number | null;
  activityTarget: Pick<EventTarget, 'addEventListener' | 'removeEventListener'>;
  /** Local clock in milliseconds. */
  now?: () => number;
}

/**
 * Keeps the status check and the activity keepalive apart: polling only reflects state and
 * detects expiry, while only real user activity extends the session. Activity triggers a
 * refresh once the reported session duration has run out (at most once per minute), so an
 * idle tab is never kept alive and an expired access token is renewed on the next interaction.
 */
export function createSessionKeeper(options: SessionKeeperOptions) {
  const now = options.now ?? Date.now;
  let running = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastRefreshAttempt = 0;

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function isDeadlinePassed() {
    const deadline = options.deadline();
    return deadline === null || deadline * 1000 <= now();
  }

  function onActivity() {
    if (!options.hasSession() || !isDeadlinePassed() || now() - lastRefreshAttempt < KEEPALIVE_THROTTLE_MS) {
      return;
    }
    lastRefreshAttempt = now();
    options.refresh();
  }

  /** Schedules the next status check; without `delayMs` it follows the current deadline. */
  function scheduleCheck(delayMs?: number) {
    clearTimer();
    if (!running) {
      return;
    }

    let delay = delayMs;
    if (delay === undefined) {
      const deadline = options.deadline();
      if (!deadline) {
        return;
      }
      // The backend keeps reporting a session as authenticated past `expires_at` while it is
      // still refreshable (access token expired). Only user activity can renew such a session,
      // so no further status check is scheduled once the deadline has passed.
      if (deadline * 1000 <= now()) {
        return;
      }
      delay = deadline * 1000 - now() + EXPIRY_CHECK_GRACE_MS;
    }
    timer = setTimeout(options.check, Math.min(Math.max(delay, MIN_TIMER_MS), MAX_TIMER_MS));
  }

  function stop() {
    running = false;
    clearTimer();
    ACTIVITY_EVENTS.forEach(name => options.activityTarget.removeEventListener(name, onActivity));
  }

  function start() {
    stop();
    running = true;
    ACTIVITY_EVENTS.forEach(name => options.activityTarget.addEventListener(name, onActivity, { passive: true }));
  }

  return { start, stop, scheduleCheck };
}
