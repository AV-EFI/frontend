import { createError, getRequestHeader, getRequestURL } from 'h3';
import type { H3Event } from 'h3';

type AuthSession = {
  user?: Record<string, unknown> | null;
};

function resolveSessionUrl(event: H3Event, endpoint: string): string {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  return new URL(endpoint, getRequestURL(event).origin).toString();
}

export async function getAuthSession(event: H3Event): Promise<AuthSession | null> {
  const runtimeConfig = useRuntimeConfig();
  const endpoint = runtimeConfig.public.AUTH_SESSION_ENDPOINT || '/auth/session';
  const url = resolveSessionUrl(event, endpoint);
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
  if (session?.user) {
    return session;
  }

  throw createError({
    statusCode: 401,
    statusMessage: 'Authentication required',
  });
}
