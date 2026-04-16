# Testing Strategy

## Current state

The repository now has a first working regression safety net.

What exists now:

- Unit tests (`Vitest`) for:
  - component interaction contracts
  - locale-backed label/value rendering contracts (`de` + `en`) for key detail components
  - middleware contracts
  - API handler contracts split into:
    - internal Nuxt handlers
    - outbound wrapper/proxy handlers (external backend/ES/CMS calls mocked)
- E2E smoke and SEO tests (`Playwright`) for:
  - home/search/detail route reachability
  - search canonical + robots behavior
  - sitemap-listed search/detail URL smoke with direct API endpoint verification (`/api/elastic/*`)
  - strict live detail payload validation against local elastic mapping for property-level schema drift detection
  - runtime search-endpoint response validation (enabled when search executes via browser POST in active profile)
  - direct backend Swagger contract smoke (`/rest/v1/openapi.json`, `/frontend/search`, `/frontend/view/{prefix}/{id_}`)
  - public routes (`faq`, `press`, `vocab`)
  - auth redirect behavior (`/admin/*`)
  - compare URL-state basics
  - press asset endpoint availability
- source-guard contract tests to protect high-risk behaviors during refactors
- source-guard contract test for stakeholder report generation (`tests/unit/source-guards/stakeholder-report-generator.spec.ts`)
- node-based script tests under `scripts/tests/` remain available
- data-quality reporting lane with:
  - root, manifestation, item completeness and anomaly checks
  - advanced heuristics (integrity, vocabulary, consistency, placeholder/duplicate patterns)
  - denormalised index comparison between baseline and testbed
  - failing identifier sample export for investigation
  - stakeholder-specific markdown outputs

Current scripts:

- `yarn test`
- `yarn test:unit`
- `yarn test:unit:watch`
- `yarn test:e2e`
- `yarn test:e2e:smoke`
- `yarn test:e2e:list`
- `yarn test:e2e:api`
- `yarn test:e2e:api:edge`
- `yarn test:e2e:api:openapi`
- `yarn test:e2e:api:detail`
- `yarn test:e2e:api:search`
- `yarn test:e2e:api:search-matrix`
- `yarn test:e2e:api:negative`
- `yarn test:e2e:api:health`
- `yarn test:ci:fast`
- `yarn test:ci:lint`
- `yarn test:ci:api`
- `yarn test:data-quality`
- `yarn test:data-quality:report`
- `yarn test:data-quality:watch`
- `npm run test:normdata`

## Recommended scheme

Use a three-layer strategy plus one separate data-quality lane.

### 1. Unit tests

Tooling:

- `vitest`
- `@vue/test-utils`
- `happy-dom` or `jsdom`

Target first:

- pure utils in `utils/`
- pure helpers in `composables/`
- Pinia stores in `stores/`
- schema/path helpers in `server/utils/`

Good first files:

- `composables/useCurrentUrlState.ts`
- `composables/useSearchHistory.ts`
- `composables/useSearchSuggestions.ts`
- `composables/useNormdataUrl.ts`
- `utils/highlight.ts`
- `utils/getDataSet.ts`
- `server/utils/pathMapping.ts`
- `server/utils/fallbackStore.ts`

### 2. Integration tests for Nitro handlers

Tooling:

- `vitest`
- `@nuxt/test-utils` for Nuxt/Nitro-aware bootstrapping

Test with mocked dependencies, not live Elasticsearch.

Target first:

- `server/api/mail/contact.post.ts`
- `server/api/log/client.post.ts`
- `server/api/cms/modeltree.get.ts`
- `server/api/cms/modelhints.get.ts`
- `server/api/cms/usertooltips.get.ts`
- `server/api/poc/*`
- `server/api/elastic/*` wrappers with fetch mocked

The goal is to verify request validation, response shape, and error handling.

### 3. End-to-end tests

Preferred tooling:

- Playwright

Reason:

- the repo already lacks Cypress setup
- Playwright is strong for SSR + routing + preview-build testing
- it works well for "build once, test real routes" flows

Core smoke flows:

- home page loads and search mode switch works
- search page accepts a query and renders a result list
- detail page loads for a known stable handle
- compare page handles both invalid and valid query params
- press page renders and download links exist
- vocab page renders and search query state is synced
- unauthenticated access to `/protected/*` redirects away
- `/admin/*` is denied once auth is added

## Separate lane: data-quality and network smoke tests

Keep the current node-based tests, but treat them as a separate class:

- `scripts/tests/normdata-identifiers.test.mjs`
- `scripts/tests/suggest-normdata-matching.test.mjs`

These should not block fast unit-test feedback unless they are run against stable fixtures or a dedicated nightly job.

Current data-quality lane behavior:

- non-blocking/report-first by design (not part of required CI deploy gates)
- primary report: `logs/data-quality/quality-statistics.md`
- sampled failing identifiers: `logs/data-quality/quality-failing-identifiers.md`
- trend baseline: `logs/data-quality/quality-snapshot.json`
- stakeholder reports: `logs/data-quality/stakeholders/*.md`

Interpretation note for new contributors:

- `[OK]` = within threshold
- `[WARN]` = elevated risk, review and triage
- `[FAIL]` = strong regression signal, prioritize investigation
- heuristic sections are intentionally probabilistic and should be validated using sampled identifiers

## CI pipeline (implemented)

Configured in `.gitlab-ci.yml`:

- `test_unit_contracts`:
  - `yarn lint`
  - `yarn test:unit`
- `test_backend_api_contracts`:
  - `yarn test:e2e:api --workers=1 --reporter=list`
  - `yarn test:e2e:api:edge --workers=1 --reporter=list`
- `test_browser_smoke` (scheduled + optional manual on `testbed`):
  - installs Chromium
  - runs `yarn test:e2e:smoke --workers=1 --reporter=list`

Required gates (`test_unit_contracts`, `test_backend_api_contracts`) run for:

- merge request pipelines
- `testbed`
- `production`
- `deploy-prod` tag pipelines

Build and deploy jobs are therefore test-gated by stage order.

## Local dev and pre-push practice

There are currently no git hooks in this repo (`.husky/` is not present), so enforcement is CI-based.

Recommended local sequence before pushing:

- `yarn test:ci:fast`
- `yarn test:ci:api`
- optional standalone lint-only run: `yarn test:ci:lint`

## Rollout order

1. Keep contract mapping (`behavior-baseline.md` + `component-behavior-contracts.md` + `test-contract-mapping.md`) in sync with code changes.
2. Expand API contracts for remaining server routes (`cms`, `mail`, `log`, `poc`) with explicit internal-vs-outbound classification.
3. Add targeted fixture-based tests for domain discoverability rules (direct-ID/API lookup vs generic discoverability).
4. Add locale-focused UI tests for translated labels/property rendering (detail/search in `de` + `en`).
5. Add CI job split for unit/api/e2e smoke lanes to keep feedback fast.
6. Continue refactors only behind this safety net, extending tests before risky rewrites.
