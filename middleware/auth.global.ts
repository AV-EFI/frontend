import { AUTH_ENDPOINTS } from '~/utils/auth/endpoints';
import { isSessionAuthenticatedForGuard } from '~/utils/auth/session';
import type { SessionInfo } from '~/utils/auth/types';

export default defineNuxtRouteMiddleware(async (to) => {
  const runtimeConfig = useRuntimeConfig();
  const isAdminRoute = to.path.startsWith('/admin');
  const requiresAuth = to.path.startsWith('/protected') || isAdminRoute;
  const allowDevBypass = runtimeConfig.public.authGuardBypassInDev && !isAdminRoute;

  if (!requiresAuth || allowDevBypass) {
    return;
  }

  if (import.meta.server) {
    const sessionUrl = new URL(AUTH_ENDPOINTS.session, useRequestURL().origin).toString();
    const isAuthenticated = await isSessionAuthenticatedForGuard(
      async () => await $fetch(sessionUrl, { headers: useRequestHeaders(['cookie']) }) as SessionInfo,
    );

    if (isAuthenticated) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return navigateTo('/');
  }

  const auth = useAuth();
  if (auth.data.value?.user) {
    return;
  }

  await auth.getSession();
  if (!auth.data.value?.user) {
    // eslint-disable-next-line consistent-return
    return navigateTo('/');
  }
});
