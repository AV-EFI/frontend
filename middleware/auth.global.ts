export default defineNuxtRouteMiddleware(async (to) => {
    // ✅ Run middleware only on client
    if (import.meta.server) return;

    if (to.path.startsWith('/protected')) {
        console.log('Protected route accessed:', to.path);
        const auth = useAuth();

        // If data is already available → allow access
        if (auth.data.value?.user) return;

        // Otherwise fetch it and wait
        await auth.getSession();

        // Redirect only if still no user
        if (!auth.data.value?.user) {
            navigateTo('/');
        }

        return; // ✅ Explicit return to satisfy ESLint
    }

    return; // ✅ All paths return something
});
