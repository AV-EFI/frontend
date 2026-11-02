export default defineNuxtRouteMiddleware(async (to) => {
  const runtimeConfig = useRuntimeConfig();
  const isAdminRoute = to.path.startsWith('/admin');
  const requiresAuth = to.path.startsWith('/protected') || isAdminRoute;
  const allowDevBypass = runtimeConfig.public.authGuardBypassInDev && !isAdminRoute;

  if (!requiresAuth || allowDevBypass) {
    return;
  }

  // The server cannot tell an expired access token from a missing login, and renewing it needs the
  // browser's refresh token flow; so the check happens on the client, before the page is shown.
  if (import.meta.server) {
    return;
  }

  const auth = useAuth();
  if (auth.data.value?.user) {
    return;
  }

  await auth.recoverSession();
  if (!auth.data.value?.user) {
    // eslint-disable-next-line consistent-return
    return navigateTo('/');
  }
});
