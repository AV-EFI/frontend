# `SearchListViewComp.vue`

## Props

- `items`: Array
- `productionDetailsChecked`: Boolean
- `showAdminStats`: Boolean
- `expandedHandles`: Array
- `expandAllHandlesChecked`: Boolean

## Emits

_None_

## Refs

- `lastHref`: window.location.href
- `componentInfoReady`: false

## Watched Refs

_None_

## Functions

- `updateFromHref`

## Lifecycle Hooks

- `onMounted`
- `onBeforeUnmount`

## Imported Composables

_None_

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
