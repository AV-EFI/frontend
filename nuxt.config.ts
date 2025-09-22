// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
        '@sidebase/nuxt-auth',
        //'@nuxtjs/eslint-module',
        '@nuxtjs/i18n',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        '@nuxt/content',
        '@formkit/nuxt',
        '@nuxt/icon',
        '@vueuse/nuxt',
        '@nuxtjs/robots',
        'nuxt3-winston-log',
        '@dargmuesli/nuxt-cookie-control',
        'nuxt-mail'
    ],
    extends: './pages',
    imports: {
        dirs: ['~/types/*.ts', '~/stores/*.ts', '~/plugins/*.ts']
    },
    components: {
        global: true,
        dirs: ['~/components']
    },
    runtimeConfig: {
        public: {
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
            AVEFI_GET_WORK: process.env.AVEFI_GET_WORK,
            AVEFI_GET_MANIFEST: process.env.AVEFI_GET_MANIFEST,
            AVEFI_GET_MANIFEST_BY_WORK: process.env.AVEFI_GET_MANIFEST_BY_WORK,
            AVEFI_GET_WORK_BY_IS_PART_OF: process.env.AVEFI_GET_WORK_BY_IS_PART_OF,
            AVEFI_DATA_API: process.env.AVEFI_DATA_API,
            SEARCH_URL: process.env.SEARCH_URL,
            SEARCH_INIT_URL_PARAMS: process.env.SEARCH_INIT_URL_PARAMS,
            KEYCLOAK_URL: process.env.KEYCLOAK_URL,
            KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
            KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
            WMI_CACHE_KEY: 'WMI_CACHE_KEY'
        },
        private: {
            NUXT_SECRET: process.env.NUXT_SECRET,
            ELASTIC_HOST_PUBLIC: process.env.ELASTIC_HOST_PUBLIC,
            ELASTIC_HOST_INTERNAL: process.env.ELASTIC_HOST_INTERNAL,
            KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
            KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
            KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
            KEYCLOAK_URL: process.env.KEYCLOAK_URL,
            GITHUB_TOKEN: process.env.GITHUB_TOKEN,
        }
    },
    //https://nuxt.com/docs/guide/concepts/rendering
    routeRules: {
        // Generated at build time for SEO purpose
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
    auth: {
        originEnvKey: process.env.AUTH_ORIGIN,
        baseURL: `${process.env.AUTH_ORIGIN}/api/auth`,
        provider: {
            type: 'authjs',
            defaultProvider: 'keycloak',
            addDefaultCallbackUrl: true,
        },        
        /*
        session: {
            enableRefreshOnWindowFocus: true,
            enableRefreshPeriodically: 10000
        },
        */
        globalAppMiddleware: {
            isEnabled: true,
            allow404WithoutAuth: true,            
        }
    },
    css: ["~/assets/scss/main.scss"],
    mail: {
        message: {
            to: ['stefan.stretz@tib.eu', 'contact@av-efi.net'],            
        },
        smtp: {
            service: 'gmail',
            auth: {
                user: "avefi.tmp@gmail.com",
                pass: "sbjk pjrx dkko fwan",
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
        //default texts
        text: {        
            barTitle: 'Cookies',
            barDescription: 'We use our own cookies and third-party cookies so that we can show you this website and better understand how you use it, with a view to improving the services we offer. If you continue browsing, we consider that you have accepted the cookies.',
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
                    //if multilanguage
                    name: {
                        en: 'Default Cookies',
                        de: 'Standard Cookies'
                    },
                    description: {
                        en:  'Used for Cookies, Search, Favourites and Authentication.',
                        de: 'Wird für Cookies, Suche, Favoriten und Authentifizierung verwendet.'
                    },
                    cookies: ['cookie_control_consent', 'cookie_control_enabled_cookies']
                }
            ],
            optional: [
                {
                    name:  {
                        en: 'Optionale Cookies',
                        de: 'Optional Cookies'
                    },
                    //if you don't set identifier, slugified name will be used
                    identifier: 'ga',
                    //if multilanguage
                    description: {
                        en:  'None yet',
                        de: 'Noch keine'
                    },
                    //else
                    //cf. https://gitlab.com/broj42/nuxt-cookie-control
                }
            ]
        }
    },
    vite: {
        build: {
            chunkSizeWarningLimit: 750
        },
        css: {
            preprocessorOptions: {                
                scss: {
                    api: 'modern',
                    additionalData: '@use "~/assets/scss/_colors.scss" as *;'                    
                },                
            },
        }
    },
    typescript: {
        includeWorkspace: true,
    },
    i18n: {
        strategy: 'no_prefix',
        lazy: true,
        locales: ["de", "en"],
        skipSettingLocaleOnNavigate: true,
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            alwaysRedirect: false,
            fallbackLocale: 'de'
        },
        vueI18n: './i18n.config.ts'
    },
    colorMode: {
        preference: 'avefi_light',
        classSuffix: '',
        dataValue: 'theme',
        disableTransition: false,
        storageKey: 'avefi-color-mode'
    },
    formkit: {
        // Experimental support for auto loading (see note):
        autoImport: true,
    },
    /*
    eslint: {
        lintOnStart: false,
        cache: true,
        emitWarning: false
    },
    */
    pinia: {
        storesDirs: ['stores']
    },
    tailwindcss: {
        exposeConfig: true,
        viewer: false,
    },
    compatibilityDate: '2025-07-02'
});