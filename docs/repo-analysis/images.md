# Image Audit

This note documents the current image generation setup, the image files that are actually used by the app, and the image families that looked safe to remove.

As of this cleanup pass:

- the responsive image pipeline now uses [scripts/image-manifest.mjs](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/scripts/image-manifest.mjs) as the source of truth
- [scripts/optimize-images.mjs](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/scripts/optimize-images.mjs) now supports `--check`, `--clean`, and `--dry-run`
- [scripts/report-image-metadata.mjs](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/scripts/report-image-metadata.mjs) now reads from that manifest instead of a second hardcoded list
- the safe stale families and stale derivatives listed below were removed from `public/img`

## Current generation pipeline

The main image generation entry point is [scripts/optimize-images.mjs](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/scripts/optimize-images.mjs).

Current characteristics:

- it uses a hardcoded `responsiveImages` array
- it generates only WebP in practice, but still carries unused JPEG code paths
- it also reads [data/issuer-images.json](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/data/issuer-images.json) and rewrites issuer logos to `.webp`
- it is not derived from actual runtime usage in pages/components
- [scripts/report-image-metadata.mjs](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/scripts/report-image-metadata.mjs) has its own stale hardcoded target list instead of sharing a source of truth

That means the repo currently has three separate truths:

1. what the UI actually requests
2. what `optimize-images.mjs` generates
3. what already exists in `public/img`

Those three are no longer aligned.

## Runtime usage that is actually visible

### Static app/SEO assets in active use

These are referenced directly by app shell, SEO config, or the press kit:

- `/img/AV-EFI-Logo.svg`
- `/img/AV-EFI-Logo-dark.svg`
- `/img/AV-EFI-Logo.png`
- `/img/AV-EFI-Logo-dark.png`
- `/img/avefi_claim_de.svg`
- `/img/avefi_claim_en.svg`
- `/img/avefi-og-image.png`
- `/img/favicon-96x96.png`
- `/img/favicon.svg`
- `/img/apple-touch-icon.png`
- `/img/site.webmanifest`
- `/img/DFG.svg`
- `/img/gwdg_logo.min.svg`
- `/img/avefi_placeholder.webp`
- `/img/placeholder-16x9.svg`
- `/img/avefi_diamonds_prim_mobile.webp`
- `/img/avefi_diamonds_prim_tablet.webp`
- `/img/avefi_diamonds_prim_desktop.webp`
- `/img/avefi_diamonds_prim_white.webp`

### Homepage hero variants in active use

[pages/index.vue](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/pages/index.vue) actively references:

- `/img/avefi_nodes-hero-480.webp`
- `/img/avefi_nodes-hero-720.webp`
- `/img/avefi_nodes-hero-1024.webp`
- `/img/avefi_nodes-hero-2040.webp`

### Homepage carousel card variants in active use

[pages/index.vue](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/pages/index.vue) uses:

- base image: `/img/<name>.webp`
- responsive widths: `240`, `320`, `360`, `480`, `720`

That currently applies to these active card families:

- `restaur_kurzfilme`
- `aktiv_im_dok`
- `Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren`

The `Bundesarchiv_Bild_Leipzig_Capitol_Nacht` card is commented out, and the `Schlenker` card no longer references image media at all.

### Video poster variants in active use

[components/home/HomeVideoSection.vue](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/components/home/HomeVideoSection.vue) uses:

- `/img/avefi_vid_poster-360.webp`
- `/img/avefi_vid_poster-540.webp`
- `/img/avefi_vid_poster-720.webp`
- `/img/avefi_vid_poster-1024.webp`
- `/img/avefi_vid_poster-1280.webp`

### Partner and issuer logos in active use

Partners:

- `/img/logo_tib.webp`
- `/img/logo_sdk.webp`
- `/img/logo_fmd.webp`
- `/img/logo_mcdci.webp`
- `/img/gwdg_logo.min.svg`

Issuers via [data/top-issuers.json](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/data/top-issuers.json) and [data/issuer-images.json](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/data/issuer-images.json):

