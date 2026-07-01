# Project 1 Review Batches

Generated: 2026-07-01T06:23:46.745Z

Project: [AVefi User Stories Kanban (ALL User Stories)](https://github.com/orgs/AV-EFI/projects/1)

## Snapshot

- Source items: 139
- Proposed review items: 21
- Batch size limit: 10
- GitHub changes made: none

## Batch Counts

| Batch | Count |
| --- | --- |
| Verification Candidates | 1 |
| Frontend Triage | 10 |
| Owner Routing | 10 |

## Verification Candidates

These are open issues with local evidence that may support a keep/close decision after manual acceptance review. Weak files such as scripts, docs, generated schema files, and generic i18n strings are separated from stronger runtime/test evidence.

| Issue | Bucket | State | Owner area | Evidence score | Strong evidence files | Proposed review action |
| --- | --- | --- | --- | --- | --- | --- |
| AV-EFI/AVefi-Issues#188 | qa_or_acceptance_needed | implemented | Accessibility/QA | 11 | .\composables\useSearchHistory.ts<br>.\playwright.config.ts<br>.\tests\README.md<br>.\tests\unit\api\outbound\msearch-all-facets.api.spec.ts | Review acceptance criteria against evidence; if product owner agrees, prepare a small close/comment batch. |

## Frontend Triage

These are open frontend-scope issues where the local evidence suggests either missing work or partial implementation.

| Issue | Bucket | State | Owner area | Evidence score | Strong evidence files | Proposed review action |
| --- | --- | --- | --- | --- | --- | --- |
| AV-EFI/AVefi-Issues#124 | qa_or_acceptance_needed | partial | Accessibility/QA | 14 | .\components\detail\PaginationComp.vue<br>.\components\global\BreadcrumbsComp.vue<br>.\components\global\ComparisonDrawer.vue<br>.\components\global\Footer.vue | Define remaining acceptance criteria and split backend/domain dependencies from frontend work. |
| AV-EFI/frontend#10 | qa_or_acceptance_needed | partial | Accessibility/QA | 13 | .\components\detail\FavouritesListComp.vue<br>.\components\detail\WorksMultiView.vue<br>.\components\detail\WorkVariantTopLevelComp.vue<br>.\components\global\CompareViewEditor.vue | Define remaining acceptance criteria and split backend/domain dependencies from frontend work. |
| AV-EFI/AVefi-Issues#128 | qa_or_acceptance_needed | partial | Accessibility/QA | 12 | .\components\detail\InstitutionListComp.vue<br>.\components\detail\PaginationComp.vue<br>.\components\global\BreadcrumbsComp.vue<br>.\components\global\ComparisonDrawer.vue | Define remaining acceptance criteria and split backend/domain dependencies from frontend work. |
| AV-EFI/frontend#2 | frontend_work | partial | Frontend/UI | 12 | .\components\detail\FilmRelatedMaterialsComp.vue<br>.\components\detail\ManifestationListComp.vue<br>.\components\detail\PaginationComp.vue<br>.\components\detail\SameAsComp.vue | Define remaining acceptance criteria and split backend/domain dependencies from frontend work. |
| AV-EFI/AVefi-Issues#169 | frontend_work | partial | Frontend/UI | 11 | .\app.vue<br>.\components\detail\HasAgentComp.vue<br>.\components\detail\HasEventComp.vue<br>.\components\detail\InstitutionListComp.vue | Define remaining acceptance criteria and split backend/domain dependencies from frontend work. |
| AV-EFI/AVefi-Issues#155 | frontend_work | partial | Frontend/UI | 10 | .\app.vue<br>.\components\detail\AVefiRefinementListComp.vue<br>.\components\detail\GenericKVView.vue<br>.\components\detail\HasEventComp.vue | Define remaining acceptance criteria and split backend/domain dependencies from frontend work. |
| AV-EFI/AVefi-Issues#201 | frontend_work | partial | Frontend/UI | 10 | .\assets\scss\main.scss<br>.\components\detail\FilmRelatedMaterialsComp.vue<br>.\components\global\BaseCarousel.vue<br>.\components\global\CardList.vue | Define remaining acceptance criteria and split backend/domain dependencies from frontend work. |
| AV-EFI/AVefi-Issues#166 | frontend_work | partial | Frontend/UI | 9 | .\components\global\IssuerCarouselComp.vue<br>.\components\global\PartnersCarouselComp.vue<br>.\components\home\HomeTimelineSection.vue<br>.\components\micro\ContactForm.vue | Define remaining acceptance criteria and split backend/domain dependencies from frontend work. |
| AV-EFI/AVefi-Issues#206 | qa_or_acceptance_needed | partial | Accessibility/QA | 9 | .\app.vue<br>.\components\global\VocabViewer.vue<br>.\MATOMO_SETUP.md<br>.\nuxt.config.ts | Define remaining acceptance criteria and split backend/domain dependencies from frontend work. |
| AV-EFI/AVefi-Issues#111 | qa_or_acceptance_needed | partial | Accessibility/QA | 8 | .\components\detail\GenericKVView.vue<br>.\components\global\TooltipInfo.vue<br>.\components\poc\GraphView.vue<br>.\pages\admin\user_tooltips.vue | Define remaining acceptance criteria and split backend/domain dependencies from frontend work. |

## Owner Routing

These are open issues outside the frontend evidence scope that are missing routing metadata or need a product/domain/backend decision before implementation cleanup.

| Issue | Bucket | State | Owner area | Evidence score | Strong evidence files | Proposed review action |
| --- | --- | --- | --- | --- | --- | --- |
| AV-EFI/AVefi-Issues#102 | backend_or_data_needed | blocked_external | Backend/API/indexing | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#107 | backend_or_data_needed | blocked_external | Backend/API/indexing | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#119 | backend_or_data_needed | blocked_external | Backend/API/indexing | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#125 | backend_or_data_needed | blocked_external | Backend/API/indexing | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#147 | backend_or_data_needed | blocked_external | Backend/API/indexing | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#149 | backend_or_data_needed | blocked_external | Backend/API/indexing | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#156 | backend_or_data_needed | blocked_external | Backend/API/indexing | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#157 | backend_or_data_needed | blocked_external | Backend/API/indexing | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#199 | backend_or_data_needed | blocked_external | Backend/API/indexing | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#66 | backend_or_data_needed | blocked_external | Backend/API/indexing | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |

## Notes

- This is a review proposal only. No GitHub issues, labels, assignees, milestones, or project fields were changed.
- Evidence quality is a ranking aid, not proof of completion.
- Suggested next step: review one batch at a time, then prepare an explicit GitHub update batch with comments/status/labels.
