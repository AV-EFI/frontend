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
- `yarn test:e2e:contact`: contact submit e2e test; inbox assertion is enabled only when `MAIL_ASSERT_API_BASE` is set
- `yarn test:e2e:contact:mailpit`: optional local delivery e2e test with Mailpit defaults
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

## Change Finalization Rule

For every code change:

1. Update/add tests for the changed behavior.
2. Run the impacted test suite locally.
3. Update docs and env knob documentation to match the current runtime status.

Security-specific expectation:

- Any auth/guard/mutation change must be covered by unit tests for both deny and allow paths.
- Current CMS mutation stopgap must remain covered by tests for:
  - disabled mode (`503`)
  - invalid origin/referer (`403`)
  - enabled + unauthenticated (`401`)

## Environment knobs

- `PLAYWRIGHT_BASE_URL`: override target app URL
- `PLAYWRIGHT_NO_WEBSERVER=true`: skip auto-starting `yarn dev:local`
- `MAIL_ASSERT_API_BASE`: optional inbox assertion API base for contact delivery e2e (for Mailpit typically `http://127.0.0.1:8025`)
- `MAIL_DELIVERY_MODE`: `log` or `smtp`; local/testbed defaults to `log`, so delivery e2e must set `MAIL_DELIVERY_MODE=smtp`
- `E2E_DETAIL_PATH`: stable detail path used by smoke detail test
- `ES_BASE_URL` or `ELASTIC_HOST_INTERNAL`/`ELASTIC_HOST_PUBLIC`/`ELASTIC_HOST`: Elasticsearch host for data-quality reports
- `ES_INDEX` or `ELASTIC_INDEX`: Elasticsearch index name for data-quality reports
- `ES_API_KEY` or `ELASTIC_APIKEY`: optional Elasticsearch API key for data-quality reports
- `ELASTIC_GWDG_HOST` and `ELASTIC_GWDG_INDEX`: legacy/fallback host + index keys also supported by data-quality reports
- `ES_COMPARE_BASELINE_INDEX`: optional baseline index for denormalised comparison report (default `21.11155-denormalised-work`)
- `ES_COMPARE_CANDIDATE_INDEX`: optional candidate index for denormalised comparison report (default `21.11155-denormalised-work`)
- `CMS_MUTATIONS_ENABLED`: enables CMS write endpoints (`/api/cms/usertooltips` `PUT`, `/api/cms/usertooltips_seed` `POST`), default `false`
- `CMS_MUTATION_ORIGIN_ALLOWLIST`: optional comma-separated extra origins allowed for CMS mutations (current request origin is always allowed)

## Contact Mail Production Checklist

Use this checklist before enabling real contact-mail delivery in production:

1. Set `MAIL_DELIVERY_MODE=smtp` in production runtime config.
2. Set SMTP endpoint to GWDG relay:
  - `MAIL_HOST=mailer.gwdg.de`
  - `MAIL_PORT=25`
  - `MAIL_SECURE=false`
  - `MAIL_REQUIRE_TLS=false` (unless your SMTP infrastructure explicitly requires STARTTLS)
3. Set sender and recipients:
  - `MAIL_FROM` (recommended, e.g. `noreply@av-efi.net`)
  - `MAIL_TO` (primary inbox)
  - `MAIL_TO_2` (optional copy)
4. Ensure no auth is configured unless explicitly required by infrastructure:
  - `MAIL_USER` and `MAIL_PASSWORD` can be unset for no-auth SMTP.
  - For Mailpit-based CI smoke checks, force `MAIL_USER` and `MAIL_PASSWORD` to empty values to avoid inherited CI secret variables.
5. Keep non-production in safe mode:
  - `NUXT_BUILD_PROFILE=local|testbed` should stay in `log` mode by default.
6. Validate before rollout:
  - run `yarn test:unit tests/unit/api/internal/contact.api.spec.ts`
  - run `yarn test:e2e:contact` for submit-path verification (default CI lane).
  - optionally run `yarn test:e2e:contact:mailpit` locally if you explicitly want inbox delivery verification.
7. Post-deploy smoke check:
  - submit one real contact message and confirm it arrives in `MAIL_TO`.

Default detail route:

- `/res/21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406`
