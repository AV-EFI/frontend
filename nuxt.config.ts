// nuxt.config.ts
const indexable = process.env.NUXT_PUBLIC_INDEXABLE === 'true';
const isProduction = process.env.NODE_ENV === 'production';

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
                // Favicons & app icons
                { rel: 'icon', type: 'image/png', href: '/img/favicon-96x96.png', sizes: '96x96' },
                { rel: 'icon', type: 'image/svg+xml', href: '/img/favicon.svg' },
                { rel: 'shortcut icon', href: '/favicon.ico' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/img/apple-touch-icon.png' },
                { rel: 'manifest', href: '/img/site.webmanifest' },
            ],
            meta: [
                { 
                    name: 'google-site-verification',
                    content: 'mv2NfoSilsm-VcCIqXp-8m9WH-ldWlf2c_IDEqsaIwM'
                },
                {
                    name: 'apple-mobile-web-app-title',
                    content: 'AVefi',
                },
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
            { baseName: 'vocab', dir: 'assets/vocab' }
        ],
        debug: process.env.NUXT_DEBUG === 'true', // Server Stacktraces
        prerender: {
            crawlLinks: false,
            routes: [
                '/res/21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406',
                '/res/21.11155/D8231D2F-3F17-4917-A242-02844AA83C88',
                // Add more important film pages here
            ]
        },
        routeRules: {
            // ✅ must be crawlable/indexable for Google to accept it as sitemap
            '/sitemap.xml': {
                headers: { 'X-Robots-Tag': 'index, follow' },
            },
            // ✅ robots.txt must be fetchable
            '/robots.txt': {
                headers: { 'X-Robots-Tag': 'index, follow' },
            },

            // OPTIONAL: allow your “test-preview” pages to be indexable even when site is locked
            ...(indexable
                ? {}
                : {
                    '/search': { headers: { 'X-Robots-Tag': 'index, follow' } },
                    '/search/**': { headers: { 'X-Robots-Tag': 'index, follow' } },
                    '/res/**': { headers: { 'X-Robots-Tag': 'index, follow' } },
                    '/imprint': { headers: { 'X-Robots-Tag': 'index, follow' } },
                }),

            // 🔒 default lock-down for everything else
            '/**': indexable
                ? {}
                : {
                    headers: {
                        'X-Robots-Tag': 'noindex, nofollow',
                    },
                },
        },
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
            PUBLIC_AVEFI_ELASTIC_API: process.env.PUBLIC_AVEFI_ELASTIC_API,
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
            
            // Matomo Analytics
            matomoUrl: process.env.MATOMO_URL || 'http://localhost:8888',
            matomoSiteId: process.env.MATOMO_SITE_ID || 'AVefi',
            
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
        "/faq": { ssr: false },
        "/glossary": { ssr: false },
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
            name: 'AVefi – Infrastruktur für audiovisuelle Forschung',
            alternateName: 'AVefi',
            url: process.env.SITE_URL || 'https://www.av-efi.net',
            logo: `${process.env.SITE_URL || 'https://www.av-efi.net'}/img/avefi-og-image.png`,
            description: 'AVefi ermöglicht die Recherche von Werken, Manifestationen und Exemplaren in mehreren deutschen Filmarchiven – mit Normdaten-Verknüpfungen, Persistent Identifiers und Exportfunktionen für Forschung und Praxis.',

            // ✅ Replace serviceOperator with provider (schema-valid relation)
            provider: {
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

            foundingDate: '2023-11-01',

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

            sameAs: [
                'https://github.com/AV-EFI',
                'https://www.zotero.org/groups/5125890/avefi',
            ],
        }),

        // ✅ Add exactly one publisher
        // defaults must be true in your setup
        defaults: true,
    },
    robots: {
        groups: [
            indexable
                ? { userAgent: '*', allow: '/' }
                : {
                    userAgent: '*',
                    disallow: ['/',],
                    allow: ['/search', '/res', '/res/', '/res/*', '/imprint'],
                },
        ],
        sitemap: ['/sitemap.xml'],
    },
    // Sitemap
    sitemap: {
        excludeAppSources: true, // Exclude app sources to avoid conflicts with dynamic routes               
        urls: [
            '/', 
            '/search',
            '/contact',
            '/res',
            '/imprint',

            // concrete “testable” URLs
            { loc: '/search/?has_form=Short&manifestation_event_type=RestorationEvent' },
            { loc: '/search/?has_form=Documentary&subjects=Protest&subjects=Aufstand&subjects=Widerstand&subjects=Streik' },
            { loc: '/search/?directors_or_editors=Troller%2C%20Georg%20Stefan' },
            { loc: '/search/?production=Schlenker%2C%20Hermann&production=Hermann%20Schlenker%20Filmproduktion' },
            { loc: '/search/?located_in_has_name=Deutsche%20Demokratische%20Republik%20%28DDR%29' },
            { loc: '/search/?query=Metropolis' },
            { loc: '/search/?query=Berlin' },

            { loc: '/res/21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406' },
            { loc: '/res/21.11155/D8231D2F-3F17-4917-A242-02844AA83C88' },
        ],

        // keep exclude if you want (won’t matter much if app sources are disabled)
        exclude: [
            '/protected/**',
            '/admin/**',
            '/login',
            '/logout',
            '/signout',
            '/normdata',
            '/error-500',
            '/vocab',
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
        isCssEnabled: true,
        isAcceptNecessaryButtonEnabled: true,        
        //declineAllAcceptsNecessary: true,
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
                    targetCookieIds : [
                        'cookie_control_consent', 
                        'cookie_control_enabled_cookies'
                    ]
                },
                {
                    id: 'i18n_redirected',
                    name: { 
                        en: 'Language Preference Cookies', 
                        de: 'Sprachpräferenz-Cookies' 
                    },
                    description: {
                        en: 'Stores the language preference of the user.',
                        de: 'Speichert die Sprachpräferenz des Benutzers.'
                    },
                    targetCookieIds : ['i18n_redirected']
                }
            ],
            optional: [
                {
                    id: 'matomo',
                    name: {
                        en: 'Analytics (Matomo)',
                        de: 'Analyse (Matomo)',
                    },
                    description: {
                        en: 'Helps us understand usage to improve the service.',
                        de: 'Hilft, die Nutzung zu verstehen und den Dienst zu verbessern.',
                    },
                    // purely informational for the banner UI
                    targetCookieIds: ['_pk_id.*', '_pk_ses.*'],
                },
            ],
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
