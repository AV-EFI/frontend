import { ref, computed } from 'vue';

const data = ref(null);
const loading = ref(false);
const error = ref(null);

export function useAuth() {
    const config = useRuntimeConfig().public;

    const SESSION_ENDPOINT = config.AUTH_SESSION_ENDPOINT;
    const SIGNIN_ENDPOINT = config.AUTH_SIGNIN_ENDPOINT;
    const SIGNOUT_ENDPOINT = config.AUTH_SIGNOUT_ENDPOINT;

    async function getSession() {
        loading.value = true;
        error.value = null;

        try {
            const res = await $fetch(SESSION_ENDPOINT);
            data.value = res.user || null;
        } catch (e) {
            data.value = null;
            error.value = e;
        } finally {
            loading.value = false;
        }
    }

    function signIn() {
        window.location.href = SIGNIN_ENDPOINT;
    }

    function signOut() {
        return $fetch(SIGNOUT_ENDPOINT).then(() => {
            data.value = null;
        });
    }

    const isAuthenticated = computed(() => !!data.value);

    return {
        data,
        loading,
        error,
        isAuthenticated,
        getSession,
        signIn,
        signOut,
    };
}
