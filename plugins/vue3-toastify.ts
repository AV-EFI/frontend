let toastInstance: typeof import('vue3-toastify').toast | null = null;
let installPromise: Promise<typeof import('vue3-toastify').toast> | null = null;

const resolveToastTheme = (): 'light' | 'dark' => {
  if (import.meta.server) {
    return 'light';
  }

  const root = document.documentElement;
  const dataTheme = root.getAttribute('data-theme') ?? '';
  const isDarkDataTheme = dataTheme.toLowerCase().includes('dark');
  const isDarkClass = root.classList.contains('dark');
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

  return (isDarkDataTheme || isDarkClass || prefersDark) ? 'dark' : 'light';
};

const withResolvedTheme = (args: unknown[]): unknown[] => {
  if (!args.length) {
    return args;
  }

  const lastArg = args[args.length - 1];
  const canMergeIntoLastArg = typeof lastArg === 'object' && lastArg !== null && !Array.isArray(lastArg);

  if (canMergeIntoLastArg) {
    return [
      ...args.slice(0, -1),
      {
        ...(lastArg as Record<string, unknown>),
        theme: (lastArg as Record<string, unknown>).theme ?? resolveToastTheme(),
      },
    ];
  }

  return [...args, { theme: resolveToastTheme() }];
};

const createDeferredToast = (loader: () => Promise<typeof import('vue3-toastify').toast>) => {
  const call = (fn: (toast: typeof import('vue3-toastify').toast) => unknown) => loader().then(fn).catch((error) => {
    console.error('[toastify] Failed to load toast', error);
  });

  const deferred: any = (...args: Parameters<typeof import('vue3-toastify').toast>) => {
    const themedArgs = withResolvedTheme(args as unknown[]);

    if (toastInstance) {
      return toastInstance(...(themedArgs as Parameters<typeof import('vue3-toastify').toast>));
    }
    return loader().then((toast) => toast(...(themedArgs as Parameters<typeof import('vue3-toastify').toast>)));
  };

    type DeferredMethod = 'success' | 'info' | 'error' | 'warn' | 'loading' | 'promise' | 'remove' | 'update';

    const methods: DeferredMethod[] = [
      'success',
      'info',
      'error',
      'warn',
      'loading',
      'promise',
      'remove',
      'update',
    ];

    methods.forEach((method) => {
      deferred[method] = (...args: Parameters<typeof import('vue3-toastify').toast[DeferredMethod]>) => {
        const themedArgs = withResolvedTheme(args as unknown[]);

        if (toastInstance) {
          return (toastInstance as any)[method](...(themedArgs as unknown[]));
        }
        return loader().then((toast) => (toast as any)[method](...(themedArgs as unknown[])));
      };
    });

    deferred.clearAllToasts = () => call((toast) => toast.clearAll?.());

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
        nuxtApp.vueApp.use(Vue3Toastify, { autoClose: 3000, position: 'top-center', theme: 'auto' });
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
