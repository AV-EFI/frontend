type ClientErrorPayload = {
    type: string;
    message: string;
    stack?: string;
    info?: string;
    source?: string;
    line?: number;
    column?: number;
};

const serializeError = (err: unknown): { message: string; stack?: string } => {
    if (err instanceof Error) {
        return { message: err.message, stack: err.stack };
    }
    if (typeof err === 'string') {
        return { message: err };
    }
    try {
        return { message: JSON.stringify(err) };
    } catch {
        return { message: String(err) };
    }
};

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();
    const endpoint = runtimeConfig.public?.CLIENT_ERROR_ENDPOINT || '/api/log/client';

    const reportClientError = (payload: ClientErrorPayload) => {
        if (!process.client) return;
        try {
            const context = {
                url: typeof window !== 'undefined' ? window.location.href : undefined,
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
                timestamp: new Date().toISOString(),
            };
            const data = JSON.stringify({ ...context, ...payload });
            if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
                const blob = new Blob([data], { type: 'application/json' });
                navigator.sendBeacon(endpoint, blob);
            } else if (typeof fetch === 'function') {
                void fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: data,
                    keepalive: true,
                });
            }
        } catch (err) {
            console.debug('Failed to report client error', err);
        }
    };

    const pushErrorToServer = (type: string, error: unknown, extras: Record<string, unknown> = {}) => {
        if (!process.client) return;
        const { message, stack } = serializeError(error);
        reportClientError({ type, message, stack, ...extras });
    };

    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        console.error('Global error:', error);
        console.error('Error info:', info);

        pushErrorToServer('vue-error', error, { info });

        showError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: error instanceof Error ? error.message : String(error),
        });
    };

    if (process.client) {
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);

            pushErrorToServer('unhandledrejection', event.reason);

            showError({
                statusCode: 500,
                statusMessage: 'Internal Server Error',
                message: event.reason instanceof Error ? event.reason.message : String(event.reason),
            });
        });

        window.addEventListener('error', (event) => {
            const base = event.error ?? event.message ?? 'Unknown window error';
            pushErrorToServer('window-error', base, {
                source: event.filename,
                line: typeof event.lineno === 'number' ? event.lineno : undefined,
                column: typeof event.colno === 'number' ? event.colno : undefined,
            });
        });
    }
});
