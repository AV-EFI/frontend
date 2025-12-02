/**
 * Redirect middleware for legacy /search_altern URLs
 * Redirects to /search while preserving query parameters and path
 */
export default defineNuxtRouteMiddleware((to) => {
    // Check if the path starts with /search_altern
    if (to.path.startsWith('/search_altern')) {
    // Replace /search_altern with /search in the path
        const newPath = to.path.replace(/^\/search_altern/, '/search');
    
        // Preserve query parameters
        return navigateTo({
            path: newPath,
            query: to.query,
            hash: to.hash
        }, {
            redirectCode: 301 // Permanent redirect
        });
    }
});
