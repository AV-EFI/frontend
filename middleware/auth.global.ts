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
      const session = await $fetch<{ user?: Record<string, unknown> | null }>(
        runtimeConfig.public.AUTH_SESSION_ENDPOINT,
        {
          headers: useRequestHeaders(['cookie']),
        },
      );

      if (session?.user) {
        return;
      }
    } catch {
      // fall through to redirect
    }

    return navigateTo('/');
  }

  const auth = useAuth();
  if (auth.data.value?.user) {
    return;
  }

  await auth.getSession();
  if (!auth.data.value?.user) {
    return navigateTo('/');
  }
});
