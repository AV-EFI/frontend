import { createError, getRequestHeader, getRequestURL } from 'h3';
import type { H3Event } from 'h3';
import { $fetch } from 'ofetch';
import { AUTH_ENDPOINTS } from '../../utils/auth/endpoints';
import { isAuthenticatedSession } from '../../utils/auth/session';
import type { SessionInfo } from '../../utils/auth/types';

type AuthSession = Partial<SessionInfo>;

export async function getAuthSession(event: H3Event): Promise<AuthSession | null> {
  const url = new URL(AUTH_ENDPOINTS.session, getRequestURL(event).origin).toString();
  const cookie = getRequestHeader(event, 'cookie');

  try {
    return await $fetch<AuthSession>(url, {
      headers: cookie ? { cookie } : undefined,
    });
  } catch {
    return null;
  }
}

export async function requireAuthenticatedUser(event: H3Event): Promise<AuthSession | null> {
  const runtimeConfig = useRuntimeConfig();

  if (runtimeConfig.public.authGuardBypassInDev) {
    return null;
  }

  const session = await getAuthSession(event);
  if (isAuthenticatedSession(session)) {
    return session;
  }

  throw createError({
    statusCode: 401,
    statusMessage: 'Authentication required',
  });
}
