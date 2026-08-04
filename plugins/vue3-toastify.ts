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

type ToastFn = typeof import('vue3-toastify').toast;
type DeferredMethod = 'success' | 'info' | 'error' | 'warn' | 'loading' | 'promise' | 'remove' | 'update';
type DeferredToast = ToastFn & { clearAllToasts: () => void };

const createDeferredToast = (loader: () => Promise<ToastFn>): DeferredToast => {
  const call = (fn: (toast: ToastFn) => unknown) => loader().then(fn).catch((error) => {
    console.error('[toastify] Failed to load toast', error);
  });

  const deferred = ((...args: Parameters<ToastFn>) => {
    const themedArgs = withResolvedTheme(args as unknown[]);

    if (toastInstance) {
      return toastInstance(...(themedArgs as Parameters<ToastFn>));
    }
    return loader().then((toast) => toast(...(themedArgs as Parameters<ToastFn>)));
  }) as DeferredToast;

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

  type MethodFn = (...args: unknown[]) => unknown;
  // Dynamically monkey-patching methods onto the callable `deferred` target: treated
  // as a plain string-indexed record for this assignment since a union-of-methods key
  // isn't assignable against ToastFn's intersection of overloaded call signatures.
  const deferredMethods = deferred as unknown as Record<DeferredMethod, MethodFn>;

  methods.forEach((method) => {
    deferredMethods[method] = (...args: unknown[]) => {
      const themedArgs = withResolvedTheme(args);

      if (toastInstance) {
        return (toastInstance[method] as MethodFn)(...themedArgs);
      }
      return loader().then((toast) => (toast[method] as MethodFn)(...themedArgs));
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
