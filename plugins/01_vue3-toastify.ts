let toastInstance: typeof import('vue3-toastify').toast | null = null;
let installPromise: Promise<typeof import('vue3-toastify').toast> | null = null;

const createDeferredToast = (loader: () => Promise<typeof import('vue3-toastify').toast>) => {
    const call = (fn: (toast: typeof import('vue3-toastify').toast) => unknown) => loader().then(fn).catch((error) => {
        console.error('[toastify] Failed to load toast', error);
    });

    const deferred: any = (...args: Parameters<typeof import('vue3-toastify').toast>) => {
        if (toastInstance) {
            return toastInstance(...args);
        }
        return loader().then((toast) => toast(...args));
    };

    const methods: Array<keyof typeof import('vue3-toastify').toast> = [
        'success',
        'info',
        'error',
        'warn',
        'loading',
        'promise',
        'dismiss',
        'update',
    ];

    methods.forEach((method) => {
        deferred[method] = (...args: Parameters<typeof import('vue3-toastify').toast[typeof method]>) => {
            if (toastInstance) {
                return (toastInstance as any)[method](...args);
            }
            return loader().then((toast) => (toast as any)[method](...args));
        };
    });

    deferred.clearAllToasts = () => call((toast) => toast.clearAllToasts?.());

    return deferred;
};

export default defineNuxtPlugin((nuxtApp) => {
    const loadToast = async () => {
        if (import.meta.server) {
            throw new Error('vue3-toastify is only available in the browser');
        }

        if (toastInstance) {
            return toastInstance;
        }

        if (!installPromise) {
            installPromise = (async () => {
                const [toastModule] = await Promise.all([
                    import('vue3-toastify'),
                    import('vue3-toastify/dist/index.css'),
                ]);
                const { default: Vue3Toastify, toast } = toastModule;
                nuxtApp.vueApp.use(Vue3Toastify, { autoClose: 3000, position: 'top-center' });
                toastInstance = toast;
                return toastInstance;
            })().catch((error) => {
                installPromise = null;
                throw error;
            });
        }

        return installPromise;
    };

    const toast = createDeferredToast(loadToast);

    return {
        provide: {
            toast,
            loadToast,
        },
    };
});
