// Defer non-critical CSS to improve initial render performance
export default defineNuxtPlugin((nuxtApp) => {
    if (import.meta.server) return;

    nuxtApp.hook('app:mounted', () => {
    // Allow critical render to complete first
        requestIdleCallback(() => {
            // Force load any deferred stylesheets
            const deferredStyles = document.querySelectorAll('link[rel="stylesheet"][media="print"]');
            deferredStyles.forEach((link) => {
                link.removeAttribute('media');
            });
        }, { timeout: 1000 });
    });
});
