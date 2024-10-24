// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { 
        enabled: false 
    },
    nitro: {
        preset: 'node-server'
    },
    modules: [
        "nitro-cloudflare-dev",
        "@nuxtjs/eslint-module",
        "@nuxtjs/i18n",
        "@nuxtjs/tailwindcss",
        "@nuxtjs/color-mode",
        '@nuxt/image',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        '@nuxt/content',
        '@formkit/nuxt',
        '@nuxt/icon',
        '@vueuse/nuxt',
        "@nuxtjs/robots",
        "nuxt3-winston-log"
    ],
    extends: './pages',
    imports: {
        dirs: ['~/types/*.ts', '~/stores/*.ts', '~/plugins/*.ts']
    },
    build: {
        transpile: ['@appbaseio/reactivesearch-vue'],
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
            AVEFI_DATA_API: process.env.AVEFI_DATA_API
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
        "/": { ssr: false },
        "/search": { ssr: false },
        "/contact": { isr: true },
        "/login": { ssr: false },
        "/film/**": {ssr:false},
        // Cached for 1 hour
        //"/api/*": { cache: { maxAge: 60 * 60 } },
        // Redirection to avoid 404
        "/old-page": {
            redirect: { to: "/new-page", statusCode: 302 },
        },
    },
    css: ["~/assets/scss/main.scss"],
    nuxt3WinstonLog: {
        maxSize: "2048m",
        maxFiles: "14d",
    },
    vite: {        
        build: {
            /*
            rollupOptions: {
                // make sure to externalize deps that shouldn't be bundled
                // into your library
                external: ['vue'],
                output: {
                    // Provide global variables to use in the UMD build
                    // for externalized deps
                    globals: {
                        vue: 'Vue',
                    },
                },
            }
                */
        },
        css: {
            preprocessorOptions: {
                scss: {
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
    image: {
        strapi: {
            baseURL: 'http://localhost:1337/'
        },
        domains: [
            process.env.API_URL || ""
        ]
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
    }
});