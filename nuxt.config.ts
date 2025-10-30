// nuxt.config.ts

import { getTrailingCommentRanges } from "typescript";
import tailwindcss from '@tailwindcss/vite';
// 📝 Explanation:
// Nuxt dev server must listen on 0.0.0.0 so it's reachable via host.docker.internal inside Docker.
// Assets and routing must stay aligned for Traefik + Nuxt dev.

export default defineNuxtConfig({
    compatibilityDate: '2025-07-31',
    ssr: false,
    app: {
        baseURL: '/',
        pageTransition: false
    },
    devtools: {
           enabled: false
    },
    nitro: {
        preset: 'node-server',
        compressPublicAssets: true,
        serverAssets: [
            { baseName: 'glossary', dir: 'assets/glossary' }
        ],
        debug: process.env.NUXT_DEBUG === 'true', // Server Stacktraces
    },
    modules: [
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        //...(process.env.NODE_ENV === 'production' ? ['@nuxtjs/robots', 'nuxt3-winston-log'] : []),
        '@nuxtjs/i18n',
        //'@nuxtjs/tailwindcss',
        //'@nuxtjs/color-mode',
        '@formkit/nuxt',
        '@nuxt/icon',
        '@vueuse/nuxt',
        //'@nuxtjs/robots',
        'nuxt3-winston-log',
        '@dargmuesli/nuxt-cookie-control',
        'nuxt-nodemailer'
    ],
    extends: './pages',
    imports: {
        dirs: ['~/stores', '~/plugins'] // keine Wildcards
    },
    icon: {
        collections: ['tabler', 'carbon']
    },
    components: {
        global: true,
        dirs: ['~/components']
    },
    runtimeConfig: {
        public: {
            ENV_LABEL: process.env.NUXT_PUBLIC_ENV_LABEL,
            origin: process.env.ORIGIN,
            frontendUrl: process.env.ORIGIN,
            ELASTIC_HOST_PUBLIC: process.env.ELASTIC_HOST_PUBLIC,
            ELASTIC_HOST_INTERNAL: process.env.ELASTIC_HOST_INTERNAL,
            ELASTIC_APIKEY: process.env.ELASTIC_APIKEY,
            ELASTIC_INDEX: process.env.ELASTIC_INDEX,
            ELASTIC_INDEX_DETAIL: process.env.ELASTIC_INDEX_DETAIL,
            ELASTIC_INDEX_MAPPING: process.env.ELASTIC_INDEX_MAPPING,
            AVEFI_ELASTIC_API: process.env.AVEFI_ELASTIC_API,
            AVEFI_ELASTIC_API_SEARCH_ENDPOINT: process.env.AVEFI_ELASTIC_API_SEARCH_ENDPOINT,
            MAIL_USER: process.env.MAIL_USER,
            MAIL_FROM: process.env.MAIL_FROM,
            MAIL_TO: process.env.MAIL_TO,
            MAIL_TO_2: process.env.MAIL_TO_2,

            AVEFI_SEARCH_API: process.env.AVEFI_SEARCH_API,
            AVEFI_SEARCH: process.env.AVEFI_SEARCH,
            AVEFI_BACKEND_URL: process.env.AVEFI_BACKEND_URL,
            AVEFI_GET_WORK: process.env.AVEFI_GET_WORK,
            AVEFI_GET_MANIFEST: process.env.AVEFI_GET_MANIFEST,
            AVEFI_GET_MANIFEST_BY_WORK: process.env.AVEFI_GET_MANIFEST_BY_WORK,
            AVEFI_ELASTIC_INTERNAL: process.env.AVEFI_ELASTIC_INTERNAL,
            AVEFI_GET_ITEM_BY_MANIFEST: process.env.AVEFI_GET_ITEM_BY_MANIFEST,
            AVEFI_SEARCH_URL: process.env.AVEFI_SEARCH_URL,
            SEARCH_URL: process.env.SEARCH_URL,
            SEARCH_INIT_URL_PARAMS: process.env.SEARCH_INIT_URL_PARAMS,
            KEYCLOAK_URL: process.env.KEYCLOAK_URL,
            KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
            KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
            WMI_CACHE_KEY: 'WMI_CACHE_KEY',
            KIBANA_DATA_VIEW_ID: process.env.KIBANA_DATA_VIEW_ID,
            AVEFI_COPY_PID_URL: process.env.AVEFI_COPY_PID_URL,

            // AUTH endpoints
            AUTH_BASE_URL: process.env.AUTH_BASE_URL || '/auth',
            AUTH_SESSION_ENDPOINT: process.env.AUTH_SESSION_ENDPOINT || '/auth/session',
            AUTH_SIGNIN_ENDPOINT: process.env.AUTH_SIGNIN_ENDPOINT || '/auth/signin/keycloak',
            AUTH_SIGNOUT_ENDPOINT: process.env.AUTH_SIGNOUT_ENDPOINT || '/auth/signout',
            AUTH_CSRF_ENDPOINT: process.env.AUTH_CSRF_ENDPOINT || '/auth/csrf',
            AUTH_CALLBACK_ENDPOINT: process.env.AUTH_CALLBACK_ENDPOINT || '/auth/academiccloud/auth',

            cms: {
                // mirror the flag to the client to toggle UI affordances
                allowUserTooltipEdits:
                process.env.CMS_ALLOW_USERTOOLTIP_EDITS === 'true' ||
                process.env.NODE_ENV === 'production',
            }
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
        "/search_altern": { ssr: false },
        //"/contact": { prerender: true },
        "/contact": { ssr: false }, 
        "/login": { ssr: false },
        "/film/**": {ssr:false},
        "/serial/**": {ssr:false},
        "/protected/institutionlist": {ssr:false},
        "/protected/dashboard": {ssr:false},
        "/protected/mergetool": {ssr:false},
        "/normdata": {ssr:false},
        "/protected/normdata": {ssr:false},
        // Cached for 1 hour
        //"/api/*": { cache: { maxAge: 60 * 60 } },
    },
    nodemailer: {
        from: process.env.MAIL_USER,
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: { 
            user: process.env.MAIL_USER, 
            pass: process.env.MAIL_PASSWORD 
        },
    },
    nuxt3WinstonLog: {
        maxSize: "2048m",
        maxFiles: "14d",
    },
    cookieControl: {
        locales: ['de', 'en'],
        colors: false,
        localeTexts: {
            en: {
                bannerTitle: 'This website uses cookies',
                accept: 'Accept all',
                decline: 'Decline all',
                bannerDescription: 'We use our own cookies and third-party cookies to enhance your experience on our website. By clicking "Accept all", you consent to the use of ALL cookies. However, you may visit "Manage cookies" to provide a controlled consent.',
                cookiesFunctional: 'Functional cookies',
                cookiesNecessary: 'Necessary cookies',
                cookiesOptional: 'Optional cookies',
                iframeBlocked: 'To see this, please enable functional cookies',
                settingsUnsaved: 'You have unsaved settings',
            },
            de: {
                bannerTitle: 'Diese Website verwendet Cookies',
                accept: 'Akzeptieren',
                decline: 'Alle ablehnen',
                bannerDescription: 'Wir verwenden eigene Cookies und Cookies von Drittanbietern, um Ihre Erfahrung auf unserer Website zu verbessern. Durch Klicken auf "Akzeptieren" stimmen Sie der Verwendung ALLER Cookies zu. Sie können jedoch unter "Cookies verwalten" eine kontrollierte Zustimmung erteilen.',
                cookiesFunctional: 'Funktionale Cookies',
                cookiesNecessary: 'Notwendige Cookies',
                cookiesOptional: 'Optionale Cookies',
                iframeBlocked: 'Um dies zu sehen, aktivieren Sie bitte funktionale Cookies',
                settingsUnsaved: 'Sie haben ungespeicherte Einstellungen',
            }
        },
        cookies: {
            necessary: [
                {
                    id: 'default',
                    name: { en: 'Default Cookies', de: 'Standard Cookies' },
                    description: {
                        en: 'Used for Cookies, Search, Favourites and Authentication.',
                        de: 'Wird für Cookies, Suche, Favoriten und Authentifizierung verwendet.'
                    },
                    targetCookieIds : ['cookie_control_consent', 'cookie_control_enabled_cookies']
                }
            ],
            optional: [
                {
                    id: 'ga',
                    name: { en: 'Optionale Cookies', de: 'Optional Cookies' },
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
        plugins: [
            tailwindcss()
        ],
        optimizeDeps: {
        include: ['export-to-csv', 'instantsearch.js', 'algoliasearch']       
    },
      server: {
        watch: {
        usePolling: true,
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
    build: { chunkSizeWarningLimit: 750, target: 'esnext' },
    logLevel: 'error',
    },
    typescript: {
        includeWorkspace: true
    },
    i18n: {
        debug: true,
        strategy: 'no_prefix',
        defaultLocale: 'de',
        vueI18n: './i18n.config.ts'
    },
    formkit: {
        autoImport: false // Performance-Optimization: Disable auto-import to reduce bundle size
    },
    pinia: {
        storesDirs: ['stores']
    },
    css: ['~/assets/scss/main.scss'],
    postcss: {
        plugins: {
            "@tailwindcss/postcss": {},   // ✅ v4 plugin
            autoprefixer: {},
        },
    },
});
