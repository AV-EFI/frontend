export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        console.error('Global error:', error);
        console.error('Error info:', info);
        
        // Show the error page
        showError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: error instanceof Error ? error.message : String(error),
        });
    };

    // Handle promise rejections
    if (process.client) {
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            
            showError({
                statusCode: 500,
                statusMessage: 'Internal Server Error',
                message: event.reason instanceof Error ? event.reason.message : String(event.reason),
            });
        });
    }
});
