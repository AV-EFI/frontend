// nuxt.config.ts

import tailwindcss from '@tailwindcss/vite';
import { defineOrganization } from "nuxt-schema-org/schema";
import { defineNuxtConfig } from 'nuxt/config';
// 📝 Explanation:
// Nuxt dev server must listen on 0.0.0.0 so it's reachable via host.docker.internal inside Docker.
// Assets and routing must stay aligned for Traefik + Nuxt dev.

export default defineNuxtConfig({
    compatibilityDate: '2025-07-31',
    ssr: true,
    app: {
        baseURL: '/',
        pageTransition: false,
        head: {
            link: [
                // Preconnect to external domains if needed
                // { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            ]
        }
    },
    // Inline critical CSS into the HTML to avoid render-blocking
    experimental: {
        // payloadExtraction: false,
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
        '@nuxtjs/i18n',
        //'@nuxtjs/tailwindcss',
        //'@nuxtjs/color-mode',
        '@formkit/nuxt',
        '@nuxt/icon',
        '@vueuse/nuxt',
        'nuxt3-winston-log',
        '@dargmuesli/nuxt-cookie-control',
        'nuxt-nodemailer',
        '@nuxtjs/seo',
        '@nuxtjs/robots',
        '@nuxtjs/sitemap',
        'nuxt-schema-org'
    ],
    extends: './pages',
    imports: {
        dirs: ['~/stores', '~/plugins'] // keine Wildcards
    },
    icon: {
        // See: https://github.com/nuxt-modules/icon#configuration
        collections: ['tabler'], // Uncomment if you want to use specific icon collections
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
            siteUrl: process.env.ORIGIN,
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
        "/": { ssr: true },
        "/search": { ssr: true },
        //"/contact": { prerender: true },
        "/contact": { ssr: true }, 
        "/login": { ssr: true },
        "/film/**": {ssr: true},
        "/res/**": {ssr: false},
        "/serial/**": {ssr: true},
        "/protected/institutionlist": {ssr: true},
        "/protected/dashboard": {ssr: true},
        "/protected/mergetool": {ssr: true},
        "/normdata": {ssr: true},
        "/protected/normdata": {ssr: true},
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
    site: {
        // Full base URL of the production site
        url: process.env.SITE_URL || 'https://www.av-efi.net',
        // Used by @nuxt/seo, @nuxt/robots, @nuxt/sitemap, OG-image, schema.org
        name: 'AVefi – Find films. Link data.',
        // Fallback (i18n SEO meta will override this per page)
        description:
            'AVefi provides unified access to film metadata from German archives – linked with authority data, persistent identifiers and research tools.',
        // Whether Google is allowed to index the site
        // dev/staging: NUXT_PUBLIC_INDEXABLE=false
        // production : NUXT_PUBLIC_INDEXABLE=true
        indexable: process.env.NUXT_PUBLIC_INDEXABLE === 'true',
        // Enable automatic Open Graph image generation (if using @nuxtjs/og-image)
        // You can override with runtimeConfig.public.siteOgImage
        image: '/img/avefi-og-image.png'
    },
    schemaOrg: {
        enabled: true,
        minify: true,
        identity: defineOrganization({
            // Core identity: AVefi consortium / service
            name: 'AVefi – Infrastruktur für audiovisuelle Forschung',
            alternateName: 'AVefi',
            url: process.env.SITE_URL || 'https://www.av-efi.net',
            logo: `${process.env.SITE_URL || 'https://www.av-efi.net'}/img/avefi-og-image.png`,
            description: 'AVefi ermöglicht die Recherche von Werken, Manifestationen und Exemplaren in mehreren deutschen Filmarchiven – mit Normdaten-Verknüpfungen, Persistent Identifiers und Exportfunktionen für Forschung und Praxis.',
            // Hosted / operated at GWDG
            serviceOperator: {
                '@type': 'Organization',
                name: 'Gesellschaft für wissenschaftliche Datenverarbeitung mbH Göttingen (GWDG)',
                alternateName: 'GWDG',
                url: 'https://www.gwdg.de',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Burckhardtweg 4',
                    addressLocality: 'Göttingen',
                    postalCode: '37077',
                    addressCountry: 'DE',
                },
                contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer support',
                    telephone: '+49 551 39-30001',
                    email: 'support@gwdg.de',
                },
            },
            // Project / consortium structure
            foundingDate: '2023-11-01', // adjust if you have a precise date
            member: [
                {
                    '@type': 'Organization',
                    name: 'TIB – Leibniz-Informationszentrum Technik und Naturwissenschaften',
                    url: 'https://www.tib.eu',
                },
                {
                    '@type': 'Organization',
                    name: 'Stiftung Deutsche Kinemathek – Museum für Film und Fernsehen',
                    alternateName: 'Deutsche Kinemathek',
                    url: 'https://www.deutsche-kinemathek.de/',
                },
                {
                    '@type': 'Organization',
                    name: 'Filmmuseum Düsseldorf',
                    url: 'https://www.duesseldorf.de/filmmuseum',
                },
                {
                    '@type': 'Organization',
                    name: 'Gesellschaft für wissenschaftliche Datenverarbeitung mbH Göttingen',
                    alternateName: 'GWDG',
                    url: 'https://www.gwdg.de',
                },
            ],

            // Social + open repos
            sameAs: [
                'https://github.com/AV-EFI',
                'https://www.zotero.org/groups/5125890/avefi',
            ],
        }),
    },
    robots: {
        // Let the module generate robots.txt, don't keep a static one that says "Disallow: /"
        groups: [
            {
                userAgent: '*',
                disallow: '/'
                /* TODO: re-enable when ready to be indexed                
                userAgent: '*',
                allow: process.env.NUXT_PUBLIC_INDEXABLE === 'true' ? '/' : '',
                disallow: process.env.NUXT_PUBLIC_INDEXABLE === 'true' ? '' : '/',
                */
            },
        ],
        sitemap: ['/sitemap.xml'],
    },
    // Sitemap
    sitemap: {
        include: [
            '/', 
            '/search',
            '/contact',
            '/res/**',
            '/res',
            '/imprint'
        ],
        // ⬇️ add concrete EFI/PID pages here
        urls: [
            { loc: '/search/?has_form=Short&manifestation_event_type=RestorationEvent' },
            { loc: `/search/?has_form=Documentary&subjects=Protest&subjects=Aufstand&subjects=Widerstand&subjects=Streik`},
            { loc: `/search/?directors_or_editors=Troller%2C%20Georg%20Stefan` },
            { loc: `/search/?production=Schlenker%2C%20Hermann&production=Hermann%20Schlenker%20Filmproduktion` },
            { loc: `/search/?located_in_has_name=Deutsche%20Demokratische%20Republik%20%28DDR%29` },
            { loc: '/search/?query=Metropolis' },
            { loc: '/search/?query=Berlin' },
            { loc: '/res/21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406' },
            { loc: '/res/21.11155/D8231D2F-3F17-4917-A242-02844AA83C88' },
        ],
        siteUrl: process.env.SITE_URL || 'https://www.av-efi.net',
        exclude: [
            '/protected/**',
            '/admin/**',
            '/login',
            '/logout',
            '/signout',
            '/error-500',
            //TODO: check if /vocab should be included
            '/vocab',
            '/nuxt.config',   // if this route exists, hide it
            '/_**',
            '/_nuxt/**',
        ],
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
        build: {
            chunkSizeWarningLimit: 750,
            target: 'esnext',
            cssCodeSplit: true,
            cssMinify: 'esbuild', // Use esbuild instead of lightningcss for compatibility
            rollupOptions: {
                output: {
                    manualChunks: (id: string) => {
                        // Split vendor chunks for better caching
                        if (id.includes('node_modules')) {
                            if (id.includes('vue') || id.includes('vue-router')) {
                                return 'vue-vendor';
                            }
                            if (id.includes('instantsearch') || id.includes('algoliasearch')) {
                                return 'search-vendor';
                            }
                            // Separate chunk for other vendors
                            return 'vendor';
                        }
                        // Split large CSS files
                        if (id.includes('main.scss')) {
                            return 'styles-main';
                        }
                        return undefined;
                    },
                    // Optimize CSS output
                    assetFileNames: (assetInfo: { name?: string }) => {
                        if (assetInfo.name?.endsWith('.css')) {
                            return 'assets/css/[name]-[hash][extname]';
                        }
                        return 'assets/[name]-[hash][extname]';
                    },
                },
            },
        },
        logLevel: 'error',
        css: {
            devSourcemap: false, // Disable CSS sourcemaps in dev for faster builds
            preprocessorOptions: {
                scss: {
                    // Optimize SCSS compilation
                    additionalData: `@use "sass:math";`,
                },
            },
        },
    },
    typescript: {
        includeWorkspace: true
    },
    i18n: {
        debug: true,
        strategy: 'no_prefix',
        defaultLocale: 'de',
        locales: [
            { code: 'de', iso: 'de-DE', name: 'Deutsch' },
            { code: 'en', iso: 'en-US', name: 'English' }
        ],
        vueI18n: './i18n.config.ts'
    },
    formkit: {
        autoImport: false // Performance-Optimization: Disable auto-import to reduce bundle size
    },
    pinia: {
        storesDirs: ['stores']
    },
    css: [
        '~/assets/scss/main.scss'      // Main styles will be code-split
    ],
    postcss: {
        plugins: {
            "@tailwindcss/postcss": {},   // ✅ v4 plugin
            autoprefixer: {},
        },
    },
});
