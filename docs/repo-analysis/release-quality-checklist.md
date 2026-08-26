# Release Quality Checklist

Use this checklist before merging or deploying changes. Pick the lane that matches the touched surface, then report the commands, skipped checks, warnings, and residual risk in the handoff.

## Always

- Check `git status --short` before editing and before handoff.
- Inspect the nearest tests before changing behavior.
- Keep generated files out of manual edits unless the generation path is known.
- Run `git diff --check` before handoff.

## Docs Only

```sh
git diff --check
```

Also inspect the changed Markdown for stale links, invented product rules, or unresolved handbook gaps.

## UI Component Or Page Behavior

```sh
corepack yarn lint
corepack yarn test:unit
```

Add or update the nearest Vitest component/source-guard test for changed behavior. For public route behavior, also run the closest Playwright smoke.

## Search, Detail, Comparison, SEO, Or API Behavior

```sh
corepack yarn lint
corepack yarn test:unit
corepack yarn test:e2e:smoke
corepack yarn test:e2e:api
corepack yarn test:e2e:api:edge
```

If the local backend is unavailable, document the failed endpoint, whether Docker/VPN was checked, and the best deployed-target substitute.

## Accessibility-Sensitive UI

```sh
corepack yarn audit:accessibility
```

Also manually check keyboard navigation, focus visibility, responsive layout, and text overflow for the changed surface.

## Localization Or Public Copy

```sh
corepack yarn lint
corepack yarn test:unit
```

Check both `de` and `en` locale keys for public labels, headings, errors, help text, empty states, and SEO metadata.

## Dependency Or Security Work

```sh
corepack yarn install
corepack yarn lint
corepack yarn test:unit
corepack yarn npm audit --recursive --json
```

Use the dedicated weekly security scripts when the work is security/dependency maintenance rather than a narrow package fix.

## Typecheck Triage

```sh
corepack yarn typecheck
```

`test_typecheck` is currently a CI job. Treat a clean local run as a release-readiness signal; if it fails, summarize the first real error after the wrapper's known false-positive/generated-file filters.

Current local triage on 2026-08-26: `corepack yarn typecheck` returned `0 error(s)` after filtering 127 known false-positive/generated-file blocks.

## Data Quality

```sh
corepack yarn test:data-quality:report
```

Use this for Elasticsearch data-shape, completeness, vocabulary, duplicate, or stakeholder-report changes. The lane is report-first unless an agreed severe threshold has been made blocking.
