# Handbook Alignment

This document tracks alignment with the AVefi Gestaltungshandbuch.

## Status

- Live handbook URL: `https://wiki.tib.eu/confluence/spaces/avefi/pages/409897177/AVefi+Gestaltungshandbuch`
- Live check date: 2026-07-27
- Result: unavailable to this agent, `403 Forbidden`
- Newest available export inspected: `C:\Users\StretzS\e\AVefi Gestaltungshandbuch_91cad766ce0542d3af60cf39cce1163a-270726-1208-20.pdf`
- Export version: 2026-05-13, marked "Work in Progress"
- Local export committed to repository: none

Because the live page could not be verified, this repository update uses the inspected 2026-05-13 export as the newest available export. Do not assume it is current.

## Extracted Implementation Rules

- AVefi is an open scientific infrastructure for linking and reusing film metadata.
- Core values: openness, sustainability, collaboration, low-threshold access, participation and inclusivity, visibility, reusability, transparency, and traceability.
- Claim: German `Filme finden. Daten verbinden.`; English `Find films. Link data.`
- Platform `av-efi.net` rules are binding and structured.
- Accompanying websites use the rules as adaptable guidelines.
- Communication/social media formats are flexible within central guidelines.
- The closer a change is to use, search, navigation, data understanding, or interaction, the more strongly handbook rules apply.
- UX/Frontend is responsible for structure, logic, UX, and understandability for the platform; communication/editorial is responsible for content and publication; development is responsible for implementation and maintainability.
- In unclear cases, first decide whether the issue is structural/UX or whether a content explanation is sufficient.

## Visual Rules

- Design is calm, functional, semantic, and durable.
- Colours serve orientation and meaning, not decoration.
- Signal colours are only for real status, warning, or error messages.
- Bree Serif is for logo, claim, and main headings.
- Inter/system UI is for interface, body text, buttons, labels, and metadata.
- Icons are line-based, functional, reduced, and currently aligned with Tabler Icons.
- Icons complement labels and do not replace understandable labels.
- Images need a clear content purpose and transparent provenance.
- Platform imagery should be reduced and workflow-supporting.

## Language Rules

- Tone is factual, friendly, precise, understandable, inclusive, low-barrier, and scientifically grounded.
- Avoid advertising exaggeration, urgency rhetoric, unclear abbreviations, long nested sentences, and unexplained technical terms.
- Abbreviations should be spelled out at first use.
- Technical terms should be explained or linked through glossary/tooltips when needed.
- Public texts should prefer short, clear sentences; fachliche Texte may use technical terms where needed.
- Use gender-inclusive language consistently within a text.

## Accessibility Rules

- Target contrast: WCAG AA.
- Web body text should be at least 16px.
- Provide clear focus indicators and keyboard operability.
- Use semantic structure, understandable headings, and robust mobile/desktop behavior.
- Provide alt text for informative images.
- Use ARIA only where semantic HTML is insufficient.

## How To Use The Handbook

When the live page or an export is available:

- Extract only implementation-relevant rules.
- Do not copy the complete handbook into the repository.
- Record the page/export version date.
- Mark rules that are Work in Progress or ambiguous.
- Do not use handbook examples as proof that a feature is implemented.

## Alignment Areas To Verify

- Brand spelling, logo usage, claim usage, and lockups.
- Language and communication style in German and English.
- Visual identity rules for colour, typography, spacing, imagery, and iconography.
- Collaboration or review rules that affect implementation workflow.
- Accessibility and inclusive language requirements.

## Current Repository Anchors For Alignment

- Product/brand copy: `i18n/locales/de.ts`, `i18n/locales/en.ts`
- Logo and claim assets: `public/img/AV-EFI-Logo.svg`, `public/img/AV-EFI-Logo-dark.svg`, `public/img/avefi_claim_de.svg`, `public/img/avefi_claim_en.svg`
- Implemented tokens: `assets/scss/main.scss`, `tailwind.config.ts`, `tailwind.colors.ts`
- Implemented components: `components/global/**`, `components/search/**`, `components/detail/**`, `components/views/**`
- Existing visual audit: `docs/visual-ui-audit.md`

## Alignment With Current Implementation

- Claim strings match current i18n files.
- Domain colours for work, manifestation, item, favourites, and compare match `assets/scss/main.scss` and `tailwind.colors.ts`.
- Typography families match current loaded fonts and global CSS.
- Icon direction matches current Tabler-first visual audit.
- Accessibility direction matches the public accessibility page and source-guard tests.

## Unresolved Until Live Handbook Access Or Decision

- Whether the 2026-05-13 Work in Progress export is still current.
- Logo placement, protection area, and minimum sizes are still marked open in the export.
- The export lists `#ffc0cb` for highlight while current implementation uses `#e4acba`.
- The export says primary and accent remain identical in light and dark themes, while current implementation uses dark primary `#80a3b5`.
- Whether current homepage imagery and card/media treatment are approved brand usage.
- Whether current German and English microcopy fully matches handbook language guidance.
- Whether collaboration/review rules require additional repo-level process docs.
