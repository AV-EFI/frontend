# Component Behavior Contracts (Pre-Refactor)

This file defines high-value component contracts to verify after refactors.

## Global Shell Components

## `components/global/NavBar.vue`

- Must render core nav links (`search`, `faq`, `vocab`) on desktop and mobile.
- Must show environment label badge when not production.
- Must expose favourites/comparison counters from stores and open comparison drawer by intent.
- Must keep auth-gated menu entries under `data?.user`.
- Must keep mobile menu toggle state stable across interactions.

## `components/global/ContactDrawer.vue`

- Must react to window events:
  - `toggle-contact-drawer`
  - `open-contact-drawer`
  - `close-contact-drawer`
  - legacy `open-contact-form`
- Must lock body scroll while open and restore on close/unmount.
- Must close on `Escape`.
- Must pass `initialMessage` into `MicroContactForm`.

## `components/global/ComparisonDrawer.vue`

- Must switch tabs between `comparison` and `favourites` based on available items.
- Must disable navigation-to-compare unless exactly 2 comparison items exist.
- Must support clear/remove/export actions for both stores.
- Must keep tabpanel semantics (`tab`, `tabpanel`, `aria-selected`) intact.

## Search Entry Components

## `components/global/SearchCompExtended.vue`

- Must maintain deterministic form shape in Pinia store.
- Must support multiple facet rows with add/remove behavior.
- Must keep facet blacklist behavior (includes `has_access_status`).
- Must fetch facet suggestions with debounce + cancellation.
- Must block submit when no query/facet value and show warning.
- Must build navigation URL with free query + facet key/value pairs.

## `components/search/QueryAutocompleteCore.vue`

- `modelValue` is single source of truth via computed proxy.
- Keyboard behavior:
  - arrows navigate suggestions
  - `Enter` selects highlighted item
  - `Tab`/`Escape` closes dropdown.
- Must handle recent-search suggestions and emit:
  - `recent-search-click`
  - `remove-recent`
  - `clear-history`
- Must avoid stale async races (token-guarded fetch, debounce cancel on unmount).

## Search Result Rendering Components

## `components/search/SearchSection.vue`

- Must render loading fallback until InstantSearch module is ready.
- Must pass `searchClient` + runtime index to `SearchInstantSearchTemplateAVefi`.
- Must re-emit `facetsChanged` from child.

## `components/search/SearchHitsComp.vue`

- Must map `viewTypeChecked` to exactly one result renderer:
  - `SearchListFlatComp`
  - `SearchListViewComp`
  - `SearchTableViewComp`
- Must preserve loading skeleton path (`GlobalSkeletonLoaderComp`).
- Must persist allowed view type values in localStorage (`avefi-view-type`).

## `components/search/SearchListViewComp.vue`

- Must keep expandable card behavior per work handle.
- Must render highlight snippets from `_highlightResult` when available.
- Must preserve manifestation/item drill-down behavior from `inner_hits` fallback logic.
- Must preserve "all items empty" badge logic.
- Must keep compare/favourite/action controls per row.

## Detail Components

## `components/views/WorkViewCompAVefi.vue`

- Must keep dual navigation model:
  - desktop sidebar
  - mobile drawer
- Both nav modes must scroll to identical anchor IDs.
- Must keep manifestation/item filter suggestions and selection chips behavior.
- Must keep filtered empty state alert.
- Must preserve fallback branches:
  - manifestations present -> manifestation list
  - no manifestations + parts present -> parts component
  - else warning alert.

## `components/global/ActionContextComp.vue`

- Must only render for `avefi:WorkVariant` items.
- Must provide add-to-favourites, add-to-comparison, export actions.
- Must pass correct id/handle into child actions.

## Contract-to-Test Mapping (Initial)

1. Smoke E2E:
   - home loads, toggle search mode, navigate search, open first detail.
2. Search SEO:
   - canonical and robots assertions for allowed/disallowed params.
3. Search UX:
   - advanced form validation block on empty submit.
   - autocomplete keyboard selection and recent history actions.
4. Detail UX:
   - manifestation filter chips narrow results.
   - anchor navigation works in mobile and desktop modes.
5. Global UX:
   - contact drawer events + Escape close.
   - comparison drawer enable/disable rules for compare action.

## Known Sensitive Area

- `has_access_status` behavior spans search filtering, result visibility, and detail display.
- Keep this rule explicit in test fixtures: direct-ID/API lookup can expose items not discoverable via generic facet navigation.
