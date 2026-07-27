# Interaction Patterns

This document records current AVefi interaction behavior that is visible in source and tests.

The 2026-05-13 handbook export says platform rules are especially binding for search, search results, detail pages, facets, filters, FAQ, glossary, UI text, help text, error messages, export, and comparison functions. For these areas, prioritize structure, clarity, accessibility, and trust over visual effects.

## Search Entry

Sources:

- `pages/index.vue`
- `components/global/SearchCompReduced.vue`
- `components/global/SearchCompExtended.vue`
- `components/search/QueryAutocompleteCore.vue`
- `stores/searchParams.ts`

Rules:

- The home page provides simple and advanced search modes.
- The simple search navigates to `/search/` with `query=<term>` when a term exists; without a term it opens the full collection route.
- Advanced search uses FormKit, persists form shape in Pinia, supports multiple facet rows, and builds a route with free query plus facet query params.
- Empty advanced search submission is blocked with a validation warning.
- Facet suggestions are fetched from `/api/elastic/suggestions`, debounced, abortable, and localized where supported.
- Advanced search hides blacklisted facets including `has_access_status`, `manifestation_event_type`, and several duration/extent fields. Do not expose blacklisted fields without a decision.
- When users repeatedly need explanatory text, first check whether search structure, labels, or filter logic should be improved before adding FAQ/help copy.

## Autocomplete

Source: `components/search/QueryAutocompleteCore.vue`

Rules:

- `modelValue` is the single source of truth.
- Arrow keys navigate suggestions.
- `Enter` selects the highlighted suggestion or submits the input.
- `Tab` and `Escape` close the dropdown.
- Recent searches emit `recent-search-click`, `remove-recent`, and `clear-history`.
- Async suggestion fetches are token-guarded to avoid stale responses.

## Search Results

Sources:

- `pages/search/index.vue`
- `components/search/SearchSection.vue`
- `components/search/InstantSearchTemplateAVefi.vue`
- `components/search/SearchHitsComp.vue`
- `searchConfig_avefi.ts`

Rules:

- `/search` creates a Searchkit InstantSearch client only on the client.
- The search endpoint is `runtimeConfig.public.elasticApiBase` plus `runtimeConfig.public.searchApiPath`.
- Query params are canonicalized against a whitelist derived from `searchConfig_avefi.ts`.
- Unknown search params force a base canonical URL and `noindex,follow`.
- Active refinements are removable; clear-all behavior is centralized and tested.
- View type supports accordion, flat, table, and non-production compact views. Persist only allowed view types.
- Search backend errors should show a user-visible warning and keep the UI interactive with fallback empty results.
- Error messages should stay factual, clear, and free of urgency rhetoric.

## Detail Pages

Sources:

- `pages/res/[prefix]/[id].vue`
- `components/views/WorkViewCompAVefi.vue`
- `components/views/CompilationViewCompAVefi.vue`
- `components/views/ManifestationViewCompAVefi.vue`
- `components/detail/**`

Rules:

- Detail canonical URLs are route-derived as `/res/<prefix>/<id>`.
- Resource data is fetched from the configured detail endpoint and the page derives a resource type from the payload.
- Work detail uses a desktop sidebar and a mobile drawer that target the same section anchors.
- Manifestation/item filtering supports list and badge modes, stores the selected mode in localStorage, and filters manifestations/items by whitelisted field paths.
- If a requested manifestation or item handle is nested under the fetched work, the page can sync the hash to the nested anchor.
- Raw data is available behind a collapsible section through `GlobalJsonTreeViewer`.
- Detail-page labels, help text, and glossary links should explain technical terms when they are necessary for accuracy.

## Comparison And Favourites

Sources:

- `components/global/NavBar.vue`
- `components/global/ComparisonDrawer.vue`
- `stores/compareList.ts`
- `stores/favourites.ts`

Rules:

- Navbar counters open the comparison drawer to the relevant tab.
- The drawer has comparison and favourites tabs with `tab` and `tabpanel` semantics.
- Comparison navigation is allowed only when exactly two comparison items exist.
- Clear/remove/export actions are available for comparison and favourites lists.

## Contact

Source: `components/global/ContactDrawer.vue`

Rules:

- The drawer listens for `toggle-contact-drawer`, `open-contact-drawer`, `close-contact-drawer`, and legacy `open-contact-form` window events.
- The drawer uses dialog semantics, closes on Escape, locks body scroll while open, and restores focus when closed.

## Navigation

Sources:

- `components/global/NavBar.vue`
- `layouts/default.vue`

Rules:

- Public navigation includes search/film research, FAQ, vocabulary, contact, settings, and optional login.
- Auth-gated entries live behind the session user.
- The default layout keeps the navbar fixed, reserves header height, and renders comparison/contact drawers after hydration.
- Scroll-to-top appears only after scroll and only when the page is tall enough.
