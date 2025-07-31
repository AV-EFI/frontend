// nuxt.config.ts

// 📝 Explanation:
// Nuxt dev server must listen on 0.0.0.0 so it's reachable via host.docker.internal inside Docker.
// Assets and routing must stay aligned for Traefik + Nuxt dev.
import eslint from 'vite-plugin-eslint';;

export default defineNuxtConfig({
    compatibilityDate: '2025-07-31',
    app: {
        baseURL: '/',
    },
    devtools: {
        enabled: true,
        vscode: false, // disable VS Code integration
        timeline: false, // disable full timeline tracking
        components: false, // no component inspector
        performance: true, // no performance tracking
        hmr: true        // ✅ keep only HMR event logging

    },
    nitro: {
        preset: 'node-server',
        compressPublicAssets: true,
        experimental: { tasks: true },
        scheduledTasks: process.env.NODE_ENV === 'production'
            ? { '0 */12 * * *': 'wmi_mapping_refresh' }
            : {}, // disable during local dev
    },
    build: {
        transpile: ['vue-diff']
    },
    modules: [
    //'@sidebase/nuxt-auth',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        ...(process.env.NODE_ENV === 'production' ? ['@nuxtjs/robots', 'nuxt3-winston-log'] : []),
        //'@nuxtjs/eslint-module',
        '@nuxtjs/i18n',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
        '@formkit/nuxt',
        '@nuxt/icon',
        '@vueuse/nuxt',
        '@nuxtjs/robots',
        'nuxt3-winston-log',
        '@dargmuesli/nuxt-cookie-control',
        'nuxt-mail',
    ],
    extends: './pages',
    imports: {
        dirs: ['~/stores', '~/plugins'] // keine Wildcards
    },
    icon: {
        collections: ['mdi', 'material-symbols']
    },
    components: {
        global: true,
        dirs: ['~/components']
    },
    runtimeConfig: {
        public: {
            ENV_LABEL: process.env.NUXT_PUBLIC_ENV_LABEL || 'Development',
            origin: process.env.ORIGIN,
            frontendUrl: process.env.ORIGIN,
            ELASTIC_HOST_PUBLIC: process.env.ELASTIC_HOST_PUBLIC,
            ELASTIC_HOST_INTERNAL: process.env.ELASTIC_HOST_INTERNAL,
            ELASTIC_APIKEY: process.env.ELASTIC_APIKEY,
            ELASTIC_INDEX: process.env.ELASTIC_INDEX,
            ELASTIC_INDEX_DETAIL: process.env.ELASTIC_INDEX_DETAIL,
            ELASTIC_INDEX_MAPPING: process.env.ELASTIC_INDEX_MAPPING,
            AVEFI_ELASTIC_API: process.env.AVEFI_ELASTIC_API || '/api/elastic',
            AVEFI_ELASTIC_API_SEARCH_ENDPOINT: process.env.AVEFI_ELASTIC_API_SEARCH_ENDPOINT || 'msearch',

            AVEFI_SEARCH_API: process.env.AVEFI_SEARCH_API,
            AVEFI_SEARCH: process.env.AVEFI_SEARCH,
            AVEFI_BACKEND_URL: process.env.AVEFI_BACKEND_URL,
            AVEFI_GET_WORK: process.env.AVEFI_GET_WORK,
            AVEFI_GET_MANIFEST: process.env.AVEFI_GET_MANIFEST,
            AVEFI_GET_MANIFEST_BY_WORK: process.env.AVEFI_GET_MANIFEST_BY_WORK,
            AVEFI_ELASTIC_INTERNAL: process.env.AVEFI_ELASTIC_INTERNAL,
            AVEFI_GET_ITEM_BY_MANIFEST: process.env.AVEFI_GET_ITEM_BY_MANIFEST,
            AVEFI_SEARCH_URL: process.env.AVEFI_SEARCH_URL,
            SEARCH_INIT_URL_PARAMS: process.env.SEARCH_INIT_URL_PARAMS,
            KEYCLOAK_URL: process.env.KEYCLOAK_URL,
            KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
            KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
            WMI_CACHE_KEY: 'WMI_CACHE_KEY',
            // AUTH endpoints
            AUTH_BASE_URL: process.env.AUTH_BASE_URL || '/auth',
            AUTH_SESSION_ENDPOINT: process.env.AUTH_SESSION_ENDPOINT || '/auth/session',
            AUTH_SIGNIN_ENDPOINT: process.env.AUTH_SIGNIN_ENDPOINT || '/auth/signin/keycloak',
            AUTH_SIGNOUT_ENDPOINT: process.env.AUTH_SIGNOUT_ENDPOINT || '/auth/signout',
            AUTH_CSRF_ENDPOINT: process.env.AUTH_CSRF_ENDPOINT || '/auth/csrf',
            AUTH_CALLBACK_ENDPOINT: process.env.AUTH_CALLBACK_ENDPOINT || '/auth/academiccloud/auth',
        },
        private: {
            NUXT_SECRET: process.env.NUXT_SECRET,
            ELASTIC_HOST_PUBLIC: process.env.ELASTIC_HOST_PUBLIC,
            ELASTIC_HOST_INTERNAL: process.env.ELASTIC_HOST_INTERNAL,
        }
    },
    routeRules: {
        "/": { ssr: false },
        "/search": { ssr: false },
        "/contact": { prerender: true },
        "/login": { ssr: false },
        "/film/**": { ssr: false },
        "/serial/**": { ssr: false },
        "/protected/institutionlist": { ssr: false },
        "/protected/dashboard": { ssr: false },
        "/protected/mergetool": { ssr: false },
    //"/api/*": { cache: { maxAge: 60 * 60 } },
    },
    css: [
        "~/assets/scss/main.scss"
    ],
    mail: {
        message: {
            to: ['stefan.stretz@tib.eu', 'contact@av-efi.net'],
        },
        smtp: {
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        },
    },
    nuxt3WinstonLog: {
        maxSize: "2048m",
        maxFiles: "14d",
    },
    cookieControl: {
        locales: ['de', 'en'],
        colors: false,
        text: {
            barTitle: 'Cookies',
            barDescription: 'We use our own cookies and third-party cookies...',
            acceptAll: 'Accept all',
            declineAll: 'Delete all',
            manageCookies: 'Manage cookies',
            unsaved: 'You have unsaved settings',
            close: 'Close',
            save: 'Save',
            necessary: 'Necessary cookies',
            optional: 'Optional cookies',
            functional: 'Functional cookies',
            blockedIframe: 'To see this, please enable functional cookies',
            here: 'here'
        },
        cookies: {
            necessary: [
                {
                    name: { en: 'Default Cookies', de: 'Standard Cookies' },
                    description: {
                        en: 'Used for Cookies, Search, Favourites and Authentication.',
                        de: 'Wird für Cookies, Suche, Favoriten und Authentifizierung verwendet.'
                    },
                    cookies: ['cookie_control_consent', 'cookie_control_enabled_cookies']
                }
            ],
            optional: [
                {
                    name: { en: 'Optionale Cookies', de: 'Optional Cookies' },
                    identifier: 'ga',
                    description: { en: 'None yet', de: 'Noch keine' }
                }
            ]
        }
    },
    devServer: {
        host: '0.0.0.0',
        port: 3000
    },
    vite: {
        server: {
            watch: {
                usePolling: true, // force polling for stability
                interval: 100,
                ignored: [
                    '**/node_modules/**',
                    '**/.git/**',
                    '**/.yarn/**',
                    '**/.output/**',
                    '**/.nuxt/**',
                    '**/dist/**',
                ],
            },
        },
        build: {
            chunkSizeWarningLimit: 750,
            target: 'esnext'
        },
        optimizeDeps: {
            exclude: ['vue-diff']
        },
        //devBundler: 'legacy',
        logLevel: 'error',
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern',
                    additionalData: '@use "~/assets/scss/_colors.scss" as *;'
                },
            },
        },
        plugins: [
      eslint({
        failOnWarning: false,
        failOnError: false,
        formatter: process.env.NODE_ENV === 'production' ? 'compact' : 'stylish',
        cache: false,
        include: [
          'components/**/*.{js,ts,vue}',
          'pages/**/*.{js,ts,vue}'
        ],
        exclude: ['node_modules'],
        lintOnStart: false, // ✅ runs only once at dev start
        emitWarning: false,
      }),
    ],
    },
    typescript: {
        includeWorkspace: true
    },
    i18n: {
        strategy: 'no_prefix',
        locales: ['de', 'en'],
        defaultLocale: 'de',
        lazy: true,
        skipSettingLocaleOnNavigate: true,
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            alwaysRedirect: false,
            fallbackLocale: 'de'
        },
        bundle: {
            optimizeTranslationDirective: false,
        },
        vueI18n: "../i18n.config.ts"
    },
    formkit: {
        autoImport: false // Performance-Optimization: Disable auto-import to reduce bundle size
    },
    pinia: {
        storesDirs: ['stores']
    },
    colorMode: {
        preference: 'avefi_light',
        classSuffix: '',
        dataValue: 'theme',
        disableTransition: false,
        storageKey: 'avefi-color-mode'
    },
    tailwindcss: {
        exposeConfig: true,
        viewer: false
    },
});