- `/img/logo_hdf.webp`
- `/img/logo_fmd.webp`
- `/img/logo_sdk.webp`
- `/img/logo_tib.webp`
- fallback `/img/avefi_placeholder.webp`

## Clear mismatches between usage and generated files

### 1. Responsive card widths drifted from the generator

[pages/index.vue](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/pages/index.vue) asks for `240/320/360/480/720`, but the generator default is `240/320/480/720/1024`.

Observed result in `public/img`:

- old `-360.webp` variants exist for active card images
- unused `-1024.webp` variants also exist for those same images
- unused `.jpg` responsive variants also exist
- some stray `-800` files exist as leftovers

This is a drift bug. The page and the script do not share the same width manifest.

### 2. Hero generation still makes sizes the page does not request

The homepage hero uses only `480/720/1024/2040` WebP, but `public/img` also contains:

- `avefi_nodes-hero-240.jpg`
- `avefi_nodes-hero-240.webp`
- `avefi_nodes-hero-320.jpg`
- `avefi_nodes-hero-320.webp`
- all hero `.jpg` responsive variants

### 3. Video poster generation makes one unused size

The app uses `360/540/720/1024/1280`, but `public/img` also contains:

- `avefi_vid_poster-960.webp`

### 4. Entire image families appear dead

The following families have no active runtime consumer:

- `hermann_schlenker*`
- `Bundesarchiv_Bild_Leipzig_Capitol_Nacht*`
- `avefi_nodes-*` without `-hero`
- `avefi_nodes-og*`
- `mesh*`
- `mesh_grey*`
- `network_grayscale*`
- `banner.jfif`

Signals behind that assessment:

- `hermann_schlenker` is only in the generator; the homepage card no longer uses it
- `Bundesarchiv_Bild_Leipzig_Capitol_Nacht` only appears in a commented-out card and in the generator
- `avefi_nodes-og` is generated but the app uses `avefi-og-image.png` for OG/social metadata instead
- `avefi_nodes-*` without `-hero` are not referenced anywhere in app code
- `mesh*`, `mesh_grey*`, `network_grayscale*`, and `banner.jfif` are not referenced by pages/components/layouts/config

### 5. Legacy resized logo outputs are unused

The app uses the base `.webp` partner and issuer logos, not the legacy resized derivatives:

- `logo_fmd-h80.webp`
- `logo_hdf-h80.webp`
- `logo_sdk-h80.webp`
- `logo_tib-h80.webp`
- `logo_mcdci-80.webp`

These look like generator leftovers from an older naming scheme.

## Safe removal candidates

The files in these buckets have already been removed in this pass.

These are the first files I would remove, because they are either unreferenced or clearly exceed current runtime usage.

### Remove whole families

- `public/img/hermann_schlenker*`
- `public/img/Bundesarchiv_Bild_Leipzig_Capitol_Nacht*`
- `public/img/avefi_nodes-*.jpg`
- `public/img/avefi_nodes-*.webp`
- `public/img/avefi_nodes-og*`
- `public/img/mesh*`
- `public/img/mesh_grey*`
- `public/img/network_grayscale.*`
- `public/img/banner.jfif`
- `public/img/logo_fmd-h80.webp`
- `public/img/logo_hdf-h80.webp`
- `public/img/logo_sdk-h80.webp`
- `public/img/logo_tib-h80.webp`
- `public/img/logo_mcdci-80.webp`

### Remove unused responsive variants from active families

For active card images:

- remove all responsive `.jpg` variants for `aktiv_im_dok*`
- remove all responsive `.jpg` variants for `restaur_kurzfilme*`
- remove all responsive `.jpg` variants for `Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren*`
- remove unused `-1024.webp` variants for those three families
- remove stray `-800` leftovers such as `aktiv_im_dok-800.jpg`, `restaur_kurzfilme-800.jpg`, `restaur_kurzfilme-800.webp`

For the hero:

- remove `avefi_nodes-hero-240.webp`
- remove `avefi_nodes-hero-320.webp`
- remove all `avefi_nodes-hero-*.jpg`

For the video poster:

- remove `avefi_vid_poster-960.webp`

