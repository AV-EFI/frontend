# Security-Richtlinien für das Frontend

Gilt für Änderungen am Nuxt-Frontend und am Nitro-Server in diesem Repository. Grundlage sind die OWASP Top 10:2025 und der OWASP Developer Guide. Die monatliche Prüfung steht in `monthly-check.md`, die Module dazu in `scripts/security/`.

Die Richtlinien beschreiben, was im Code heute gilt. Was Backend oder Infrastruktur entscheiden müssen, steht am Ende.

## 1. Daten ausgeben (A05 Injection)

- Backend-, Such- und Fremddaten werden mit `{{ }}` ausgegeben. `v-html` ist nur erlaubt, wenn der Inhalt aus eigenen Übersetzungen, eigenen Konstanten oder einer serverseitig bereinigten Quelle stammt (News-Feed: `server/utils/newsFeed.ts`).
- Suchtreffer mit Hervorhebung: `sanitizeHighlightHtml()` aus `utils/safeHtml.ts`. Es escapt alles und lässt nur `<mark>` und `<em>` ohne Attribute zu.
- Eigene Hervorhebung von Text (Filter, Suche in Listen): `markMatches(text, query)` aus `utils/safeHtml.ts`. Erst aufteilen, dann escapen, dann markieren, nie umgekehrt.
- Übersetzungen mit Parametern, die per `v-html` erscheinen: Parameter mit `escapeHtml()` übergeben (`i18n.config` escapt nicht von selbst).
- Kein `innerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function`. Inhalt in ein `<textarea>` gehört in `:value`, nicht in `v-html`.
- Jede neue Senke braucht einen Unit-Test mit Nutzlasten (`<img onerror>`, `<script>`, `javascript:`), siehe `tests/unit/utils/safe-html.spec.ts`.

## 2. Links, Popups, iframes (A05, A02)

- Ein `href` aus Backend- oder Fremddaten läuft durch `safeHref()` aus `utils/safeUrl.ts` (erlaubt http, https, mailto und relative URLs). Wer eine URL aus einer ID baut, filtert den Rückfall genauso (`composables/useNormdataUrl.ts`).
- `target="_blank"` bekommt `rel="noopener noreferrer"` (bei internen Links `rel="noopener"`). `window.open(url, '_blank', 'noopener,noreferrer')`.
- Jedes `<iframe>` bekommt `sandbox`. Fremde Seiten nur mit `allow-scripts allow-same-origin`, wenn sie eine andere Origin haben. Selbst erzeugter Inhalt (`srcdoc`) bekommt kein `allow-scripts`.

## 3. Nitro-Routen (A01, A06, A07)

Jede Route in `server/api/` gehört zu einer der Klassen. Welche, steht im Kopfkommentar oder ergibt sich aus der Absicherung.

| Klasse | Absicherung |
|---|---|
| Öffentlich, lesend | nur Daten, die ohnehin öffentlich sind; Eingaben validieren; keine Schreibzugriffe |
| Angemeldete Nutzer | `requireAuthenticatedUser(event)` am Anfang des Handlers |
| CMS-Änderungen | `requireCmsMutationsEnabled(event)` (Schalter, Origin-Prüfung) und `requireAuthenticatedUser(event)` |
| Skript oder Cron | `requireSecretToken(event)`: `Authorization: Bearer <NUXT_SECRET>`, 404 ohne gesetztes Secret |
| Nur Entwicklung | in Produktionsbuilds 404 (Beispiel `msearch.post.ts`) |

Weitere Regeln:

- Request-Bodys mit `zod` prüfen (`safeParse`), Fehler als 400 mit knapper Meldung.
- Öffentliche Routen mit Versand- oder Schreibwirkung brauchen ein Rate-Limit (`consumeRateLimit()` aus `server/utils/rateLimit.ts`, Beispiel `mail/contact.post.ts`). Es gilt pro Serverprozess.
- Client-IP nur über `getClientIp()` (`server/utils/clientIp.ts`). Es nimmt den letzten `x-forwarded-for`-Eintrag des Proxys und verwirft Werte, die keine IP sind. Rohe Header nie in Logs oder Rate-Limit-Schlüssel übernehmen.
- Kein `debug: true`, keine Stacktraces, Pfade oder Konfigurationswerte in Antworten. Details gehören ins Server-Log, die Antwort bleibt knapp.
- Neue Routen werden im nächsten Monatscheck gemeldet (`server-routes`), bis sie in `scripts/security/baseline.json` unter `reviewedRoutes` stehen.

