import { httpStatus } from './session';
import type { AuthEndpoints, SessionInfo } from './types';

export type AuthFetcher = (
  url: string,
  options?: { method?: 'POST'; credentials?: 'include'; headers?: Record<string, string> },
) => Promise<unknown>;

/**
 * HTTP layer of the backend auth API. Authentication relies on the same-origin session cookie;
 * state-changing calls carry the double-submit CSRF token from `GET /auth/csrf`.
 */
export function createAuthClient(fetcher: AuthFetcher, endpoints: AuthEndpoints) {
  let csrfToken: string | null = null;

  async function fetchCsrfToken(): Promise<string> {
    const res = await fetcher(endpoints.csrf, { credentials: 'include' }) as { csrfToken?: string } | null;
    if (!res?.csrfToken) {
      throw new Error('CSRF endpoint returned no token');
    }
    csrfToken = res.csrfToken;
    return csrfToken;
  }

  /** On 403 the token is fetched again and the request is retried once. */
  async function postWithCsrf<T>(endpoint: string): Promise<T> {
    const send = async (token: string) => await fetcher(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-CSRF-Token': token },
    }) as T;

    try {
      return await send(csrfToken ?? await fetchCsrfToken());
    } catch (e) {
      if (httpStatus(e) !== 403) {
        throw e;
      }
      return send(await fetchCsrfToken());
    }
  }

  return {
    /** Read-only status check; does not extend the session. */
    getSession: async () => await fetcher(endpoints.session, { credentials: 'include' }) as SessionInfo,
    /** Extends the session; only call on genuine user activity. */
    refresh: () => postWithCsrf<SessionInfo>(endpoints.refresh),
    signOut: async () => {
      await postWithCsrf<void>(endpoints.signout);
    },
    forgetCsrfToken: () => {
      csrfToken = null;
    },
  };
}

export type AuthClient = ReturnType<typeof createAuthClient>;
