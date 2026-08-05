type PluginApiFetch = <T = unknown>(request: string, options?: Record<string, unknown>) => Promise<T>;
type RequestContext = { options: { headers?: Headers } };
type ResponseContext = { response: { status: number } };

export default defineNuxtPlugin((): { provide: { apiFetch: PluginApiFetch } } => {
  const userAuth = useCookie('auth:token');
  const config = useRuntimeConfig();
  const baseURL = config.public.apiUrl || '/api';

  const $apiFetch = $fetch.create({
    baseURL,
    onRequest({ options }: RequestContext) {
      const headers = new Headers();
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');

      if (userAuth.value) {
        headers.set('Authorization', `Bearer ${userAuth.value}`);
      } else {
        console.warn("No Authorization Cookie");
      }
      options.headers = headers;
    },
    onResponseError({ response }: ResponseContext) {
      //console.log("apiFetch onResponseError");

      if (response.status === 401) {
        navigateTo('/login');
      }
      if (response.status === 500) {
        console.warn("Are you authenticated?");
      }
      return Promise.reject(response);
    }
  }) as PluginApiFetch;
    // Expose to useNuxtApp().$apiFetch
  return {
    provide: {
      apiFetch: $apiFetch
    }
  };
});
