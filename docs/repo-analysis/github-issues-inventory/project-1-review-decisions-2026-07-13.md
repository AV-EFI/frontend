# Project 1 Review Decisions - 2026-07-13

Source batch: `project-1-review-batches.md`

This note records live GitHub updates made during the third consolidation pass. Generated inventory, classification, cross-check, and review-batch files were refreshed after the updates.

## Refreshed GitHub Snapshot

- Project 1 items exported: `145`
- Open issues in project snapshot after consolidation: `67`
- Closed issues in project snapshot after consolidation: `78`
- Missing labels after consolidation: `18`
- Missing project status after consolidation: `49`

No repository product code was changed.

## Automation Update

- Updated `scripts/github-project-cross-check.mjs` to exclude `.output/**` and `public/**` from local evidence searches.
- Reason: the cross-check was spending time on generated build output and large public assets that do not provide useful issue-evidence matches.

## GitHub Updates Applied

Duplicate/orphan consolidation:

- Initially kept `AV-EFI/AVefi-Issues#218` as the canonical `SEARCH-01: Facet result count must always match returned hits` issue.
- Assigned `#218` to `steffolino`, added it to Project 1, and set Project status to `Backlog`; it was later closed in the same triage pass because the original bug was confirmed fixed.
- Commented on `#218` with the consolidation rationale.
- Commented on and closed `AV-EFI/AVefi-Issues#219` as an exact duplicate of `#218`.
- Commented on and closed `AV-EFI/AVefi-Issues#217` as a malformed transferred duplicate/orphan:
  - its title duplicates closed `#220`;
  - its body describes export-format work already represented by open `#150` and historical closed `#221`;
  - it was not added to Project 1.
- Preserved the useful read-only scope note from `AV-EFI/AVefi-Issues#216` on canonical `AV-EFI/AVefi-Issues#49`.
- Commented on and closed `#216` as a duplicate of `#49`.
- Confirmed the Project 1 item for closed `#216` is already in `Done`.

Frontend triage after user review:

- Commented on `AV-EFI/AVefi-Issues#128`: usability-test pain points have been handled and multi-tab sync is implemented; remaining step is a satisfaction/acceptance check.
- Commented on `AV-EFI/AVefi-Issues#169`: keep open pending domain-expert feedback; link to related search/facet issue remains important because query search still needs checking.
- Commented on `AV-EFI/AVefi-Issues#155`, added `Backend` label, and routed as backend/search behavior pending backend-colleague feedback.
- Commented on `AV-EFI/AVefi-Issues#201`: keep open as low-priority carousel-link issue.
- Commented on and closed `AV-EFI/AVefi-Issues#203`: current behavior is acceptable for now; create a new issue later if facets become truly multilingual.
- Commented on and closed `AV-EFI/AVefi-Issues#166`: needs a broader overview of open work and APs before new concrete issues are created.
- Commented on `AV-EFI/AVefi-Issues#206`: keep open pending colleague feedback on license decision.
- Commented on and closed `AV-EFI/AVefi-Issues#188`: initial automated test base is implemented; future expansion should happen through specific follow-ups.
- Commented on and closed `AV-EFI/AVefi-Issues#218`: original facet/count mismatch was fixed.
- Commented on `AV-EFI/AVefi-Issues#187`: keep open as low priority.

Follow-up triage from user review:

- Commented on and closed `AV-EFI/AVefi-Issues#64`: concrete related issue `#218` was confirmed fixed; create specific new facet issues if needed.
- Commented on `AV-EFI/AVefi-Issues#171`: no acute frontend review need; can remain open as content/FAQ topic.
- Commented on `AV-EFI/AVefi-Issues#206`: keep open pending `EOltmanns` license feedback; assignee was already set.
- Commented on `AV-EFI/AVefi-Issues#128` and added `tennismann3000` as assignee for final acceptance of the navigation/multi-tab-sync behavior.
- Commented on `AV-EFI/AVefi-Issues#169`: keep open for `C-Stemmler` and `tennismann3000`, especially query-search review.
- Commented on `AV-EFI/AVefi-Issues#201`: keep open as very low priority.
- Commented on `AV-EFI/AVefi-Issues#187`: keep open as very low priority.
- Commented on `AV-EFI/AVefi-Issues#155`: keep with `EOltmanns` / Backend-Search pending feedback.
- Commented on and closed `AV-EFI/AVefi-Issues#212`: initial setup performance problems are no longer an active backlog item.
- Commented on and closed `AV-EFI/AVefi-Issues#98`: partially implemented; future data-quality/completeness work should consider it without keeping this separate issue open.

Owner-routing partial pass:

- Commented on and closed `AV-EFI/AVefi-Issues#102`: obsolete; relevant manifestation and item parts are implemented.
- Commented on and closed `AV-EFI/AVefi-Issues#107`: multilingual issuer fields are deferred until multilingual Elasticsearch fields exist; current behavior remains German.
- Confirmed `AV-EFI/AVefi-Issues#149` was already closed by user and is in `Done`.
- Commented on `AV-EFI/AVefi-Issues#147`, added `Backend` and `B L O C K E D`: blocked by authentication, editorial UI, and match-and-merge detection; likely needs a future concrete match-and-merge issue.
- Commented on `AV-EFI/AVefi-Issues#155`: remains open with `EOltmanns` / Backend-Search; fuzzy-search history should stay linked, especially `#110`.

Final owner-routing notes from the same consolidation session:

- Commented on and closed `AV-EFI/AVefi-Issues#199`: not continued as actionable backlog item.
- Commented on and closed `AV-EFI/AVefi-Issues#66`: obsolete; relevant pieces continue under expert-mode work.
- Confirmed `AV-EFI/AVefi-Issues#99` was already closed by user and is in `Done`.
- Commented on and closed `AV-EFI/AVefi-Issues#101`: data-quality facet work depends on unresolved domain discussion around editorial UI and QA.
- Confirmed `AV-EFI/AVefi-Issues#104`, `#106`, and `#120` were already closed by user and are in `Done`.
- Do not re-triage `#155` or `#156` in the next session unless new information arrives; their routing is already decided.

## Current Follow-Up Queue

The refreshed frontend triage now starts with:

- `AV-EFI/AVefi-Issues#128` - still needs acceptance criteria and navigation/search-detail UX decision.
- `AV-EFI/AVefi-Issues#169` - active search/facet work; avoid review edits unless owner asks.
- `AV-EFI/AVefi-Issues#201` - linked active carousel issue; keep as context.
- `AV-EFI/AVefi-Issues#206` - legal/meta license consolidation; route out of frontend implementation triage.
- `AV-EFI/AVefi-Issues#187` - maintenance-banner issue; already routed/commented on 2026-07-06.
- `AV-EFI/AVefi-Issues#171` - FAQ/content issue; needs manual check because code evidence search is weak.

Owner-routing decisions covered in this pass: `#102`, `#107`, `#147`, `#149`, `#155`, `#199`, `#66`, `#99`, `#101`, `#104`, `#106`, and `#120`. `#156` remains as-is and assigned; do not re-open it for triage.
