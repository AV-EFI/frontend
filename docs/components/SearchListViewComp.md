# `SearchListViewComp.vue`

Generated from current source on 2026-07-27 for handover. Verify behavior against the source component and matching tests before changing implementation.

- Source: `components/search/SearchListViewComp.vue`
- Matching tests:
  - `tests/unit/api/internal/client-log.api.spec.ts`
  - `tests/unit/components/search-hits-compact-refinements.spec.ts`
  - `tests/unit/components/search-list-view-items.spec.ts`

## Props

- `currentRefinements`
- `expandAllHandlesChecked`
- `expandedHandles`
- `facetsActive`
- `items`
- `nrOfFacetsActive`
- `productionDetailsChecked`
- `showAdminStats`

## Emits

_None found by static scan._

## Reactive State

- `componentInfoReady (ref)`
- `refinementSignature (computed)`
- `refinementsActive (ref)`
- `searchUpdateTick (ref)`

## Watchers

- 3 watcher call(s): watch

## Functions

- `allItemsEmpty`
- `buildRows`
- `get`
- `getFilteredItems`
- `getFilteredManifestations`
- `getHighlightSnippets`
- `getValueByPath`
- `isItemEmpty`
- `onSearchUpdated`
- `parseRefinementsFromUrl`
- `updateFromHref`

## Lifecycle Hooks

- `onBeforeUnmount`
- `onMounted`

## Exposed Methods

_None found by static scan._

## Local Imports

- `@/composables/useItemEmpty`
- `@/models/interfaces/generated/IElasticResponses`

## Template Component Tags

- `GlobalActionContextComp`
- `GlobalClipboardComp`
- `GlobalTooltipInfo`
- `Icon`
- `MicroBadgeCategoryComp`
- `NuxtLink`
- `SearchGenericIconList`
- `SearchHighlightMatchComp`
- `SearchManifestationListSplitView`
- `Transition`

## Shared Classes Used

- `badge-userinfo`

## Preserved Notes From Previous Documentation

## Was die Tests abfangen (einfach erklaert)

Die relevanten Unit-Tests liegen in `tests/unit/components/search-list-view-items.spec.ts`.

Diese Tests stellen sicher:

- Die View zeigt standardmaessig genau die Daten aus der API-Antwort an.
- Ohne `inner_hits` bei Items wird `manifestation.items` unveraendert verwendet.
- Mit `inner_hits` bei Items werden diese Treffer bevorzugt angezeigt.
- Wenn `inner_hits` zwar vorhanden, aber leer ist, faellt die View sauber auf `manifestation.items` zurueck.
- In dieser View wird **keine** lokale client-seitige Item-Filterung ausgefuehrt.
- In dieser View wird dadurch auch **kein** lokales Mismatch-Logging fuer Item-Filter ausgelost.
- Das Facet-Badge (`refinementsActive`) reagiert korrekt auf URL-/Route-Aenderungen:
	- mit Facet in der URL = aktiv,
	- nach Clear/ohne Facet = inaktiv.

Warum das wichtig ist:

- Die Tests verhindern, dass versehentlich wieder lokale Filterlogik in diese View eingebaut wird.
- Die Tests sichern das gewuenschte Verhalten: API-Response direkt anzeigen, ausser bei der klar definierten `inner_hits`-Prioritaet.
