# AVefi Documentation Index

This directory contains implementation, architecture, UX, design, and generated component documentation for the AVefi frontend.

## Start Here

- `../UX.md`: product purpose, domain model, terminology, source order, UX rules, and open UX questions.
- `../DESIGN.md`: implemented visual tokens, theme files, shared design classes, handbook alignment, and unresolved design conflicts.
- `../AGENTS.md`: repository guidance for AI coding agents and contributors who need a fast context map.
- `ux/`: focused UX notes for accessibility, interaction patterns, research evidence, handbook alignment, and decision records.
- `repo-analysis/`: architecture, behavior contracts, testing strategy, schema/generation notes, and implementation risks.
- `visual-ui-audit.md`: current visual UI audit and implementation notes.
- `components/`: refreshed static source summaries for current Vue components; start with `components/handover-audit.md` and verify behavior against source and tests.
- `composables/`: generated or semi-generated API-style documentation; verify against source before relying on freshness.

## UX And Design Docs

- `ux/accessibility.md`: current accessibility claim, tested coverage, implementation rules, and gaps.
- `ux/interaction-patterns.md`: documented behavior for search, filters, detail pages, navigation, drawers, comparison, favourites, and vocabulary.
- `ux/research-findings.md`: evidence inventory and explicit statement of missing user research.
- `ux/handbook-alignment.md`: extracted implementation-relevant rules from the AVefi Gestaltungshandbuch export and unresolved alignment questions.
- `ux/decisions/`: place accepted UX/design/domain decision records here.

## Developer Handover

Recommended first pass for new developers:

1. `../README.md` for local setup, test commands, and operational workflow.
2. `../UX.md` for product purpose, domain model, terminology, and UX constraints.
3. `../DESIGN.md` for implemented theme, shared visual classes, and handbook conflicts.
4. `repo-analysis/architecture.md` for runtime architecture and data flow.
5. `repo-analysis/behavior-baseline.md` for current app behavior before refactoring.
6. `components/handover-audit.md` for handover-critical components, shared classes, generated docs, and test anchors.
7. `repo-analysis/test-contract-mapping.md` and `../tests/README.md` for coverage and test lanes.

## Source Discipline

Use source files and accepted docs as the source of truth. Do not infer implemented behavior from screenshots, mockups, handbook examples, or generated docs without checking the current code.
