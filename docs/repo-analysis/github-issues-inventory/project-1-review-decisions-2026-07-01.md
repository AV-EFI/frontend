# Project 1 Review Decisions - 2026-07-01

Source batch: `project-1-review-batches.md`

These notes record the manual review decisions from the first frontend-triage batch. They are intentionally separate from the generated review batch so the generated evidence can be reproduced without overwriting human decisions.

## Confirmed GitHub Checks

- `AV-EFI/AVefi-Issues#124` is closed on GitHub. Closed at: `2026-07-01T06:27:55Z`.
- Glossary/vocabulary search found no separate obvious "real glossary" issue beyond `AV-EFI/AVefi-Issues#111`.
- Export-field search confirms `AV-EFI/AVefi-Issues#150` as the likely successor/definition issue for `AV-EFI/frontend#2`.

## GitHub Updates Applied

- Commented on `AV-EFI/AVefi-Issues#128`: https://github.com/AV-EFI/AVefi-Issues/issues/128#issuecomment-4851274692
- Re-commented on `AV-EFI/AVefi-Issues#128` with German umlauts/typographic characters: https://github.com/AV-EFI/AVefi-Issues/issues/128#issuecomment-4851356707
- Commented on `AV-EFI/AVefi-Issues#166`: https://github.com/AV-EFI/AVefi-Issues/issues/166#issuecomment-4851274570
- Commented on `AV-EFI/frontend#2`: https://github.com/AV-EFI/frontend/issues/2#issuecomment-4851274426
- Closed `AV-EFI/AVefi-Issues#111` with a short implementation note.
- `AV-EFI/frontend#2` was closed after linking/routing the open definition work to `AV-EFI/AVefi-Issues#150`. Closed at: `2026-07-01T07:06:05Z`.
- `AV-EFI/frontend#10` was already closed as deprecated. Closed at: `2026-07-01T06:37:40Z`.

## Frontend Triage Decisions

| Issue | Decision | Next action |
| --- | --- | --- |
| `AV-EFI/AVefi-Issues#124` | Done and closed. | Remove from active frontend triage in the next refreshed inventory. |
| `AV-EFI/AVefi-Issues#128` | Keep. Interesting UX problem: preserve context between search results and detail view. | Draft product/UX proposal before implementation. |
| `AV-EFI/AVefi-Issues#169` | Active work. | Leave open; avoid cleanup edits unless requested by owner. |
| `AV-EFI/AVefi-Issues#155` | Active discussion. | Leave open; avoid cleanup edits unless requested by owner. |
| `AV-EFI/AVefi-Issues#201` | Edited and referenced from an actively discussed issue. | Keep as linked context; no standalone cleanup action for now. |
| `AV-EFI/AVefi-Issues#166` | Keep, but restructure. It should become a container/epic for AVefi user-interaction features. | Rewrite into a clean parent issue; split pasted ideas into child issues or checklist sections. |
| `AV-EFI/AVefi-Issues#206` | Low priority; postponed by colleague. | Keep open, route out of frontend triage; mark as low-priority legal/meta cleanup. |
| `AV-EFI/AVefi-Issues#111` | Close. Vocabulary feature is implemented in app. | Close with implementation note; no separate glossary issue found in current GitHub search. |
| `AV-EFI/frontend#2` | Closed. Export-field definition remains tracked in `AV-EFI/AVefi-Issues#150`. | Remove from active frontend triage in the next refreshed inventory. |
| `AV-EFI/frontend#10` | Closed as deprecated. | Remove from active frontend triage in the next refreshed inventory. |

No `AV-EFI/frontend` issue from this frontend-triage batch remains pending.

## Issue `#128` UX Direction

Current code evidence:

- Search result work links use new tabs in `components/search/SearchListViewComp.vue`.
- Flat search result links use new tabs in `components/search/SearchListFlatComp.vue`.
- Item-level detail navigation also opens new tabs in `components/search/ManifestationListSplitView.vue` and `components/search/SearchListFlatComp.vue`.

Recommended concept:

