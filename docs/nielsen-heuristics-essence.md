# Nielsen Heuristics Essence

This branch carries the low-risk parts of `feature/ux-heuristics-update` onto the current codebase instead of merging the old branch wholesale.

## Applied Focus

- Visibility of system status: labelled search loading state and immediate screen-reader no-results feedback.
- Match with user expectations: corrected comparison/favourites count labels.
- Error prevention and recovery: less misleading dropdown state and localized export/form feedback.
- Consistency and standards: reusable accessible loading spinner and labelled raw-data disclosure.
- Aesthetic/minimalist cleanup: removed production console logging from merge/editor flows.

## Deferred

- Full old-branch merge, because conflict simulation reported conflicts in `.gitlab-ci.yml`, `components/detail/HasEventComp.vue`, `components/search/InstantSearchTemplateAVefi.vue`, `components/search/SearchHitsComp.vue`, `error.vue`, and `package.json`.
- Larger interaction patterns from the old branch, such as confirmation modals, undo toasts, active filter bars, and full search template loading-state refactors.
