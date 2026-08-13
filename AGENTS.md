# AVefi Agent Guide

Nuxt/Vue frontend plus Nitro server for AVefi. Preserve user worktree changes and keep context loading task-scoped.

## Context Budget

Start with the files directly touched by the task, nearby tests, and the narrow source references below. Expand only when behavior, wording, or ownership is unclear.

For UX, design, domain, or search work, read the relevant subset:

- Product/UX: `UX.md`, `docs/ux/interaction-patterns.md`, `docs/ux/accessibility.md`
- Visual UI: `DESIGN.md`, `assets/scss/main.scss`, `tailwind.config.ts`, `tailwind.colors.ts`, current shared components
- Architecture/behavior: `docs/repo-analysis/architecture.md`, `docs/repo-analysis/behavior-baseline.md`, `docs/repo-analysis/component-behavior-contracts.md`
- Component handover/audit: `docs/components/handover-audit.md`, then the specific `docs/components/*.md`
- Domain/schema: `models/interfaces/schema/*`, current API implementation and tests, then `docs/repo-analysis/**`
- Copy/terms: Gestaltungshandbuch export when available, then `i18n/**`, `data/glossary.ts`, `assets/data/vocab.json`, `server/assets/vocab/*`

## Guardrails

- Do not invent product, domain, UX, brand, language, or visual-design decisions.
- Do not treat screenshots, mockups, or handbook examples as implemented behavior.
- Do not manually edit generated schema/docs unless explicitly requested and the generation path is known.
- Do not add dependencies for documentation-only work.
- Mark conflicts and unresolved handbook gaps explicitly.

## Handbook

Live Gestaltungshandbuch was checked on 2026-07-27 and returned `403 Forbidden`. Newest inspected export: `C:\Users\StretzS\e\AVefi Gestaltungshandbuch_91cad766ce0542d3af60cf39cce1163a-270726-1208-20.pdf`, dated 2026-05-13, marked "Work in Progress"; do not assume it is current.

AVefi is open scientific infrastructure, not a marketing platform. Platform rules bind `av-efi.net`, search, detail pages, FAQ, glossary, UI/help/error text, export, and comparison. Keep product copy factual, friendly, precise, understandable, inclusive, low-barrier, and free of emojis, advertising language, unclear abbreviations, or unexplained technical terms.

## Search/Detail Invariants

- Public search: `searchConfig_avefi.ts` plus `components/search/InstantSearchTemplateAVefi.vue`.
- `/search` canonical/robots: `pages/search/index.vue`.
- Detail route: `/res/:prefix/:id` in `pages/res/[prefix]/[id].vue`.
- `has_access_status` stays blacklisted from advanced-search facet selection but may render when backend data includes it.
- Comparison navigation requires exactly two records.

## Definition of Done

- Start every change by checking `git status --short`, naming the intended scope, and inspecting the current implementation and nearest tests before editing.
- Keep the patch surgical: no opportunistic refactors, copy rewrites, formatting churn, dependency upgrades, generated output, or config changes outside the stated scope.
- Make the smallest complete fix, but do not stop at the first green path. Check edge cases, failure states, empty/loading states, accessibility, localization, SEO, API contracts, and route behavior when the touched surface can affect them.
- Treat every change as reviewable production work: readable names, no dead code, no hidden assumptions, no unexplained magic values, and no comments that merely narrate obvious code.
- For dependency and security work, use the dedicated repo scripts when available, inspect `yarn why` paths, compare `package.json` and `yarn.lock` diffs, avoid unrelated major upgrades, run `corepack yarn install`, and require `corepack yarn npm audit --recursive --json` to exit cleanly unless a remaining advisory is explicitly documented with a reason.
- For UI work, verify responsive behavior, keyboard/focus behavior, contrast-sensitive states, text overflow, loading/error/empty states, and consistency with `DESIGN.md`, `UX.md`, and existing components.
- For search, detail, comparison, SEO, robots, sitemap, schema.org, auth, or API behavior, run the closest unit/contract/e2e coverage and inspect the relevant invariant files listed above.
- Treat warnings as findings: fix them when they are in scope; otherwise confirm they predate the change and call them out in the handoff.
- Do not hand-edit generated files or reports unless explicitly intentional; prefer regenerating from the known script and note the command used.
- Do not claim success until verification has run. If a required check cannot run, state the blocker, the risk, and the best substitute check.
- Before final handoff, summarize changed files, verification commands with results, skipped checks, warnings, and residual risk.

## Testing

Use targeted tests for code changes: `corepack yarn lint`, `corepack yarn test:unit`, `corepack yarn test:e2e:smoke`, `corepack yarn test:e2e:api`. For documentation-only changes, inspect changed markdown; skip production builds unless requested. For dependency or security changes, also run `corepack yarn install` and `corepack yarn npm audit --recursive --json`.
