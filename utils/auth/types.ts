/** Authenticated user as reported by the backend; unknown extra claims are passed through. */
export interface AuthUser {
  name?: string;
  email?: string;
  orgid?: string;
  institution?: string;
  [claim: string]: unknown;
}

/** Response of `GET /auth/session` and `POST /auth/refresh`. */
export interface SessionInfo {
  authenticated: boolean;
  user?: AuthUser | null;
  scopes?: string[];
  audience?: string | null;
  /** Server clock, unix seconds. */
  server_time: number;
  /** Absolute expiry on the server clock, unix seconds. */
  expires_at?: number | null;
}

/** An authenticated session plus its expiry anchored to the local clock (unix seconds). */
export interface AuthSession extends SessionInfo {
  authenticated: true;
  expiresAtLocal: number | null;
}

export interface AuthEndpoints {
  session: string;
  refresh: string;
  signout: string;
  csrf: string;
  signin: string;
}