1. Preserve the search URL as a first-class "return context" when opening a detail page.
2. Add a visible "Zurück zur Suche" action on detail pages when that context exists.
3. Keep existing new-tab behavior as an option, but provide a same-tab path for users who want a connected workflow.
4. Preserve scroll/result position by storing the selected result handle and current search URL in `sessionStorage`, or by passing a compact `fromSearch`/`result` query parameter to the detail route.
5. If scope grows, consider a search-result side panel or split view as a later enhancement, not the first implementation.

Suggested comment for `#128`:

```md
Review note from backlog cleanup:

This should stay open. The current UI mostly opens detail pages in a new tab, which avoids losing the search result list but breaks the perceived connection between search context and detail context.

Suggested direction:
- preserve the current search URL/result handle when opening a detail page
- show a "Zurück zur Suche" action on detail pages when search context exists
- keep the new-tab behavior available, but add a same-tab connected workflow
- preserve scroll/result position via `sessionStorage` or a compact query parameter

Implementation should avoid changing search semantics; this is mainly navigation/context preservation.
```

## Issue `#111` Glossary/Vocabulary Finding

Local implementation evidence:

- `pages/vocab.vue` exposes the vocabulary page and forwards query/hash state into the viewer.
- `components/global/VocabViewer.vue` implements searchable/filterable vocabulary browsing via `/api/cms/vocab`.
- `components/global/GlossaryTermComp.vue` implements inline glossary tooltip/more-info behavior.
- `i18n/locales/de.ts` and `i18n/locales/en.ts` include vocabulary/glossary labels and SEO metadata.

GitHub search finding:

- Current search for glossary/vocabulary terms finds `AV-EFI/AVefi-Issues#111` as the only obvious open glossary integration issue.
- No separate open "real glossary definition" issue was found.

Suggested closing comment for `#111`:

```md
Closing during backlog cleanup: the vocabulary/glossary feature is implemented in the app.

Implementation evidence:
- `/vocab` page with searchable vocabulary view
- `GlobalVocabViewer` backed by `/api/cms/vocab`
- inline glossary/tooltip component support
- DE/EN vocabulary and glossary labels/SEO metadata

I did not find a separate open issue for a broader editorial "real glossary" definition. If that content-definition work is still needed, it should be tracked as a new product/editorial issue rather than keeping this implementation issue open.
```

## Issue `frontend#2` Export Finding

Local implementation evidence:

- `components/global/ExportDataComp.vue` supports CSV, JSON, and XML downloads.
- It currently flattens selected dataset data into export rows.
- Locale copy states that CSV/table export exists and JSON is still under consideration.

Successor/definition issue:

- `AV-EFI/AVefi-Issues#150` - `EXPORT-01: Exportfunktionen für Werk-, Manifestations- und Item-Daten definieren und vereinheitlichen`
- The body excerpt explicitly says field sets must still be defined for Werk, Manifestation, Item, and quick result exports.

Suggested comment for `AV-EFI/frontend#2`:

```md
Backlog cleanup note:

This older frontend issue appears to be superseded by / dependent on `AV-EFI/AVefi-Issues#150`.

The frontend already has a technical export component (`ExportDataComp`) for CSV/JSON/XML, but the unresolved part is product/domain definition: which fields should be exported for Werk, Manifestation, Item, and quick result exports. That definition is now tracked more precisely in `#150`.

Recommendation: keep this issue only as historical context or close it in favor of `#150` once the team agrees.
```

## Issue `#166` Restructure Suggestion

Suggested direction:

- Convert the issue into a parent/container for "user interaction features".
- Keep only scope, motivation, and child issue links in the parent body.
- Split ideas into child issues:
  - personal collections/lists
  - export workflows for curated lists, linked to `#150`
  - dataset-quality feedback
  - annotations or notes
  - account/session/storage implications

Suggested comment for `#166`:

```md
Backlog cleanup note:

This should probably stay open, but as a container/epic rather than a single implementable issue. The current body reads like collected ideas for user interaction features.

Suggested restructure:
- keep this as parent/container for AVefi user-interaction features
- move concrete features into child issues or checklist sections
- explicitly separate public-release scope from later research workflow ideas
- link export-related workflow ideas to `AV-EFI/AVefi-Issues#150`
```