## 4. Geheimnisse (A04, A02)

- Keine Zugangswerte im Repository. `.env`-Dateien werden nicht versioniert, nur `.env.tmpl` und Beispieldateien mit Platzhaltern (`your-…`, `$VARIABLE`).
- Der CI-Build entfernt Secrets aus der `.env` (`grep -vi secret`). Ein Secret, das zur Laufzeit gebraucht wird, liest man deshalb mit `process.env.NAME`, nicht über `runtimeConfig`. Letzteres wird beim Build festgelegt und enthielte den Wert nicht.
- Neue Secrets: Variable in der GitLab-CI anlegen, in `.env.tmpl` eintragen, nie in Logs ausgeben. Das Modul `secrets` prüft versionierte Dateien auf typische Muster.
- Nach Personalwechsel oder Verdacht auf Abfluss rotieren (`NUXT_SECRET`, Mail- und Elastic-Zugänge).

## 5. Abhängigkeiten (A03)

- Vor jedem Update `corepack yarn why <paket>`: Wer zieht das Paket, Laufzeit oder nur Build?
- Gepatchte Versionen über direkte Abhängigkeit oder `resolutions` in `package.json` festlegen. Keine ungeprüften Major-Sprünge nebenbei.
- Danach `corepack yarn install` und `corepack yarn npm audit --recursive --json`. Verbleibende Advisories sind in `scripts/security/baseline.json` mit Grund und Prüfdatum festgehalten.
- Vue-Pakete (`vue`, `@vue/*`) werden über `resolutions` auf eine Version gezogen, damit nicht mehrere Versionen im Baum liegen.
- Nach Updates den Docker-Install prüfen: `docker build --target build .` bzw. mindestens `yarn install` im `node`-Image mit `package.json`, `yarn.lock` und `.yarnrc.yml`. Das `postinstall` (`nuxt prepare`) läuft dort ohne `nuxt.config.ts`, deshalb lädt es Module, die lokal deaktiviert sind (Beispiel: `@nuxt/devtools` mit `simple-git`; ein Major-Update brach den CI-Build am 2026-10-12).
- Neue Abhängigkeit nur mit Begründung: Pflege, Herkunft, Größe, Install-Skripte.

## 6. Container und CI (A02, A08)

- Das Dockerfile nutzt die in `packageManager` gepinnte Yarn-Version (kein `yarn set version`). `.dockerignore` schließt `.git` und `.env.*` aus. Die `.env` bleibt im Build-Kontext, weil der CI-Build sie ohne Secrets erzeugt und braucht.
- Keine Secret-Variablen in Jobausgaben (`echo`, `cat` auf erzeugte Dateien mit Secrets). Registry-Login nur mit `--password-stdin`.
- Offen und bei der Infrastruktur: Laufzeit-Benutzer im Container (`USER`), Härtung im Compose-File.

## 7. Vor dem Merge

- [ ] Gibt es neue Stellen, an denen Daten aus dem Backend, aus der Suche oder von Nutzern ausgegeben werden? Welche Helfer schützen sie?
- [ ] Neue oder geänderte Route? Klasse nach Abschnitt 3, Absicherung, Rate-Limit, Validierung, Test.
- [ ] Neue Abhängigkeit oder neue externe Quelle (Skript, iframe, Feed)? Begründung und Konsequenz für Datenschutz und Lieferkette.
- [ ] Neue Variable oder Secret? CI-Variable, `.env.tmpl`, Zugriff zur Laufzeit.
- [ ] `corepack yarn lint`, `corepack yarn test:unit`, `corepack yarn knip:audit` und `corepack yarn security:monthly:offline` laufen sauber.

## 8. Nicht im Frontend entschieden

Diese Punkte brauchen Backend oder Infrastruktur und sind nicht durch Code im Repository lösbar. Stand und Verantwortliche stehen in Issue 250.

- Security-Header (HSTS, CSP zunächst Report-Only, nosniff, Referrer-Policy, Permissions-Policy, Frame-Schutz): wird in Traefik oder per `routeRules` gesetzt, Entscheidung offen.
- Attribute des Cookies `auth:token` (Secure, SameSite, Lebensdauer, HttpOnly-Modell).
- Feste Highlight-Tags und Escaping indexierter Felder im Backend.
- Personenbezogene Daten in `localStorage['auth_session']`: Entscheidung zur Gestaltung der Sitzung.

## Quellen

- OWASP Top 10:2025: https://top10.owasp.org/2025
- OWASP Developer Guide: https://devguide.owasp.org/
