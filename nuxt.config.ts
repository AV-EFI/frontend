import { emit } from "process";

// https://nuxt.com/docs/api/configuration/nuxt-config
// nuxt.config.ts
// 📝 Explanation:
// Nuxt dev server must listen on 0.0.0.0 so it's reachable via host.docker.internal inside Docker.
// Assets and routing must stay aligned for Traefik + Nuxt dev.

export default defineNuxtConfig({
    compatibilityDate: '2025-07-27',
    app: {
        baseURL: '/',
        buildAssetsDir: '/_nuxt/', // important
    },
    devtools: {
        enabled: false
    },
    nitro: {
        preset: 'node-server',
        compressPublicAssets: true,
        experimental: {
            tasks: true,
        },
        scheduledTasks: {
            '0 */12 * * *': 'wmi_mapping_refresh', // Runs every 12 hours
        }
    },
    build: {
        transpile: ['vue-diff']
    },
    modules: [
        //'@sidebase/nuxt-auth',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        ...(process.env.NODE_ENV === 'production' ? ['@nuxtjs/robots', 'nuxt3-winston-log'] : []),
        '@nuxtjs/eslint-module',
        '@nuxtjs/i18n',
        '@nuxtjs/tailwindcss',
        //'@nuxtjs/color-mode',
        '@formkit/nuxt',
        '@nuxt/icon',
        '@vueuse/nuxt',
        '@nuxtjs/robots',
        'nuxt3-winston-log',
        '@dargmuesli/nuxt-cookie-control',
        'nuxt-mail'
        '@dargmuesli/nuxt-cookie-control'
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
            AUTH_BASE_URL: process.env.AUTH_BASE_URL || 'http://localhost:8000',
            dbHost: process.env.POSTGRES_HOST,
            dbDb: process.env.POSTGRES_DB,
            dbUser: process.env.POSTGRES_USER,
            dbPw: process.env.POSTGRES_PASSWORD,
            myEnvVariable: process.env.MY_ENV_VARIABLE,
            apiUrl: process.env.API_URL,
            authUrl: process.env.AUTH_URL,
            cmsUrl: process.env.CMS_URL,
            analyticsUrl: process.env.ANALYTICS_URL,
            origin: process.env.ORIGIN,
            frontendUrl: process.env.ORIGIN,
            ELASTIC_HOST_PUBLIC: process.env.ELASTIC_HOST_PUBLIC,
            ELASTIC_HOST_INTERNAL: process.env.ELASTIC_HOST_INTERNAL,
            ELASTIC_APIKEY: process.env.ELASTIC_APIKEY,
            ELASTIC_INDEX: process.env.ELASTIC_INDEX,
            ELASTIC_INDEX_DETAIL: process.env.ELASTIC_INDEX_DETAIL,
            ELASTIC_INDEX_MAPPING: process.env.ELASTIC_INDEX_MAPPING,
            AVEFI_ELASTIC_API: process.env.AVEFI_ELASTIC_API,
            AVEFI_SEARCH_API: process.env.AVEFI_SEARCH_API,
            AVEFI_SEARCH: process.env.AVEFI_SEARCH,
            AVEFI_BACKEND_URL: process.env.AVEFI_BACKEND_URL,
            AVEFI_GET_WORK: process.env.AVEFI_GET_WORK,
            AVEFI_GET_MANIFEST: process.env.AVEFI_GET_MANIFEST,
            AVEFI_GET_MANIFEST_BY_WORK: process.env.AVEFI_GET_MANIFEST_BY_WORK,
            AVEFI_ELASTIC_INTERNAL: process.env.AVEFI_ELASTIC_INTERNAL,
            AVEFI_GET_ITEM_BY_MANIFEST: process.env.AVEFI_GET_ITEM_BY_MANIFEST,
            AVEFI_SEARCH_URL: process.env.AVEFI_SEARCH_URL,
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
            WMI_CACHE_KEY: 'WMI_CACHE_KEY'
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
        "/film/**": {ssr:false},
        "/serial/**": {ssr:false},
        "/protected/institutionlist": {ssr:false},
        "/protected/dashboard": {ssr:false},
        "/protected/mergetool": {ssr:false},
        // Cached for 1 hour
        //"/api/*": { cache: { maxAge: 60 * 60 } },
    },
    /*
    auth: {
        originEnvKey: process.env.AUTH_ORIGIN,
        baseURL: process.env.AUTH_BASE_URL || 'http://localhost:8000', // Nur Backend-URL, NICHT mit /api/auth am Ende
        provider: {
          type: 'authjs',
          defaultProvider: 'keycloak',
          addDefaultCallbackUrl: true,
        },
        globalAppMiddleware: {
          isEnabled: true,
          allow404WithoutAuth: true,
        },
      },
      */
        "/film/**": { ssr: false },
        "/protected/institutionlist": { ssr: false },
        "/protected/dashboard": { ssr: false },
        "/protected/mergetool": { ssr: false },
    },
    css: ["~/assets/scss/main.scss"],
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
        build: {
          chunkSizeWarningLimit: 750
            chunkSizeWarningLimit: 750,
            target: 'esnext'
        },
        optimizeDeps: {
            exclude: ['vue-diff']
        },
        //devBundler: 'legacy',
        logLevel: 'warn',
        css: {
          preprocessorOptions: {                
            scss: {
              api: 'modern',
              additionalData: '@use "~/assets/scss/_colors.scss" as *;'                    
            },
          },
        },
        ...(process.env.NODE_ENV === 'development' && {
          server: {
            watch: {
              usePolling: true,
              interval: 100,
            },
            hmr: {
              port: 24678,
              host: 'localhost',
            },
          }
        })
      },      
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "~/assets/scss/_colors.scss" as *;'
                }
            }
        },
        logLevel: 'info',
        ...(process.env.NODE_ENV === 'development' && {
            server: {
                // This is needed for Vite HMR to work properly in Docker.
                // In local development, it can be commented out.
                /*
                watch: {
                    usePolling: true,
                    interval: 600
                },
                hmr: {
                    overlay: true,
                    port: 24678,
                    host: '0.0.0.0' // ← not localhost!
                },
                */
            }
        })
    },
    typescript: {
        includeWorkspace: true
    },
    i18n: {
        strategy: 'no_prefix',
        locales: ['de', 'en'],
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
    colorMode: {
        preference: 'avefi_light',
        classSuffix: '',
        dataValue: 'theme',
        storageKey: 'avefi-color-mode'
    },
    formkit: {
        autoImport: false // Performance-Optimization: Disable auto-import to reduce bundle size
    },
    eslint: {
        lintOnStart: false,
        cache: true,
        emitWarning: false,
        emitError: false,
        fix: true,
        emitWarning: false,
        emitError: false,
        fix: true
    },
    pinia: {
        storesDirs: ['stores']
    },
    tailwindcss: {
        exposeConfig: true,
        viewer: false
    },
    compatibilityDate: '2025-07-02'
});
