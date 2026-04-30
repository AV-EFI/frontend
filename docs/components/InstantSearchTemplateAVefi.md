# `InstantSearchTemplateAVefi.vue`

## Props

- `searchClient`: Object
- `indexName`: String

## Search Transport

`InstantSearchTemplateAVefi.vue` receives its `searchClient` from the page-level search route. It must not create its own regular-search client internally.

For the public `/search` UI, the page-level client is configured with:

- `runtimeConfig.public.elasticApiBase`
- `runtimeConfig.public.searchApiPath`

In the normal runtime configuration this resolves to `/rest/v1/frontend/search`. The local Nitro endpoints `/api/elastic/msearch` and `/api/elastic/msearch_inst` are not the regular public search path.

If a search crash appears as an Algolia/InstantSearch helper error such as `Cannot read properties of undefined (reading 'slice')`, inspect the actual browser POST response before editing `/api/elastic/msearch`. The expected response contract is a JSON object with a top-level `results` array.

## Backend Response Contract

The backend search response is the source of truth for search facets, facet ordering, and hits.

- Frontend must not silently remove or rewrite domain facet filters (for example issuer filters) to "make things work".
- Frontend may only perform transport-level normalization (for example dropping an empty query string).
- If backend returns an invalid shape or a failing response, frontend must stay interactive, show the warning alert (`searchBackendError`), and return a safe empty fallback result shape.

This behavior is locked by tests:

- `tests/unit/components/instant-search-template.spec.ts`
	- preserves issuer + item-level facet filter requests
	- keeps backend facet ordering and facet buckets unchanged
	- shows warning + fallback on backend failure/invalid payload

- `tests/e2e/smoke/search-backend-error-resilience.spec.ts`
	- backend 500 shows warning
	- search page remains interactive (non-crashing)

## Central Refinement Coordination

Refinement actions are coordinated centrally in `InstantSearchTemplateAVefi.vue` through `searchRefinementCoordinator`.

Action paths covered:

- Panel facet toggle
- Current refinement remove
- Clear-all refinements
- Production-year clear

The coordinator emits `avefi:search-refinement-action` for traceability and shared handling.

Behavior contract test:

- `tests/e2e/smoke/search-refinement-request-flow.spec.ts`
	- panel toggle, active-refinement delete, and clear-all all dispatch centralized refinement actions

## Emits

_None_

## Refs

- `viewTypeChecked`: false
- `expandAllChecked`: false
- `expandAllHandlesChecked`: false
- `productionDetailsChecked`: true
- `searchQuery`: ''
- `isSearchLoading`: false
- `showAlgoliaTooltip`: false

## Watched Refs

- `expandAllChecked`
- `viewTypeChecked`

## Functions

- `saveSearchQuery`
- `expandAllItems`
- `updateState`

## Lifecycle Hooks

- `onMounted`
- `onBeforeUnmount`

## Imported Composables

_None_
