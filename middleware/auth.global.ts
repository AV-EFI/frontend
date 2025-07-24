import { useAuth } from '../composables/useAuth';

export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path.startsWith('/protected')) {
        const auth = useAuth();
        await auth.fetchSession();
        if (!auth.isAuthenticated.value) {
            return navigateTo('/login');
        }
    }
});
