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
        onResponse({ response }) {
            console.log("apiFetch Response");
            console.log(response);
        },
        onResponseError({ response }) {
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
    })
    // Expose to useNuxtApp().$apiFetch
    return {
        provide: {
            apiFetch: $apiFetch
        }
    };
});