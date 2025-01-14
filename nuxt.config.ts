// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { 
        enabled: false 
    },
    nitro: {
        preset: 'node-server'
    },
    build: {
        transpile: ['vue-diff']
    },
    modules: [
        '@sidebase/nuxt-auth',
        '@nuxtjs/eslint-module',
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
        'nuxt3-winston-log'
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
            AVEFI_ELASTIC_API: process.env.AVEFI_ELASTIC_API,
            AVEFI_DATA_API: process.env.AVEFI_DATA_API,
            SEARCH_URL: process.env.SEARCH_URL,
            SEARCH_INIT_URL_PARAMS: process.env.SEARCH_INIT_URL_PARAMS,
            KEYCLOAK_URL: process.env.KEYCLOAK_URL,
            KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
            KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
        },
        private: {
            NUXT_SECRET: process.env.NUXT_SECRET,
            ELASTIC_HOST_PUBLIC: process.env.ELASTIC_HOST_PUBLIC,
            ELASTIC_HOST_INTERNAL: process.env.ELASTIC_HOST_INTERNAL,
        }
    },
    //https://nuxt.com/docs/guide/concepts/rendering
    routeRules: {
        // Generated at build time for SEO purpose
        "/": { prerender: true },
        "/search": { ssr: false },
        "/contact": { prerender: true },
        "/login": { ssr: false },
        "/film/**": {ssr:false},
        "/protected/institutionlist": {ssr:false},
        "/protected/dashboard": {ssr:false},
        // Cached for 1 hour
        //"/api/*": { cache: { maxAge: 60 * 60 } },
    },
    auth: {
        //baseURL: process.env.KEYCLOAK_URL,
        baseURL: 'http://localhost:3000/api/auth',
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
    nuxt3WinstonLog: {
        maxSize: "2048m",
        maxFiles: "14d",
    },
    vite: {
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
        /* module options */
        vueI18n: "./i18n.config.ts", // if you are using custom path, default
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
    eslint: {
        lintOnStart: false,
        cache: true,
        emitWarning: false
    },
    pinia: {
        storesDirs: ['stores']
    },
    tailwindcss: {
        exposeConfig: true,
        viewer: false,
    },
    compatibilityDate: '2025-01-06'
});