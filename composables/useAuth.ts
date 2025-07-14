import { ref, computed } from 'vue';

const data = ref(null);
const loading = ref(false);
const error = ref(null);

async function fetchSession() {
    loading.value = true;
    error.value = null;
    try {
        const res = await $fetch('/api/session');
        data.value = res.user || null;
    } catch (e) {
        data.value = null;
        error.value = e;
    } finally {
        loading.value = false;
    }
}

function signOut() {
    return $fetch('/api/logout', { method: 'POST' }).then(() => {
        data.value = null;
    });
}

function signIn() {
    window.location.href = '/api/login'; // redirect to backend login
}

const isAuthenticated = computed(() => !!data.value);

export function useAuth() {
    return {
        data,
        loading,
        error,
        isAuthenticated,
        fetchSession,
        signOut,
        signIn,
    };
}
