# Behavior Baseline (Pre-Refactor)

This document captures expected runtime behavior before refactoring.  
Use it as a regression checklist for manual and automated tests.

## Scope

- Source baseline date: 2026-04-15
- Main shell and route entry points:
  - `app.vue`
  - `layouts/default.vue`
  - `pages/index.vue`
  - `pages/search/index.vue`
  - `pages/res/[prefix]/[id].vue`

## App Shell Contracts

1. Global SEO and schema graph are always mounted in `app.vue`.
2. Canonical link at app level points to `siteUrl` and page-level routes can override with their own canonical.
3. Session polling starts on mount and stops on unmount (`useAuth()` lifecycle).
4. Cookie-control UI mounts lazily (idle callback/timeout), not blocking first render.
5. Theme is controlled by cookie `avefi-color-mode` and mapped to `data-theme` + `dark` class.
6. `default` layout keeps navbar fixed, reserves header spacer, and renders comparison/contact drawers only after hydration.
7. Scroll-to-top button appears only when user has scrolled and page is tall enough.

## Home Page Contracts (`/`)

1. Home has two search modes:
   - simple search (`SearchCompReduced`)
   - advanced search (`SearchCompExtended`)
2. Search mode toggle changes active component without full page reload.
3. Advanced search component is prefetched on pointer/focus of advanced toggle.
4. While client components are not mounted, loading placeholders/skeletons are shown.
5. Home sections below hero are lazy-loaded with visible skeleton fallbacks.

## Search Page Contracts (`/search`)

1. Search UI renders client-only and shows spinner until search client is ready.
2. Search client endpoint is composed from runtime config:
   - `public.elasticApiBase`
   - `public.searchApiPath`
3. Canonical URL for `/search` is normalized:
   - only whitelisted query keys survive canonicalization
   - keys and values are sorted for stable URL shape
4. Robots directive rules:
   - `index,follow` only when query params are in allowlist
   - `noindex,follow` when unknown params are present
5. Search page emits its own `WebPage/SearchResultsPage` + breadcrumb schema nodes.

## Advanced Search Contracts (`SearchCompExtended`)

1. Submit is allowed when either:
   - free-text query exists, or
   - at least one facet row has facet + non-empty value.
2. A facet blacklist is enforced in advanced UI (facet key hidden from selectable list):
   - includes `has_access_status` and other technical fields.
3. Facet suggestions are fetched from `/api/elastic/suggestions` with debounce and abort handling.
4. Search URL builder appends:
   - `query=<term>` (if present)
   - `[<facet>][0]=<value>` for selected facet rows.
5. Empty submit shows validation warning and does not navigate.

## Detail Page Contracts (`/res/:prefix/:id`)

1. Canonical URL is always route-based (`/res/<prefix>/<id>`), independent of backend handle shape.
2. Resource fetch uses `AVEFI_GET_WORK` endpoint and computes resource type from payload shape.
3. Detail page layout switches view component by derived resource type.
4. Detail page emits schema graph nodes (`WebPage`, `DataCatalog`, `Dataset`, `Movie`, breadcrumb).
5. Work view:
   - left navigation anchors into sections
   - mobile drawer + desktop sidebar both target same anchors
   - manifestation/item filter supports multi-select and empty-state alert
   - if no manifestations but parts exist, parts view is shown.

## Known Domain-Specific Behavior To Preserve

1. `has_access_status` is intentionally not user-selectable as an advanced search facet (blacklisted in UI).
2. Item-level access status still appears in detail/list rendering where backend record includes it.
3. Domain rule from team discussion: some records are only visible when directly addressable by ID/API lookup; they may not surface through generic facet/search paths.
   - Treat this as an expected behavior contract unless backend/schema decision changes it.
   - Add explicit tests for this rule once schema-backed test fixtures are available.

## Refactor Acceptance Checklist

- All contracts above still hold in both `testbed` and `production` environments.
- Canonical and robots behavior for `/search` unchanged for representative URL samples.
- Home simple/advanced search toggle and navigation behavior unchanged.
- Detail route still resolves all supported resource-type branches.
- Drawers (`comparison`, `contact`) remain hydration-safe and keyboard-close safe.
