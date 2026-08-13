# Maintenance Banner

This note defines the current AVefi maintenance-notice concept.

## Placement

The notice is rendered as a global banner above the main navigation in `layouts/default.vue`. It is part of the fixed header, so it remains visible while users move through public and protected routes. The layout reserves vertical space for the banner to avoid covering page content.

## States

Supported states:

- `planned`: planned maintenance.
- `active`: ongoing maintenance or service disruption.

The state controls the fallback title, icon, ARIA live behavior, and status color. Planned maintenance uses the warning token. Active maintenance/service disruption uses the error token.

## Activation

The banner is controlled through public Nuxt runtime config backed by environment variables:

- `NUXT_PUBLIC_MAINTENANCE_BANNER_ENABLED=true`
- `NUXT_PUBLIC_MAINTENANCE_BANNER_PREVIEW_ENABLED=true|false`
- `NUXT_PUBLIC_MAINTENANCE_BANNER_STATE=planned|active`
- `NUXT_PUBLIC_MAINTENANCE_BANNER_STARTS_AT=<ISO date/time>`
- `NUXT_PUBLIC_MAINTENANCE_BANNER_ENDS_AT=<ISO date/time>`
- `NUXT_PUBLIC_MAINTENANCE_BANNER_MESSAGE_DE=<optional German text>`
- `NUXT_PUBLIC_MAINTENANCE_BANNER_MESSAGE_EN=<optional English text>`

The banner is hidden when `ENABLED` is false, when the state is unsupported, or when `ENDS_AT` is in the past. For `active`, a future `STARTS_AT` also keeps the banner hidden. For `planned`, a future `STARTS_AT` is displayed as the announced maintenance window.

Because the fallback copy and activation config are shipped with the Nuxt app, the notice does not depend on Elasticsearch, CMS, or other runtime API availability.

## Operational Updates

The maintenance window and override messages are changed through GitLab CI/CD variables for the frontend project:

- `https://gitlab.gwdg.de/av-efi/frontend/-/settings/ci_cd#js-cicd-variables-settings`

Access to this settings page requires the necessary GitLab project permissions. After changing CI/CD variables, redeploy the affected environment so the public Nuxt runtime config receives the new values.

## Preview Testing

Colleagues can test the banner without enabling real maintenance mode by setting:

- `NUXT_PUBLIC_MAINTENANCE_BANNER_PREVIEW_ENABLED=true`

Then open one of these URLs:

- `/?maintenanceBannerPreview=planned`
- `/?maintenanceBannerPreview=active`

Preview mode ignores the real `ENABLED`, `STATE`, `STARTS_AT`, and `ENDS_AT` activation rules and displays a visible `Preview`/`Vorschau` label in the banner. In production, `PREVIEW_ENABLED` must be `true`; outside production, preview is enabled by default unless `NUXT_PUBLIC_MAINTENANCE_BANNER_PREVIEW_ENABLED=false` is set.

## Copy

Default fallback copy lives in `i18n/locales/de.ts` and `i18n/locales/en.ts` under `maintenanceBanner`. Operational override messages can be supplied per language through runtime config.

## Follow-Up: News Linking

After Public Release, evaluate whether project-website news can be surfaced in the platform. That should be treated as a separate integration decision because ownership, editorial workflow, caching, failure behavior, consent/privacy implications, and fallback copy need confirmation before implementation.
