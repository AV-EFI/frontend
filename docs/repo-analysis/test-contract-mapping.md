# Test-Contract Mapping (Initial Skeleton)

This file maps behavior contracts to the first automated test skeleton.

## E2E contracts (Playwright)

- `BB-HOME-001`: home loads and simple/advanced search mode toggles.
  - `tests/e2e/smoke/home-search-detail.spec.ts`
- `BB-HOME-002`: `/search` route is reachable.
  - `tests/e2e/smoke/home-search-detail.spec.ts`
- `BB-DETAIL-001`: stable detail route is reachable.
  - `tests/e2e/smoke/home-search-detail.spec.ts`
- `BB-ROUTE-FAQ-001`: `/faq` route smoke.
  - `tests/e2e/smoke/public-routes-auth.spec.ts`
- `BB-ROUTE-PRESS-001`: `/press` route smoke + press-kit download link.
  - `tests/e2e/smoke/public-routes-auth.spec.ts`
- `BB-ROUTE-VOCAB-001`: `/vocab` route smoke.
  - `tests/e2e/smoke/public-routes-auth.spec.ts`
- `BB-AUTH-ADMIN-001`: unauthenticated `/admin/*` redirects away.
  - `tests/e2e/smoke/public-routes-auth.spec.ts`
- `BB-COMPARE-001`: `/compare` without required params shows invalid-state alert.
  - `tests/e2e/smoke/compare-press-assets-autocomplete.spec.ts`
- `BB-COMPARE-002`: `/compare?prev=...&next=...` renders comparison tablist shell.
  - `tests/e2e/smoke/compare-press-assets-autocomplete.spec.ts`
- `BB-PRESS-ASSET-001`: `/press/manifest.json` and `/api/press-kit.zip` are reachable.
  - `tests/e2e/smoke/compare-press-assets-autocomplete.spec.ts`
- `BB-HOME-AUTOCOMPLETE-001`: keyboard autocomplete flow selects then submits to `/search`.
  - `tests/e2e/smoke/compare-press-assets-autocomplete.spec.ts`
- `BB-SEO-SEARCH-001`: whitelisted search params keep canonicalized URL and `index,follow`.
  - `tests/e2e/seo/search-canonical-robots.spec.ts`
- `BB-SEO-SEARCH-002`: unknown search params force base canonical and `noindex,follow`.
  - `tests/e2e/seo/search-canonical-robots.spec.ts`

## Unit contract guards (Vitest)

- `CBC-SEARCH-EXT-001`: `has_access_status` remains blacklisted in advanced facet UI.
  - `tests/unit/source-guards/search-comp-extended.contract.spec.ts`
- `CBC-SEARCH-EXT-002`: suggestions API uses debounce and abort semantics.
  - `tests/unit/source-guards/search-comp-extended.contract.spec.ts`
- `CBC-SEARCH-EXT-003`: empty advanced submit stays blocked with warning.
  - `tests/unit/source-guards/search-comp-extended.contract.spec.ts`
- `CBC-SEARCH-EXT-004`: advanced URL keeps query + facet key/value format.
  - `tests/unit/source-guards/search-comp-extended.contract.spec.ts`
- `CBC-SEARCH-EXT-005`: empty submit interaction shows warning and blocks navigation.
  - `tests/unit/components/search-comp-extended.spec.ts`
- `CBC-SEARCH-EXT-006`: non-empty query submits and navigates to `/search`.
  - `tests/unit/components/search-comp-extended.spec.ts`
- `CBC-SEARCH-EXT-007`: blacklist facet is not rendered as selectable option.
  - `tests/unit/components/search-comp-extended.spec.ts`

- `CBC-QA-001`: `modelValue` stays source of truth.
  - `tests/unit/source-guards/query-autocomplete-core.contract.spec.ts`
- `CBC-QA-002`: keyboard behavior keeps arrows, enter, tab, escape handling.
  - `tests/unit/source-guards/query-autocomplete-core.contract.spec.ts`
- `CBC-QA-003`: recent-search event surface remains available.
  - `tests/unit/source-guards/query-autocomplete-core.contract.spec.ts`
- `CBC-QA-004`: async race controls remain in place.
  - `tests/unit/source-guards/query-autocomplete-core.contract.spec.ts`
- `CBC-QA-005`: keyboard selection emits selected suggestion.
  - `tests/unit/components/query-autocomplete-core.spec.ts`
- `CBC-QA-006`: recent-history clear action emits expected event.
  - `tests/unit/components/query-autocomplete-core.spec.ts`

- `CBC-CONTACT-001`: contact drawer window event API remains stable.
  - `tests/unit/source-guards/drawers.contract.spec.ts`
- `CBC-CONTACT-002`: contact drawer Escape close and body-scroll lock remain intact.
  - `tests/unit/source-guards/drawers.contract.spec.ts`
