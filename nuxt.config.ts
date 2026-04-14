// nuxt.config.ts
const releaseMode = process.env.NUXT_PUBLIC_RELEASE_MODE ?? 'pre'; // pre | release
const indexSearch = process.env.NUXT_PUBLIC_INDEX_SEARCH === 'true';
const disableIndexing = process.env.NUXT_PUBLIC_DISABLE_INDEXING === 'true';
const buildProfile = process.env.NUXT_BUILD_PROFILE ?? 'ci';

const isPre = releaseMode === 'pre';
const isRelease = releaseMode === 'release';
const isFastBuildProfile = buildProfile === 'local';
const shouldRunBuildQa = !isFastBuildProfile;
const shouldEnableReleaseModules = !isFastBuildProfile;

const isProduction = process.env.NODE_ENV === 'production';
const publicSiteUrl =
  process.env.NUXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  process.env.ORIGIN ||
  'https://www.av-efi.net';
const publicApiUrl =
  process.env.NUXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  process.env.AVEFI_INTERNAL_API ||
  '/api';
const publicElasticApiBase =
  process.env.NUXT_PUBLIC_ELASTIC_API_BASE ||
  process.env.PUBLIC_AVEFI_ELASTIC_API ||
  process.env.AVEFI_ELASTIC_API ||
  '/rest/v1';
const publicSearchApiPath =
  process.env.NUXT_PUBLIC_SEARCH_API_PATH ||
  process.env.AVEFI_ELASTIC_API_SEARCH_ENDPOINT ||
  process.env.AVEFI_SEARCH ||
  'frontend/search';
const publicSearchRouteBase =
  process.env.NUXT_PUBLIC_SEARCH_ROUTE_BASE ||
  process.env.SEARCH_URL ||
  process.env.AVEFI_SEARCH_URL ||
  'search';
const publicSiteOgImage =
  process.env.NUXT_PUBLIC_SITE_OG_IMAGE ||
  `${publicSiteUrl.replace(/\/+$/, '')}/img/avefi-og-image.png`;

import tailwindcss from '@tailwindcss/vite';
import { defineOrganization } from 'nuxt-schema-org/schema';
import { defineNuxtConfig } from 'nuxt/config';
import { visualizer } from 'rollup-plugin-visualizer';
// 📝 Explanation:
// Nuxt dev server must listen on 0.0.0.0 so it's reachable via host.docker.internal inside Docker.
// Assets and routing must stay aligned for Traefik + Nuxt dev.

