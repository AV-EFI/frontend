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
