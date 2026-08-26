# Software Quality Map

Snapshot date: 2026-08-26

This map turns the current testing strategy, behavior contracts, risks, and CI gates into a practical quality plan for the AVefi frontend. It is intentionally scoped to software quality. Product, domain, brand, language, and visual-design decisions still need accepted source documents before they become implementation rules.

## Quality Target

AVefi quality means the public infrastructure stays factual, stable, accessible, and explainable while the codebase remains safe to change.

The highest-value quality signals are:

- critical public flows keep working after every change
- backend and Elasticsearch contract drift is caught before users see it
- UX rules are encoded as reusable components, tests, and docs
- accessibility, localization, SEO, and data-quality behavior are checked where they affect public use
- warnings are triaged as quality findings, not ignored as console noise
- generated files, schema outputs, and hand-written source have clear ownership boundaries

## Current Quality System

Implemented quality controls:

- zero-warning ESLint gate via `yarn lint`
- Vitest unit and source-guard contract tests under `tests/unit`
- Playwright browser smoke, SEO, contact, production mail, and backend API suites under `tests/e2e`
- live backend OpenAPI/search/detail contract checks through `yarn test:e2e:api` and `yarn test:e2e:api:edge`
- report-first Elasticsearch data-quality suite through `yarn test:data-quality`
- unresolved import and unused-code auditing through `yarn knip:unresolved` and `yarn knip:audit`
- type checking through `yarn typecheck`
- dependency/security lane through `yarn security:weekly:test`
- image and contrast helper scripts through `yarn check:images` and `yarn check:contrast`
- public-route accessibility smoke through `yarn audit:accessibility`

CI gates:

- merge requests, `testbed`, `production`, and deploy tags run lint plus unit contracts
- backend API contracts run as required pipeline checks
- typecheck and unresolved/unused-code checks are present in CI; local triage on 2026-08-26 returned `0 error(s)` after filtering 127 known false-positive/generated-file blocks
- accessibility smoke runs as a required CI test-stage job for the same branch and merge-request set
- browser smoke and contact tests run after testbed deploys
- production SMTP and mail smoke tests run after production deploys
- data-quality reports are currently separate and intentionally non-blocking

Primary references:

- `testing-strategy.md`
- `test-contract-mapping.md`
- `behavior-baseline.md`
- `component-behavior-contracts.md`
- `issues-and-risks.md`
- `../ux/accessibility.md`
- `../../UX.md`
- `../../DESIGN.md`
- `../../tests/README.md`

## Protection Map

| Surface | Current signals | Quality gap | Next upgrade |
| --- | --- | --- | --- |
| Public search | Unit contracts for search components, Playwright smoke/SEO, backend search contract matrix | Coverage depends on selected stable URLs and captured endpoint behavior | Add fixture-backed tests for facet/query combinations that represent real user tasks and known backend edge cases |
| Detail pages | Route SEO guards, Playwright detail smoke, live payload validation against mapping | Interaction coverage is still thinner for anchors, branch-specific resource rendering, and empty states | Add targeted component/page tests for navigation anchors, manifestation/item filters, parts fallback, and missing data states |
| Comparison | Store tests, drawer tests, route smoke, exactly-two-items contract | Broader URL-state and malformed-input behavior could regress | Add negative/edge tests for duplicate IDs, missing IDs, stale persisted state, and unavailable records |
| FAQ, glossary, press, vocabulary | Public route smoke and selected API tests | Content freshness and locale completeness are not strongly enforced | Add locale completeness checks for public static/content routes and API-backed vocabulary rendering |
| SEO, robots, sitemap | Route source guards, Playwright canonical/robots checks, sitemap route/API smoke | Coverage is strong for `/search`, thinner for all public content surfaces | Extend canonical/robots assertions to detail, FAQ, vocab, press, and error surfaces where behavior is intentional |
| Accessibility | Source guards for selected semantics, accessibility doc, Playwright public-route smoke via `yarn audit:accessibility` | The automated smoke is intentionally basic; manual keyboard, screen-reader, and contrast checks are not scheduled | Add deeper axe/manual audit cadence for search, detail, comparison, drawers, contact, and vocabulary routes |
| Localization and copy | Locale-backed component tests for selected detail labels and values | Public copy drift is mostly review-based | Add focused i18n key coverage for public routes and high-risk error/help states |
| Backend and external contracts | Live backend OpenAPI/search/detail/edge Playwright suites, mocked outbound unit tests | Data-access boundary is inconsistent across client, Nitro, and backend | Standardize on Nitro/backend boundaries and keep contract tests attached to each migration step |
| Data quality | Report-first Elasticsearch data-quality reports and stakeholder summaries | Non-blocking reports can be missed unless someone owns triage | Add a scheduled triage ritual and fail only on agreed severe regression thresholds |
| Security and dependencies | Weekly security scripts, audit command, auth guard tests for current stopgaps | Typecheck and dependency audit outcomes need explicit release policy | Define which advisories block release, and move typecheck to required when current failures are gone |
| Generated assets and docs | Generation scripts and generated docs are documented | Generated outputs live beside hand-written source and can be edited accidentally | Add source-of-truth headers or ownership notes, then prefer regeneration over manual edits |

