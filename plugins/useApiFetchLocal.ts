type PluginApiFetch = <T = unknown>(request: string, options?: Record<string, unknown>) => Promise<T>;
type RequestContext = { options: { headers?: Headers } };
type ResponseContext = { response: { status: number } };

export default defineNuxtPlugin((): { provide: { apiFetchLocal: PluginApiFetch } } => {
  const userAuth = useCookie('auth:token');
  const config = useRuntimeConfig();
  const baseURL = config.public.siteUrl || config.public.frontendUrl || '/';

  const apiFetchLocal = $fetch.create({
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
    onResponse({ response }: ResponseContext) {
      console.log("apiFetch Response");
      console.log(response);
    },
    onResponseError({ response }: ResponseContext) {
      console.log("apiFetch onResponseError");

      if (response.status === 401) {
        return navigateTo('/login');
      }
      //strapi returns 500 if not authenticated ??
      if (response.status === 500) {
        console.warn("Are you authenticated?");
      }
      return null;
    }
  }) as PluginApiFetch;
    // Expose to useNuxtApp().$apiFetch
  return {
    provide: {
      apiFetchLocal: apiFetchLocal
    }
  };
});
