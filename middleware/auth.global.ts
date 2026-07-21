export default defineNuxtRouteMiddleware(async (to) => {
  const runtimeConfig = useRuntimeConfig();
  const isAdminRoute = to.path.startsWith('/admin');
  const requiresAuth = to.path.startsWith('/protected') || isAdminRoute;
  const allowDevBypass = runtimeConfig.public.authGuardBypassInDev && !isAdminRoute;

  if (!requiresAuth || allowDevBypass) {
    return;
  }

  if (import.meta.server) {
    return;
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
