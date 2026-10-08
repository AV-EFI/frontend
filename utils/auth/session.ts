import type { AuthSession, SessionInfo } from './types';

/** Single definition of "logged in" for raw backend responses, shared by client and server code. */
export function isAuthenticatedSession(session: Partial<SessionInfo> | null | undefined): boolean {
  return session?.authenticated ?? !!session?.user;
}

/** Route-guard decision for SSR: an unreachable or failing session endpoint counts as logged out. */
export async function isSessionAuthenticatedForGuard(
  fetchSession: () => Promise<Partial<SessionInfo> | null | undefined>,
): Promise<boolean> {
  try {
    return isAuthenticatedSession(await fetchSession());
  } catch {
    return false;
  }
}

/**
 * Maps a backend response (or a locally persisted session) to local state; `null` means logged out.
 *
 * The remaining lifetime is `expires_at - server_time` on the server clock, re-anchored to the
 * local clock, so a skewed client clock cannot expire the session early or late. A persisted
 * session already carries its anchored deadline; re-deriving it from the stale `server_time`
 * would silently extend the session on every restore.
 */
export function normalizeSession(
  raw: (Partial<SessionInfo> & { expiresAtLocal?: number | null }) | null | undefined,
  nowSeconds: number,
): AuthSession | null {
  if (!raw || !isAuthenticatedSession(raw)) {
    return null;
  }

  const hasServerDeadline = typeof raw.expires_at === 'number' && typeof raw.server_time === 'number';
  const expiresAtLocal = raw.expiresAtLocal
    ?? (hasServerDeadline ? nowSeconds + (raw.expires_at as number) - (raw.server_time as number) : null);

  return {
    ...(raw as SessionInfo),
    authenticated: true,
    user: raw.user
      ? { ...raw.user, institution: raw.user.institution || raw.user.orgid || '' }
      : raw.user,
    expiresAtLocal,
  };
}

export function isSessionExpired(session: AuthSession | null, nowSeconds: number): boolean {
  return !!session?.expiresAtLocal && session.expiresAtLocal <= nowSeconds;
}

export function httpStatus(error: unknown): number | undefined {
  const candidate = error as { statusCode?: number; status?: number; response?: { status?: number } } | null;
  return candidate?.statusCode ?? candidate?.status ?? candidate?.response?.status;
}

/** 401/403 mean the session is gone; anything else (network, 5xx) is treated as transient. */
export function isSessionRejected(error: unknown): boolean {
  const status = httpStatus(error);
  return status === 401 || status === 403;
}
