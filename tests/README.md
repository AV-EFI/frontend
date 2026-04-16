# Frontend Test Skeleton

This folder is the first regression safety-net scaffold mapped to:

- `docs/repo-analysis/behavior-baseline.md`
- `docs/repo-analysis/component-behavior-contracts.md`

## Structure

- `tests/e2e/`: Playwright smoke + SEO behavior checks
- `tests/e2e/api/`: live backend contract suites (OpenAPI/search/detail/negative/edge)
- `tests/e2e/seo/`: SEO + sitemap runtime route/API checks
- `tests/e2e/utils/`: strict runtime payload validators used by e2e suites
- `tests/data-quality/`: Elasticsearch data-quality reporting checks (report-first, low strictness)
- `tests/unit/components/`: component-level interaction tests with Vue Test Utils
- `tests/unit/api/internal/`: API contract tests for Nuxt-owned handlers
- `tests/unit/api/outbound/`: API wrapper tests for calls that fan out to external services (Python backend / ES)
- `tests/unit/source-guards/`: Vitest contract guards against critical source-level regressions

## Commands

- `yarn test`: run all Vitest tests from `tests/unit`
- `yarn test:unit`: run unit contract guards
- `yarn test:unit:watch`: watch-mode unit contract guards
- `yarn test:data-quality`: run Elasticsearch data-quality report suite
- `yarn test:data-quality:watch`: run data-quality suite in watch mode
- `yarn test:data-quality:report`: run data-quality suite with verbose reporter output
- data-quality runs write a human-readable markdown report to `logs/data-quality/quality-statistics.md` (gitignored)
- data-quality also writes `logs/data-quality/quality-snapshot.json` to show trend deltas between runs
- data-quality also writes stakeholder-specific report views under `logs/data-quality/stakeholders/` for frontend-ux, backend, data-engineer, project-manager, and data-delivering-institutions
- data-quality checks are report-only and non-blocking by design, and they are not part of CI deploy lanes
- `yarn test:e2e:list`: list Playwright tests
- `yarn test:e2e`: run Playwright tests
- `yarn test:e2e:smoke`: browser smoke + SEO canonical tests
- `yarn test:e2e:api`: backend OpenAPI contract suite
- `yarn test:e2e:api:edge`: backend edge-case contract suite
- `yarn test:e2e:api:openapi`: OpenAPI document/path/schema checks
- `yarn test:e2e:api:detail`: detail endpoint contract checks
- `yarn test:e2e:api:search`: search endpoint contract checks
- `yarn test:e2e:api:search-matrix`: sitemap-derived search URL matrix checks
- `yarn test:e2e:api:negative`: invalid request/path negative checks
- `yarn test:e2e:api:health`: health endpoint checks
- `yarn test:ci:fast`: required lint + unit lane used in CI
- `yarn test:ci:lint`: lint-only helper command
- `yarn test:ci:api`: backend API contract lane used in CI

## Human-readable suite guide

If you are new to this suite, read it as follows:

- Unit and e2e tests protect product behavior and API contract behavior.
- Data-quality tests are report-first and non-blocking by design.
- `[OK]` means within threshold, `[WARN]` means review soon, `[FAIL]` means prioritize investigation.
- Heuristic sections (for example placeholders or near-duplicates) indicate suspicious patterns, not guaranteed bugs.
- Start triage with high-volume sections and then drill down into sampled identifiers.

Recommended reading order after `yarn test:data-quality:report`:

1. `logs/data-quality/stakeholders/project-manager.md` for rollout-level deltas.
2. `logs/data-quality/stakeholders/data-engineer.md` for operational root-cause analysis.
3. `logs/data-quality/quality-failing-identifiers.md` for concrete record samples.

## Data-quality report guard tests

- `tests/unit/source-guards/stakeholder-report-generator.spec.ts`: smoke + section-presence contract test for stakeholder markdown generation.
- this test ensures all stakeholder files are created and include mandatory sections.

## Environment knobs

- `PLAYWRIGHT_BASE_URL`: override target app URL
- `PLAYWRIGHT_NO_WEBSERVER=true`: skip auto-starting `yarn dev:local`
- `E2E_DETAIL_PATH`: stable detail path used by smoke detail test
- `ES_BASE_URL` or `ELASTIC_HOST_INTERNAL`/`ELASTIC_HOST_PUBLIC`/`ELASTIC_HOST`: Elasticsearch host for data-quality reports
- `ES_INDEX` or `ELASTIC_INDEX`: Elasticsearch index name for data-quality reports
- `ES_API_KEY` or `ELASTIC_APIKEY`: optional Elasticsearch API key for data-quality reports
- `ELASTIC_GWDG_HOST` and `ELASTIC_GWDG_INDEX`: legacy/fallback host + index keys also supported by data-quality reports
- `ES_COMPARE_BASELINE_INDEX`: optional baseline index for denormalised comparison report (default `21.11155-denormalised-work`)
- `ES_COMPARE_CANDIDATE_INDEX`: optional candidate index for denormalised comparison report (default `21.11155-denormalised-work-testbed`)

Default detail route:

- `/res/21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406`