### Validate before deleting: likely orphaned single assets

These do not have active in-repo consumers, but they are single-source assets rather than obviously generated clutter:

- `public/img/avefi_claim_de_dark.svg`
- `public/img/avefi_claim_en_dark.svg`
- `public/img/avefi_ph_gray.svg`
- `public/img/logo_gnd.png`
- `public/img/logo_gnd.webp`
- `public/img/logo_gwdg.png`

They should be checked against off-repo usage before deletion, but they currently look unused inside this repository.

## Rough cleanup impact

Some obvious dead groups alone already account for several megabytes in `public/img`:

- `hermann_schlenker*`: about `1.5 MB`
- `Bundesarchiv_Bild_Leipzig_Capitol_Nacht*`: about `225 KB`
- `avefi_nodes-*` plus `avefi_nodes-og*` plus hero leftovers: about `4.8 MB` total family size before separating keep/remove
- `mesh*` plus `mesh_grey*`: about `2.8 MB`
- `network_grayscale*`: about `1.2 MB`
- `banner.jfif`: about `594 KB`

The real removable total is lower than the full `avefi_nodes-*` family number because the hero still needs four WebP variants and its source image, but there is still a meaningful amount of dead weight here.

## How the generator changed

### 1. One shared manifest now exists

The repository now uses [scripts/image-manifest.mjs](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/scripts/image-manifest.mjs).

That manifest describes:

- source file
- output base name
- exact widths
- formats
- whether the source/original file is intentionally kept
- which consumer owns the image

The generator now reads from that manifest. The remaining improvement would be to share width constants with the homepage code too, so `pages/index.vue` does not hardcode its own width list separately.

### 2. Split image types explicitly

The generator should distinguish at least these classes:

- `hero`
- `card`
- `videoPoster`
- `logo`
- `staticUntouched`

That removes special-case logic like `if (imageConfig.input === 'img/logo_mcdci.png' && width === null)`.

### 3. Dead JPEG generation logic was removed from the active pipeline

Current runtime references are overwhelmingly WebP, SVG, or original PNG assets for branding/press. The generator now emits only the WebP derivatives that active consumers need.

### 4. Cleanup-aware modes now exist

The generator now supports:

- `--check`: validate that all declared outputs exist
- `--clean`: delete generated files that are not in the manifest
- `--dry-run`: print planned create/remove operations without touching files

There are also package-level wrappers:

- `npm run generate:images`
- `npm run generate:images:clean`
- `npm run check:images`

### 5. The metadata report now consumes the same manifest

[scripts/report-image-metadata.mjs](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/scripts/report-image-metadata.mjs) no longer keeps its own hardcoded target list. It now reports the manifest-driven sources and outputs plus key runtime image assets.

### 6. Issuer/logo generation is now limited to real consumers

The current issuer-logo logic scans every `.webp` entry in [data/issuer-images.json](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/data/issuer-images.json) and rewrites outputs whether or not the repo still needs alternate derivatives.

The current model is:

- keep base `.webp` logos as the runtime contract
- keep original `.png` or `.jpg` files only as editable sources
- do not emit `-h80` or `-80` variants unless a component explicitly references them

### 7. Still worth adding later: a runtime-reference check

A small audit script should compare:

- manifest outputs
- actual `public/img` files
- `/img/...` references found in `pages/`, `components/`, `layouts/`, `app.vue`, `nuxt.config.ts`, `public/press/manifest.json`, and JSON data files

That would catch both missing outputs and dead files before they pile up.

## Remaining follow-up

1. Align homepage card widths with the manifest from normal app code instead of duplicating them in [pages/index.vue](/c:/Users/StretzS/projects/avefi-frontend-dev-gitlab/frontend/pages/index.vue).
2. Add a small runtime-reference audit so unmanaged orphaned files are detected automatically too.
3. Re-evaluate the remaining validate-before-delete singletons after checking for off-repo use.

## Notes

- These findings are based on repo-local references only. If any dead-looking files are used by external docs, an external CMS, or off-repo embeds, that should be validated before physical deletion.
