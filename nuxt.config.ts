// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
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
            frontendUrl: process.env.ORIGIN
        },
        private: {
            NUXT_SECRET: process.env.NUXT_SECRET
        }
    },
    //https://nuxt.com/docs/guide/concepts/rendering
    routeRules: {
        // Generated at build time for SEO purpose
        "/": { ssr: false },
        "/search": { ssr: false },
        "/contact": { isr: true },
        "/login": { ssr: false },
        // Cached for 1 hour
        //"/api/*": { cache: { maxAge: 60 * 60 } },
        // Redirection to avoid 404
        "/old-page": {
            redirect: { to: "/new-page", statusCode: 302 },
        },
    },
    css: ["~/assets/scss/main.scss"],
    vite: {
        optimizeDeps: {
            include: [
                '@appbaseio/reactivecore',
                '@appbaseio/reactivesearch-vue',
                'fast-deep-equal',
            ],
        },
        build: {
            commonjsOptions: {
                include: [/reactivecore/, /reactivesearch/, /node_modules/],
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "~/assets/scss/_colors.scss" as *;'
                },
            },
        }
    },
    devtools: {
        enabled: true
    },
    modules: [
        //"@nuxt/typescript-build",
        "@nuxtjs/eslint-module",
        "@nuxtjs/i18n",
        "@nuxtjs/tailwindcss",
        "@nuxtjs/color-mode",
        '@nuxt/image',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        '@nuxt/content',
        '@formkit/nuxt',
        'nuxt-icon',
        '@sidebase/nuxt-auth',
        '@vueuse/nuxt',
        '@nuxtjs/strapi'
    ],
    typescript: {
        includeWorkspace: true
    },
    i18n: {
        /* module options */
        vueI18n: "./i18n.config.ts", // if you are using custom path, default
    },
    colorMode: {
        preference: 'avefi_light',
        classSuffix: '',
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
        viewer: true,
    },
    strapi: {
        url: process.env.API_URL,
        cookie: {
            path: '/',
            maxAge: 14 * 24 * 60 * 60,
            secure: process.env.NODE_ENV === 'production',
            sameSite: true
        }
    },
    alias: {
        //pinia: process.env.NODE_ENV === 'production' ? '/node_modules/pinia/dist/pinia.mjs' : '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs',
    },
    /*
    auth: {
        baseURL: '/api/auth',
        provider: {
            type: 'local',
            endpoints: {
                getSession: false
            }
        }
    },
    */
    auth: {
        origin: process.env.ORIGIN,
        baseURL: `${process.env.API_URL}/api`,
        provider: {
            type: 'local',
            endpoints: {
                getSession: { path: '/users/me' },
                login: { path: '/auth/local' },
                signIn: { path: '/auth/local' },
                signOut: false,

            },
            pages: {
                login: '/login'
            },
            token: {
                signInResponseTokenPointer: '/jwt'
            },
            sessionDataType: { id: 'string', email: 'string', username: 'string', role: '{id: number, name: string}', organisation: '{id: number, name: string}', avatar: '{id: number, url: string}' }
        },
        session: {
            // Whether to refresh the session every time the browser window is refocused.
            enableRefreshOnWindowFocus: true,
            // Whether to refresh the session every `X` milliseconds. Set this to `false` to turn it off. The session will only be refreshed if a session already exists.
            enableRefreshPeriodically: 30000
        },
        globalAppMiddleware: {
            isEnabled: false
        }
    }
});