export default defineNuxtPlugin(() => {
    const userAuth = useCookie('auth:token');
    const config = useRuntimeConfig();

    const $apiFetch = $fetch.create({
        baseURL: config.public.apiUrl,
        onRequest({ options }) {
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
        onResponseError({ response }) {
            //console.log("apiFetch onResponseError");

            if (response.status === 401) {
                navigateTo('/login');
            }
            if (response.status === 500) {
                console.warn("Are you authenticated?");
            }
            return Promise.reject(response);
        }
    });
    // Expose to useNuxtApp().$apiFetch
    return {
        provide: {
            apiFetch: $apiFetch
        }
    };
});