export default defineNuxtConfig({
  compatibilityDate: '2025-07-31',
  ssr: true,
  debug: false,

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
        { rel: 'manifest', href: '/img/site.webmanifest', fetchpriority: 'low' },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/ttf',
          href: '/fonts/BreeSerif-Regular.ttf',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/ttf',
          href: '/fonts/Inter.ttf',
          crossorigin: 'anonymous',
        },
        // Preload LCP hero image for mobile
        {
          rel: 'preload',
          as: 'image',
          href: '/img/avefi_diamonds_prim_white.webp',
          imagesrcset:
            '/img/avefi_diamonds_prim_mobile.webp 274w, /img/avefi_diamonds_prim_tablet.webp 400w, /img/avefi_diamonds_prim_desktop.webp 1300w, /img/avefi_diamonds_prim_white.webp 2040w',
          imagesizes: '(max-width: 640px) 274px, (max-width: 1023px) 400px, 100vw',
          fetchpriority: 'high',
        },
      ],
      style: [
        {
          innerHTML: `html[data-theme="avefi_dark"], [data-theme="avefi_dark"] {
            background: oklch(20.768% 0.039 265.754) !important;
            color: oklch(20.768% 0.039 265.754) !important;
            --color-base-100: oklch(20.768% 0.039 265.754);
            --color-base-content: #dfe9ee;
            --color-primary: #4d768d;
            --color-primary-content: oklch(98% 0.002 247.839);
            --color-secondary: #000000;
            --color-secondary-content: oklch(98% 0.002 247.839);
            --color-accent: #d8899c;
            --color-accent-content: #3a1f26;
            --color-neutral: oklch(27.949% 0.036 260.03);
            --color-neutral-content: #ffffff;
          }
          `,
          type: 'text/css',
          tagPosition: 'head',
        },
      ],
      script: [
        {
          innerHTML: `(() => {
              try {
                const key = 'avefi-color-mode';
                const root = document.documentElement;

                const cookieMatch = document.cookie.match(/(?:^|; )avefi-color-mode=([^;]+)/);
                const cookieValue = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
                const stored = localStorage.getItem(key);

                const mode =
                  stored ||
                  cookieValue ||
                  (window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'avefi_dark'
                    : 'avefi_light');

                root.setAttribute('data-theme', mode);
                root.classList.toggle('dark', mode === 'avefi_dark');

                localStorage.setItem(key, mode);
                document.cookie = 'avefi-color-mode=' + mode + '; path=/; max-age=31536000; SameSite=Lax';
              } catch (e) {}
            })();`,
          type: 'text/javascript',
          tagPosition: 'head',
        },
      ],
      meta: [
        ...(!disableIndexing
          ? [
            {
              name: 'google-site-verification',
              content: 'mv2NfoSilsm-VcCIqXp-8m9WH-ldWlf2c_IDEqsaIwM',
            },
          ]
          : []),
        {
          name: 'apple-mobile-web-app-title',
          content: 'AVefi',
        },
        ...(disableIndexing
          ? [
            { name: 'robots', content: 'noindex, nofollow, noarchive' },
            { name: 'googlebot', content: 'noindex, nofollow, noarchive' },
          ]
          : []),
      ],
    },
  },

  // Inline critical CSS into the HTML to avoid render-blocking
  experimental: {
    // inlineSSRStyles: true, // Removed invalid property
    // payloadExtraction: false,
  },

  devtools: {
    enabled: false,
  },

  nitro: {
    preset: 'node-server',
    compressPublicAssets: true,
    serverAssets: [{ baseName: 'vocab', dir: 'assets/vocab' }],
    debug: !isProduction && process.env.NUXT_DEBUG === 'true',
    externals: {
      // On Windows, Nitro's traced node_modules output can collide when multiple
      // major versions of readable-stream are externalized. Inline the packages
      // that drag those versions in so Nitro only links one external copy.
      inline: process.platform === 'win32'
        ? [
          /^readable-stream(?:\/.*)?$/,
          /^winston(?:\/.*)?$/,
          /^winston-transport(?:\/.*)?$/,
          /^winston-daily-rotate-file(?:\/.*)?$/,
          /^jszip(?:\/.*)?$/,
        ]
        : [],
    },
    prerender: {
      crawlLinks: false,
      routes: shouldRunBuildQa ? ['/faq', '/vocab', '/imprint', '/press'] : [],
    },

    // Response-header policies (X-Robots-Tag etc.)
    routeRules: {
      ...(disableIndexing
        ? {
          '/**': {
            headers: {
              'X-Robots-Tag': 'noindex, nofollow, noarchive',
            },
          },
        }
        : {}),
      ...(!disableIndexing
        ? {
          // ✅ immer fetchbar (GSC braucht das)
          '/sitemap.xml': {
            headers: {
              // Sitemap selbst muss nicht indexiert werden – aber darf gecrawlt werden
              'X-Robots-Tag': 'noindex, follow',
              'Content-Type': 'application/xml; charset=utf-8',
            },
          },
          '/robots.txt': {
            headers: {
              'X-Robots-Tag': 'index, follow',
              'Content-Type': 'text/plain; charset=utf-8',
            },
          },
          // ✅ Caching unverändert
          '/img/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
          '/fonts/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },

          // ✅ Search nur indexieren wenn explizit gewünscht UND release
          ...(isRelease && !indexSearch
            ? {
              '/search': { headers: { 'X-Robots-Tag': 'noindex, follow' } },
              '/search/**': { headers: { 'X-Robots-Tag': 'noindex, follow' } },
            }
            : {}),

          ...(isPre
            ? {
              '/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
            }
            : {}),
        }
        : {}),
    },
  },

  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
    //'@nuxtjs/tailwindcss',
    //'@nuxtjs/color-mode',
    '@nuxt/icon',
    '@vueuse/nuxt',
    '@dargmuesli/nuxt-cookie-control',
    'nuxt-nodemailer',
    'nuxt-schema-org',
    ...(shouldEnableReleaseModules
      ? [
        'nuxt3-winston-log',
        '@nuxtjs/seo',
        '@nuxtjs/robots',
        '@nuxtjs/sitemap',
      ]
      : []),
  ],

  extends: './pages',

  imports: {
    dirs: ['~/stores', '~/plugins'], // keine Wildcards
  },

  icon: {
    // See: https://github.com/nuxt-modules/icon#configuration
    collections: ['tabler', 'formkit'], // Uncomment if you want to use specific icon collections
  },

  components: {
    global: true,
    dirs: ['~/components'],
  },

  runtimeConfig: {
    public: {
      // release switches
      releaseMode,
      indexSearch,
      disableIndexing,
      // bot/rate limit knobs (used by server middleware, e.g. server/middleware/bot-guard.ts)
      rateLimitEnabled: process.env.NUXT_PUBLIC_RATE_LIMIT_ENABLED === 'true',
      rateLimitAvg: Number(process.env.NUXT_PUBLIC_RATE_LIMIT_AVG ?? 8),
      rateLimitBurst: Number(process.env.NUXT_PUBLIC_RATE_LIMIT_BURST ?? 20),
      botUaAllowlist: (
        process.env.NUXT_PUBLIC_BOT_UA_ALLOWLIST ??
        'Googlebot,Google-InspectionTool,Bingbot,msnbot,Applebot,DuckDuckBot,DuckAssistBot,Twitterbot,OAI-SearchBot,GPTBot,Claude-SearchBot,PerplexityBot'
      )
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      ENV_LABEL: process.env.NUXT_PUBLIC_ENV_LABEL,
      origin: publicSiteUrl,
      frontendUrl: publicSiteUrl,
      siteUrl: publicSiteUrl,
      siteOgImage: publicSiteOgImage,
      apiUrl: publicApiUrl,
      elasticApiBase: publicElasticApiBase,
      searchApiPath: publicSearchApiPath,
      searchRouteBase: publicSearchRouteBase,
      AVEFI_INTERNAL_API: publicApiUrl,
      AVEFI_ELASTIC_API: publicElasticApiBase,
      PUBLIC_AVEFI_ELASTIC_API: publicElasticApiBase,
      AVEFI_ELASTIC_API_SEARCH_ENDPOINT: publicSearchApiPath,
      AVEFI_SEARCH: publicSearchApiPath,
      SEARCH_URL: publicSearchRouteBase,
      AVEFI_SEARCH_URL: publicSearchRouteBase,
      authGuardBypassInDev: !isProduction && process.env.AUTH_GUARD_BYPASS_IN_DEV !== 'false',
      ELASTIC_INDEX: process.env.ELASTIC_INDEX,
      ELASTIC_INDEX_DETAIL: process.env.ELASTIC_INDEX_DETAIL,
      ELASTIC_INDEX_MAPPING: process.env.ELASTIC_INDEX_MAPPING,
      AVEFI_SEARCH_API: process.env.AVEFI_SEARCH_API,
      AVEFI_BACKEND_URL: process.env.AVEFI_BACKEND_URL,
      AVEFI_GET_WORK: process.env.AVEFI_GET_WORK,
      AVEFI_GET_MANIFEST: process.env.AVEFI_GET_MANIFEST,
      AVEFI_GET_MANIFEST_BY_WORK: process.env.AVEFI_GET_MANIFEST_BY_WORK,
      AVEFI_GET_ITEM_BY_MANIFEST: process.env.AVEFI_GET_ITEM_BY_MANIFEST,
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
          process.env.CMS_ALLOW_USERTOOLTIP_EDITS === 'true' || process.env.NODE_ENV === 'production',
      },
    },

    private: {
      NUXT_SECRET: process.env.NUXT_SECRET,
      ELASTIC_APIKEY: process.env.ELASTIC_APIKEY,
      ELASTIC_HOST_PUBLIC: process.env.ELASTIC_HOST_PUBLIC,
      ELASTIC_HOST_INTERNAL: process.env.ELASTIC_HOST_INTERNAL,
    },
  },
  routeRules: {
    '/': { ssr: true },
    '/search': { ssr: true },
    '/faq': { ssr: false },
    '/login': { ssr: true },
    '/film/**': { ssr: true },
    '/res/**': { ssr: true, prerender: false },
    '/serial/**': { ssr: true },
    '/protected/institutionlist': { ssr: true },
    '/protected/dashboard': { ssr: true },
    '/protected/mergetool': { ssr: true },
    '/normdata': { ssr: true },
    '/protected/normdata': { ssr: true },
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
      pass: process.env.MAIL_PASSWORD,
    },
  },
  site: {
    url: publicSiteUrl,
    name: 'AVefi',
    description:
    'AVefi provides unified access to film metadata from German archives – linked with authority data, persistent identifiers and research tools.',
    indexable:
    process.env.NUXT_PUBLIC_INDEXABLE === 'true',
    image: '/img/avefi-og-image.png',
  },

  schemaOrg: {
    enabled: true,
    minify: true,
    identity: defineOrganization({
      '@id': 'https://www.av-efi.net/#organization',
      name: 'AVefi',
      alternateName: ['AV efi', 'AV-efi', 'AVEFI', 'av efi'],
      url: 'https://www.av-efi.net',
      logo: publicSiteOgImage,
      description:
      'AVefi ermöglicht die Recherche von Werken, Manifestationen und Exemplaren in mehreren deutschen Filmarchiven – mit Normdaten-Verknüpfungen, Persistent Identifiers und Exportfunktionen für Forschung und Praxis.',
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
    defaults: false,
  },
  robots: {
    groups: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/protected/**',
          '/admin/**',
          '/login',
          '/logout',
          '/signout',
          '/normdata',
          '/explorer-poc',
          '/_nuxt/**',
          '/_**',
        ],
      },
    ],
    sitemap: ['/sitemap.xml'],
  },
  // Sitemap
  sitemap: {
    zeroRuntime: true,
    excludeAppSources: true, // Exclude app sources to avoid conflicts with dynamic routes
    urls: [
      '/',
      '/search',
      '/contact',
      '/res',
      '/imprint',
      '/accessibility',
      '/press',
      '/faq',
      // concrete “testable” URLs
      { loc: '/search/?has_form=Short&manifestation_event_type=RestorationEvent' },
      { loc: '/search/?has_form=Documentary&subjects=Protest&subjects=Aufstand&subjects=Widerstand&subjects=Streik' },
      { loc: '/search/?directors_or_editors=Troller%2C%20Georg%20Stefan' },
      { loc: '/search/?production=Schlenker%2C%20Hermann&production=Hermann%20Schlenker%20Filmproduktion' },
      { loc: '/search/?query=Metropolis' },
      { loc: '/search/?query=Berlin' },
      { loc: '/search/?query=Cabinet%20des%20Dr%20Caligari' },
      { loc: '/search/?query=Berlin%20Alexanderplatz' },
      { loc: '/search/?query=Solo%20Sunny' },
      { loc: '/search/?has_form%5B0%5D=HomeMovie' },
      { loc: '/search/?has_form%5B0%5D=Short' },
      {
        loc: '/search/?production%5B0%5D=Schlenker%2C%20Hermann&production%5B1%5D=Hermann%20Schlenker%20Filmproduktion&production%5B2%5D=Hermann%20Schlenker',
      },
      { loc: '/search/?subjects=Krieg' },
      { loc: '/search/?subjects=Berlin' },
      { loc: '/search/?subjects=Amateurfilm' },
      { loc: '/search/?subjects=Familie' },
      { loc: '/search/?subjects=Arbeit' },
      { loc: '/search/?manifestation_event_type%5B0%5D=RestorationEvent' },
      { loc: '/search/?manifestation_event_type%5B0%5D=TheatricalDistributionEvent' },
      { loc: '/search/?directors_or_editors%5B0%5D=Nekes%2C%20Werner' },
      { loc: '/search/?directors_or_editors%5B0%5D=Wildenhahn%2C%20Klaus' },
      { loc: '/search/?directors_or_editors%5B0%5D=Nestler%2C%20Peter' },
      { loc: '/search/?directors_or_editors%5B0%5D=Nickel%2C%20Gitta' },
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
    maxSize: '2048m',
    maxFiles: '14d',
    level: isProduction ? 'info' : 'debug',
    // Optional: Enable console logging in development for easier debugging
    console: !isProduction,
    skipRequestMiddlewareHandler: true,
    skipErrorMiddlewareHandler: true,
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
        bannerDescription:
          'We use our own cookies and third-party cookies to enhance your experience on our website. By clicking "Accept all", you consent to the use of ALL cookies. However, you may visit "Manage cookies" to provide a controlled consent.',
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
        bannerDescription:
          'Wir verwenden eigene Cookies und Cookies von Drittanbietern, um Ihre Erfahrung auf unserer Website zu verbessern. Durch Klicken auf "Akzeptieren" stimmen Sie der Verwendung ALLER Cookies zu. Sie können jedoch unter "Cookies verwalten" eine kontrollierte Zustimmung erteilen.',
        cookiesFunctional: 'Funktionale Cookies',
        cookiesNecessary: 'Notwendige Cookies',
        cookiesOptional: 'Optionale Cookies',
        iframeBlocked: 'Um dies zu sehen, aktivieren Sie bitte funktionale Cookies',
        settingsUnsaved: 'Sie haben ungespeicherte Einstellungen',
      },
    },
    cookies: {
      necessary: [
        {
          id: 'default',
          name: { en: 'Default Cookies', de: 'Standard Cookies' },
          description: {
            en: 'Used for Cookies, Search, Favourites and Authentication.',
            de: 'Wird für Cookies, Suche, Favoriten und Authentifizierung verwendet.',
          },
          targetCookieIds: ['cookie_control_consent', 'cookie_control_enabled_cookies'],
        },
        {
          id: 'i18n_redirected',
          name: { en: 'Language Preference Cookies', de: 'Sprachpräferenz-Cookies' },
          description: {
            en: 'Stores the language preference of the user.',
            de: 'Speichert die Sprachpräferenz des Benutzers.',
          },
          targetCookieIds: ['i18n_redirected'],
        },
      ],
      optional: [
        {
          id: 'matomo',
          name: { en: 'Analytics (Matomo)', de: 'Analyse (Matomo)' },
          description: {
            en: 'Helps us understand usage to improve the service.',
            de: 'Hilft, die Nutzung zu verstehen und den Dienst zu verbessern.',
          },
          // purely informational for the banner UI
          targetCookieIds: ['_pk_id.*', '_pk_ses.*'],
        },
      ],
    },
  },

  linkChecker: {
    enabled: shouldRunBuildQa,
    runOnBuild: shouldRunBuildQa,
    excludeLinks: [
      '/api/press-kit.zip',
      '/img/AV-EFI-Logo.svg',
      '/img/AV-EFI-Logo.png',
      '/img/AV-EFI-Logo-dark.svg',
      '/img/AV-EFI-Logo-dark.png',
      '/img/avefi_claim_de.svg',
      '/img/avefi_claim_en.svg',
    ],
  },

  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
  vite: {
    plugins: [
      tailwindcss,
      ...(process.env.BUILD_ANALYZE === 'true' ? [visualizer()] : []),
    ],
    optimizeDeps: {
      include: ['export-to-csv', 'instantsearch.js', 'algoliasearch'],
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
      sourcemap: shouldRunBuildQa,
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
    includeWorkspace: true,
  },

  i18n: {
    debug: false,
    strategy: 'no_prefix',
    defaultLocale: 'de',
    langDir: './locales',
    locales: [
      { code: 'de', iso: 'de-DE', name: 'Deutsch', file: 'de.ts' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.ts' },
    ],
    vueI18n: './i18n.config.ts',
  },

  pinia: {
    storesDirs: ['stores'],
  },

  css: ['~/assets/scss/main.scss'], // Main styles will be code-split

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}, // ✅ v4 plugin
      autoprefixer: {},
    },
  },
});
