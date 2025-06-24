// This runs only in the browser and avoids recursion issues
export default defineNuxtRouteMiddleware(() => {
    const { status, signOut } = useAuth();
  
    watchEffect(() => {
      if (status.value === 'unauthenticated') {
        // Redirect to homepage (or login page, if preferred)
        signOut({ callbackUrl: '/' });
      }
    });
  });
  