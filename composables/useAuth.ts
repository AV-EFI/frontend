import { ref, computed } from 'vue';

const data = ref<any>(null);
const loading = ref(false);
const error = ref<unknown>(null);
let sessionInterval: ReturnType<typeof setInterval> | null = null;

export function useAuth() {
  const config = useRuntimeConfig().public;
  const { $router } = useNuxtApp();

  const SESSION_ENDPOINT = config.AUTH_SESSION_ENDPOINT;
  const SIGNIN_ENDPOINT = config.AUTH_SIGNIN_ENDPOINT;
  const SIGNOUT_ENDPOINT = config.AUTH_SIGNOUT_ENDPOINT;

  function log(...args: unknown[]) {
    console.log(`[useAuth ${new Date().toISOString()}]`, ...args);
  }

  async function getSession() {
    log('getSession called');
    loading.value = true;
    error.value = null;
    try {
      const res = await $fetch(SESSION_ENDPOINT, { credentials: 'include' });
      log('Session fetch successful', res);
      data.value = res || null;

      if (import.meta.client) {
        localStorage.setItem('auth_session', JSON.stringify(data.value));
      } else {
        log('⚠️ Tried to set localStorage in SSR');
      }
    } catch (e) {
      log('❌ Error fetching session', e);
      data.value = null;
      error.value = e;
      if (import.meta.client) {
        localStorage.removeItem('auth_session');
      }
    } finally {
      loading.value = false;
      log('getSession finished', { loading: loading.value, data: data.value });
    }
  }

  function startSessionPolling() {
    try {
      log('Starting session polling');
      stopSessionPolling();
      getSession();
      const timeout = data.value?.timeout || 300;
      sessionInterval = setInterval(getSession, (timeout - 30) * 1000);
      log(`Polling interval set to ${(timeout - 30)}s`);
    } catch (e) {
      log('❌ Error in startSessionPolling', e);
    }
  }

  function stopSessionPolling() {
    try {
      if (sessionInterval) {
        log('Stopping session polling');
        clearInterval(sessionInterval);
        sessionInterval = null;
      }
    } catch (e) {
      log('❌ Error in stopSessionPolling', e);
    }
  }

  function signIn() {
    try {
      log('Sign-in redirecting to', SIGNIN_ENDPOINT);
      if (import.meta.client) {
        window.location.href = SIGNIN_ENDPOINT;
      }
    } catch (e) {
      log('❌ Error in signIn', e);
    }
  }

  async function signOut() {
    log('Sign-out called');
    try {
      await $fetch(SIGNOUT_ENDPOINT, { credentials: 'include' });
      log('Sign-out request successful');
    } catch (e) {
      log('❌ Error during sign-out request', e);
    } finally {
      data.value = null;
      if (import.meta.client) {
        try {
          localStorage.removeItem('auth_session');
          localStorage.setItem('auth_logout', Date.now().toString());
          localStorage.removeItem('auth_logout');
        } catch (e) {
          log('⚠️ localStorage error during sign-out', e);
        }
      }
      stopSessionPolling();
      try {
        $router.push('/');
      } catch (e) {
        log('❌ Error navigating after sign-out', e);
      }
    }
  }

  const isAuthenticated = computed(() => !!data.value?.user);

  if (import.meta.client) {
    try {
      window.addEventListener('storage', (event) => {
        log('Storage event detected', event.key);
        try {
          if (event.key === 'auth_session' && event.newValue) {
            data.value = JSON.parse(event.newValue);
            log('Session updated from storage', data.value);
          }
        } catch (e) {
          log('❌ Error parsing auth_session from storage', e);
          data.value = null;
        }

        if (event.key === 'auth_logout') {
          data.value = null;
          stopSessionPolling();
          $router.push('/');
          log('User logged out via storage event');
        }
      });

      const saved = localStorage.getItem('auth_session');
      if (saved) {
        try {
          data.value = JSON.parse(saved);
          log('Restored session from localStorage', data.value);
        } catch (e) {
          log('❌ Error parsing saved session', e);
          data.value = null;
        }
      }
    } catch (e) {
      log('❌ Error setting up client storage handling', e);
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
