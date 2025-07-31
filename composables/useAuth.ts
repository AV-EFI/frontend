import { ref, computed } from 'vue';

const data = ref<any>(null);
const loading = ref(false);
const error = ref(null);
let sessionInterval: ReturnType<typeof setInterval> | null = null;

export function useAuth() {
  const config = useRuntimeConfig().public;
  const { $router } = useNuxtApp(); // ✅ nur hier initialisieren
  const SESSION_ENDPOINT = config.AUTH_SESSION_ENDPOINT;
  const SIGNIN_ENDPOINT = config.AUTH_SIGNIN_ENDPOINT;
  const SIGNOUT_ENDPOINT = config.AUTH_SIGNOUT_ENDPOINT;

  async function getSession() {
    loading.value = true;
    error.value = null;
    try {
      const res = await $fetch(SESSION_ENDPOINT, { credentials: 'include' });
      data.value = res || null;
      localStorage.setItem('auth_session', JSON.stringify(data.value));
    } catch (e) {
      data.value = null;
      error.value = e;
      localStorage.removeItem('auth_session');
    } finally {
      loading.value = false;
    }
  }

  function startSessionPolling() {
    stopSessionPolling();
    getSession();
    const timeout = data.value?.timeout || 300;
    sessionInterval = setInterval(getSession, (timeout - 30) * 1000);
  }

  function stopSessionPolling() {
    if (sessionInterval) {
      clearInterval(sessionInterval);
      sessionInterval = null;
    }
  }

  function signIn() {
    window.location.href = SIGNIN_ENDPOINT;
  }

  async function signOut() {
    try {
      await $fetch(SIGNOUT_ENDPOINT, { credentials: 'include' });
    } finally {
      data.value = null;
      localStorage.removeItem('auth_session');

      if (import.meta.client) {
        localStorage.setItem('auth_logout', Date.now().toString());
        localStorage.removeItem('auth_logout');
      }

      stopSessionPolling();
      $router.push('/');
    }
  }

  const isAuthenticated = computed(() => !!data.value?.user);

  if (import.meta.client) {
    window.addEventListener('storage', (event) => {
      if (event.key === 'auth_session' && event.newValue) {
        try {
          data.value = JSON.parse(event.newValue);
        } catch {
          data.value = null;
        }
      }

      if (event.key === 'auth_logout') {
        data.value = null;
        stopSessionPolling();
        $router.push('/');
      }
    });

    const saved = localStorage.getItem('auth_session');
    if (saved) {
      try {
        data.value = JSON.parse(saved);
      } catch {
        data.value = null;
      }
    }
  }

  return {
    data,
    loading,
    error,
    isAuthenticated,
    getSession,
    startSessionPolling,
    stopSessionPolling,
    signIn,
    signOut,
  };
}
