export default defineNuxtRouteMiddleware(async (to) => {
  const runtimeConfig = useRuntimeConfig();
  const isAdminRoute = to.path.startsWith('/admin');
  const requiresAuth = to.path.startsWith('/protected') || isAdminRoute;
  const allowDevBypass = runtimeConfig.public.authGuardBypassInDev && !isAdminRoute;

  if (!requiresAuth || allowDevBypass) {
    return;
  }

  if (import.meta.server) {
    try {
      const sessionEndpoint = runtimeConfig.public.AUTH_SESSION_ENDPOINT;
      const sessionUrl = sessionEndpoint.startsWith('http')
        ? sessionEndpoint
        : new URL(sessionEndpoint, useRequestURL().origin).toString();
      const session = await $fetch(
        sessionUrl,
        {
          headers: useRequestHeaders(['cookie']),
        },
      ) as { user?: Record<string, unknown> | null };

      if (session?.user) {
        return;
      }
    } catch {
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