## Operating Model

For each change, choose the narrowest quality lane that covers the risk:

- docs-only: inspect changed markdown and run `git diff --check`
- UI component or page behavior: run `yarn lint`, targeted Vitest tests, and the nearest Playwright smoke when route behavior changes
- search/detail/comparison/SEO/API behavior: run targeted unit tests plus `yarn test:e2e:smoke` or the relevant `yarn test:e2e:api:*` command
- localization/copy behavior: run affected component tests and check both `de` and `en` keys
- dependency/security behavior: run `corepack yarn install`, `corepack yarn lint`, `corepack yarn test:unit`, and `corepack yarn npm audit --recursive --json`
- generated output: run the known generator, inspect generated diffs, and avoid hand-editing generated files

When a warning appears:

- fix it if it is in the touched surface
- document it if it predates the change and is outside scope
- add a regression test if it represents a repeatable failure mode

## Priority Roadmap

### 1. Make critical behavior cheaper to protect

- Keep `test-contract-mapping.md` synchronized whenever contracts or tests change.
- Add targeted tests for detail anchors, manifestation/item filtering, parts fallback, and empty data states.
- Add comparison edge-case tests for malformed query params, duplicate IDs, and stale persisted lists.
- Add fixture-backed search tests for representative query/facet combinations.

### 2. Strengthen release confidence

- Keep `yarn typecheck` as a CI release-readiness signal and move it to release-blocking once current failures stay clean.
- Decide whether `yarn knip:audit` should block all merge requests or only cleanup/security branches.
- Keep backend API contracts required for deployable branches.
- Add a short release checklist that names required commands by change type instead of relying on memory.

### 3. Close user-facing quality gaps

- Expand `audit:accessibility` beyond the current basic public-route smoke once the team agrees the deeper audit threshold.
- Add manual keyboard and responsive checks for search, detail, comparison, drawers, contact, and vocabulary routes.
- Expand locale coverage for public route copy, labels, error messages, empty states, and help text.
- Extend canonical/robots assertions beyond search where behavior is intentional.

### 4. Reduce architectural risk

- Standardize external data access so public UI paths cross one explicit server/backend boundary.
- Remove legacy runtime-config aliases after all consumers use canonical keys.
- Separate active public code from legacy, protected, and proof-of-concept surfaces where feasible.
- Clarify generated-file ownership with headers, docs, or regeneration-only workflow rules.

### 5. Make quality visible over time

- Keep data-quality reports report-first, but assign triage ownership and review cadence.
- Track recurring warnings and flaky tests as backlog items with owners.
- Treat unresolved handbook or domain gaps as explicit open questions, not implicit implementation license.
- Review this map after major search/detail/API/auth changes.

## Useful Baseline Commands

Fast local confidence:

```sh
corepack yarn lint
corepack yarn test:unit
```

Accessibility confidence:

```sh
corepack yarn audit:accessibility
```

Search/detail/API confidence:

```sh
corepack yarn test:e2e:smoke
corepack yarn test:e2e:api
corepack yarn test:e2e:api:edge
```

Security/dependency confidence:

```sh
corepack yarn install
corepack yarn lint
corepack yarn test:unit
corepack yarn npm audit --recursive --json
```

Data-quality reporting:

```sh
corepack yarn test:data-quality:report
```

## Done Means

A quality improvement is done when:

- the protected behavior is named in docs or tests
- the smallest relevant automated check exists or an explicit manual check is documented
- the change-type command lane has been run, or the blocker and substitute check are documented
- warnings and skipped checks are reported in the handoff
- no product, domain, UX, language, or brand rule has been invented without an accepted source
