# Architecture

## Top-level shape

This is a Nuxt 4 SSR application with a Nitro server. It combines:

- a public AVefi portal (`/`, `/search`, `/res`, `/press`, `/vocab`, `/faq`)
- legacy or internal tools under `/protected/*`
- ad hoc admin tooling under `/admin/*`
- a proof-of-concept graph/chat explorer under `/explorer-poc`
- Nitro server endpoints for Elasticsearch, CMS-style metadata helpers, mail, logging, and POC APIs

The app is not purely frontend. It acts as both UI and a small application server.

## Runtime layers

### App shell

`app.vue` is the real global entry point. It owns:

- global Schema.org graph and SEO defaults
- theme and cookie-control bootstrapping
- auth session polling startup/shutdown
- global loading UI
- the shared layout wrapper

`layouts/default.vue` is the main public layout. It renders:

- the fixed navbar
- the main page slot
- comparison and contact drawers
- footer and scroll-to-top behavior

Notably, `layouts/default.vue` is still written in the Options API while most of the rest of the repo uses `<script setup>`.

### Route surfaces

Public routes:

- landing page in `pages/index.vue`
- search pages in `pages/search/index.vue` and `pages/search/[...slug].vue`
- resource detail routes in `pages/res/[prefix]/[id].vue`
- legacy redirects from `pages/film/*` to `/res/*`
- content pages such as `press.vue`, `vocab.vue`, `faq.vue`, `imprint.vue`, `dataprotection.vue`

Internal or legacy routes:

- `/protected/*` pages for compare, vocab, merge tool, user page, dashboards, edit flows
- `/admin/user_tooltips` and `/admin/generate_pattern`
- `/explorer-poc`

Route protection is inconsistent:

- `/protected/*` and `/admin/*` are now guarded by `middleware/auth.global.ts`
- CMS write routes now have an interim server-side auth session check
- the final authorization model is still incomplete and depends on backend/Keycloak integration

### Components

The component tree is organized by feature family rather than by page:

- `components/global/`: shared shell, drawers, compare UI, shared controls
- `components/search/`: search result templates, facets, highlight components
- `components/views/`: detail-view renderers for work/manifestation/item structures
- `components/detail/`: smaller detail-view building blocks
- `components/home/`: landing-page-only sections
- `components/poc/`: graph explorer UI
- `components/micro/`: very small display helpers

The main active public flow is:

`pages/*` -> `components/global|search|views|detail` -> composables/stores -> Nitro endpoints or direct external fetches

### State

Pinia stores are used for:

- compare list
- favourites
- locale
- search parameter persistence
- POC explorer state

There is still a leftover Vuex-style file in `stores/index.ts`, which suggests the repo has migrated state management but not fully cleaned up.

### Plugins and cross-cutting concerns

Key plugins:

- `01_vue3-toastify.ts`: lazy toast loading
- `formkit-loader.ts`: lazy FormKit install
- `matomo.client.ts`: consent-aware Matomo boot
- `comparisonPlugin.ts`: compare/favourites actions via plugin injection
- `error-handler.ts`: client error capture and reporting
- `searchQuerySync.client.ts`, `syncTabs.client.ts`: localStorage sync behavior

There is a mix of modern lazy-loading patterns and older plugin patterns that depend on injected globals.

## Data flow

There are three different data-access styles in the same codebase:

1. Browser -> Nitro endpoint -> Elasticsearch/filesystem/SMTP
2. Browser -> external AVEFI API directly
3. Browser -> Searchkit client -> AVEFI backend search endpoint

Examples:

- search UI goes through Searchkit config and the AVEFI backend search endpoint `/rest/v1/frontend/search`
- `/res/[prefix]/[id]` fetches directly from public `elasticApiBase`
- vocab, normdata, CMS tooltip pages use Nitro endpoints under `/api/*`
- POC explorer uses Nitro handlers in `/api/poc/*`

This inconsistency is one of the main architectural problems. There is no single server boundary for external systems.

Important search-path boundary:

- Regular public search pages (`/search`) must use the backend `frontend/search` endpoint exposed through `runtimeConfig.public.elasticApiBase` + `runtimeConfig.public.searchApiPath`.
- Local Nitro endpoints such as `/api/elastic/msearch` and `/api/elastic/msearch_inst` are not the regular public search path. Do not debug or patch normal `/search` failures there unless a captured browser request actually posts to one of those endpoints.
- If InstantSearch throws client errors like `Cannot read properties of undefined (reading 'slice')`, first capture the real POST URL and response body. In recent regressions this was caused by `/rest/v1/frontend/search` returning a backend validation error shape, not by `/api/elastic/msearch`.

## Server architecture

Nitro server concerns are split into these groups:

- `server/api/elastic/*`: search, suggest, detail lookup, vocab/normdata helpers
- `server/api/cms/*`: model tree, hints, tooltip CRUD, decoration helpers
- `server/api/mail/*`: contact form
- `server/api/log/*`: client error ingestion
- `server/api/poc/*`: graph explorer and chat support
- `server/middleware/*`: bot/indexing/rate-limit policy and 404 shaping
- `server/utils/*`: ES wrapper, schema field metadata, path mapping, file-backed stores

The strongest server-side abstraction is now split between `server/utils/elasticsearchRuntime.ts` and `server/utils/elasticsearchClient.ts`, but not every codepath uses it.

## Generated-data architecture

This repo depends on generated artifacts for both runtime and documentation:

- generated TypeScript schema wrappers
- generated schema-derived JSON data for vocab/model tree/entities
- generated query suggestions
- generated Tailwind/SCSS color tokens
- generated docs already stored under `docs/`

Because generated files live inside normal source folders, source-of-truth boundaries are blurred. See `generation-and-schema.md`.