- `CBC-CONTACT-003`: open-contact-drawer opens UI and forwards initial message.
  - `tests/unit/components/contact-drawer.spec.ts`
- `CBC-CONTACT-004`: Escape interaction closes drawer and restores body scrolling.
  - `tests/unit/components/contact-drawer.spec.ts`
- `CBC-CONTACT-005`: legacy open-contact-form event still opens drawer.
  - `tests/unit/components/contact-drawer.spec.ts`
- `CBC-COMPARISON-001`: compare action still requires exactly two items.
  - `tests/unit/source-guards/drawers.contract.spec.ts`
- `CBC-COMPARISON-002`: comparison tab semantics remain (`tab`/`tabpanel`/`aria-selected`).
  - `tests/unit/source-guards/drawers.contract.spec.ts`
- `CBC-COMPARISON-003`: compare button remains disabled when list size != 2.
  - `tests/unit/components/comparison-drawer.spec.ts`
- `CBC-COMPARISON-004`: compare action navigates when exactly two IDs exist.
  - `tests/unit/components/comparison-drawer.spec.ts`
- `CBC-COMPARISON-005`: tab auto-switches to favourites when comparison list is empty.
  - `tests/unit/components/comparison-drawer.spec.ts`

- `BB-APP-001`: global schema and canonical mount points remain.
  - `tests/unit/source-guards/route-seo.contract.spec.ts`
- `BB-SEARCH-001`: `/search` canonical + robots logic remains.
  - `tests/unit/source-guards/route-seo.contract.spec.ts`
- `BB-DETAIL-001`: detail canonical remains route-based.
  - `tests/unit/source-guards/route-seo.contract.spec.ts`
- `BB-DETAIL-002`: detail resource-type branching remains.
  - `tests/unit/source-guards/route-seo.contract.spec.ts`
- `BB-DETAIL-UX-001`: manifestations section renders when manifestations exist.
  - `tests/unit/components/work-view-avefi.spec.ts`
- `BB-DETAIL-UX-002`: manifestation/item filter narrows result set.
  - `tests/unit/components/work-view-avefi.spec.ts`
- `BB-DETAIL-UX-003`: parts fallback renders when manifestations are absent.
  - `tests/unit/components/work-view-avefi.spec.ts`
- `BB-AUTH-MW-001`: `/protected/*` can be bypassed in local dev per runtime flag.
  - `tests/unit/middleware/auth-global.spec.ts`
- `BB-AUTH-MW-002`: `/admin/*` unauthenticated redirect remains enforced.
  - `tests/unit/middleware/auth-global.spec.ts`
- `BB-AUTH-MW-003`: `/admin/*` is allowed only after session resolves a user.
  - `tests/unit/middleware/auth-global.spec.ts`

## API contract tests (Vitest)

- `API-INTERNAL-001`: `/press/manifest.json` returns JSON payload and sets `Content-Type`.
  - `tests/unit/api/internal/press-manifest.route.spec.ts`
- `API-INTERNAL-002`: `/press/manifest.json` returns 500 contract on read failure.
  - `tests/unit/api/internal/press-manifest.route.spec.ts`
- `API-INTERNAL-003`: `/api/press-kit.zip` HEAD returns zip headers + 200 + empty body.
  - `tests/unit/api/internal/press-kit.api.spec.ts`
- `API-INTERNAL-004`: `/api/press-kit.zip` GET returns assembled zip when assets exist.
  - `tests/unit/api/internal/press-kit.api.spec.ts`
- `API-INTERNAL-005`: `/api/press-kit.zip` surfaces missing-asset failure contract.
  - `tests/unit/api/internal/press-kit.api.spec.ts`

- `API-OUTBOUND-001`: `/api/elastic/suggestions` query mode normalizes external ES buckets.
  - `tests/unit/api/outbound/elastic-suggestions.api.spec.ts`
- `API-OUTBOUND-002`: `/api/elastic/suggestions` returns `success:false` on missing outbound config.
  - `tests/unit/api/outbound/elastic-suggestions.api.spec.ts`
- `API-OUTBOUND-003`: `/api/elastic/suggestions` facet mode unknown facet returns empty success shape.
  - `tests/unit/api/outbound/elastic-suggestions.api.spec.ts`
- `API-OUTBOUND-004`: `/api/elastic/get_work_by_id` forwards IDs to external client and returns hits.
  - `tests/unit/api/outbound/elastic-get-work-by-id.api.spec.ts`
- `API-OUTBOUND-005`: `/api/elastic/get_work_by_id` returns `null` on outbound failure.
  - `tests/unit/api/outbound/elastic-get-work-by-id.api.spec.ts`

## Gaps intentionally left for next increment

- Detail page interaction tests for anchor navigation and manifestation/item filtering.
- Domain-specific discoverability rule tests once stable fixtures are introduced:
  - direct ID/API lookup can reveal records not discoverable via generic search/facet paths.
