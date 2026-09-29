# Testbed news

`/news` displays the TIB project RSS feed, with a preview, expandable full text,
publication date and links to the original article and project website.
News articles are available only in German and their content is marked with
`lang="de"` for assistive technology. Interface labels remain available in
German and English.

Both CI build and deployment jobs set `NUXT_PUBLIC_NEWS_ENABLED=true` only when
`CI_ENVIRONMENT_NAME=testbed`, and set it to `false` otherwise. The variable is
passed through `.env.tmpl`. By default the feature is disabled. The route and
API return 404 when disabled and navigation omits the link. The page is not
prerendered or included in the sitemap, and carries `noindex, nofollow`.

For local verification set `NUXT_PUBLIC_NEWS_ENABLED=true` before starting Nuxt.
Run `corepack yarn playwright test tests/e2e/smoke/news.spec.ts` with the same flag
to verify the enabled view; run without the flag against a disabled instance to
verify 404 responses. With an existing server set `PLAYWRIGHT_NO_WEBSERVER=true`
and `PLAYWRIGHT_BASE_URL` explicitly.

The server fetches the feed URL from `runtimeConfig.newsFeedUrl` (default
`https://projects.tib.eu/av-efi/rss.xml`, overridable via `NEWS_FEED_URL`) with a
ten-second timeout and caches successful results for five minutes, keyed by feed
URL. XML is parsed with `fast-xml-parser`; DTDs are rejected. `sanitize-html`
allows basic text formatting and HTTP(S) links only. Source images, scripts,
styles and event attributes are not rendered. Feed failures display a retry
action and the project website link. `GET /api/news` accepts an optional
`?limit=` query parameter to return only the newest N entries.

## Homepage news row

The homepage (`pages/index.vue`) shows a row of the newest entries between the
"Explore" and "From dataset to knowledge" sections, using the same
`useNews()` composable and `/api/news` endpoint as `/news` (no second feed
query). It is gated by the same `newsEnabled` flag as the `/news` route, so it
only appears in the testbed environment. The number of entries defaults to 3
and is configurable via `NUXT_PUBLIC_NEWS_HOME_COUNT`. If the feed is empty or
fails to load, the row renders nothing rather than breaking the page.

Dependency audit during implementation (2026-09-28): the existing resolution
`devalue@5.8.1`, used by `@nuxtjs/i18n`, is affected by
GHSA-9rgm-9g3h-6x36 (moderate denial of service, fixed in 5.9.1). This predates
the news dependencies and remains outside this feature patch; the recursive
audit is therefore not clean. Existing Nuxt, Vite and Nodemailer peer-version
warnings also remain unchanged.

## Verification (2026-09-28)

- `corepack yarn install`: successful, with the existing peer-version warnings.
- `corepack yarn lint`: successful.
- `corepack yarn typecheck`: zero errors after the repository's existing filters;
  the existing Vue Router language-plugin resolution warning remains.
- `corepack yarn test:unit`: 78 files, 384 tests passed.
- `corepack yarn playwright test tests/e2e/smoke/news.spec.ts`: passed against
  local Nuxt with the flag enabled and again with it disabled. Enabled checks
  cover the live feed, HTTP status, robots metadata, keyboard disclosure,
  original links and overflow at 375, 768 and 1280 pixels.
- Desktop light and mobile dark screenshots were inspected. Loading, empty
  and retry states have component coverage.
- `corepack yarn npm audit --recursive --json`: failed only on the pre-existing
  `devalue` advisory described above. Package and lockfile changes were reviewed;
  no existing dependency versions were changed.
- The full backend smoke/API suites and production build were not run for
  this isolated news feature. No deployment has been performed.

Implementation files: `pages/news.vue`, `middleware/news.ts`,
`utils/newsEnabled.ts`, `server/api/news.get.ts`, `server/utils/newsFeed.ts`,
`server/middleware/404-status.ts`, `components/global/NavBar.vue`, both locale
files, `nuxt.config.ts`, `.env.tmpl`, `.gitlab-ci.yml`, `package.json` and
`yarn.lock`, plus news unit/component/API/browser tests. The news browser test
is included in `test:e2e:smoke`.
