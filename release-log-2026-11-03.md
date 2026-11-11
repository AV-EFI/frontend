## Release – 2026-11-03

### Meta

**Period:** 2026-08-25 – 2026-11-03  
**Source:** Git commits  
**Status:** Integrated  
**Tag:** deploy-prod-v1.0.61  
**Commits:** 121

### Summary

- Einführung des Datenmodell-Explorers (Werk, Manifestation, Exemplar) als Ersatz des Schema-Explorer-POC.
- Einführung der News-Seite mit Feed, Paginierung, Startseiten-Teaser und englischer Auslieferung.
- Neuer Session-Ablauf mit schreibgeschützter Session, Aktivitäts-Refresh und CSRF-geschütztem Sign-out.
- Umfangreiche Security-Härtung: Nitro-Routen, Client-IP, Escaping von Backend-Daten, Dependabot-Advisories.
- Konsolidierung von Suche, Facet-Zustand, Detailansicht, Icons und Seitenstruktur (Titel, Breadcrumbs, Header).
- Verbesserungen bei Barrierefreiheit, Mobile-Darstellung und Dark-Theme.
- Neue Qualitäts-Gates in CI, Node-Upgrade auf 24 LTS und 16 Produktions-Deployments bis deploy-prod-v1.0.61.

### Changes

#### Search & Data Layer

- Facet-Zustand wird aus der URL gelesen: Aktive Facet-Panels werden nur bei angewendetem Filter markiert, mit Highlight-Punkt statt Titelfarbe.
- Facet-Menü zeigt „Aus Suche entfernen“, wenn der Wert aktiv ist; Highlight und Toggle-Label folgen der Live-URL.
- Synchronisierung des Vue Routers mit den URL-Schreibvorgängen von InstantSearch korrigiert.
- Produktionsjahr-Filter wird beim Start einer neuen Facet-Suche zurückgesetzt; der Indikator folgt dem angewendeten Bereich.
- Lange EFI-Werte werden in der Flat-Ansicht umbrochen, Tabellenansicht bereinigt.
- Entfernung von Slide-in-Transitions und erzwungenen Re-Renders in der Manifestation-Split-Ansicht.
- Export: Werkzeuge zum Abflachen von Datensätzen und zur Konvertierung nach XML und CSV, mit Tests.
- Aktualisierung des av-efi-schema-Snapshots auf 871c63d (2026-09-10).

#### Frontend & UX

- Datenmodell-Explorer mit drei Ebenen ersetzt das bisherige Graph-/Chat-Explorer-POC; Tabs, Filterlisten in der Seitenleiste, Site-Layout, Level-Icons in den Headern und Beziehungspfeile mit Verhältnissen.
- Neue News-Seite mit Paginierung, ausklappbaren Artikeln, Quellenlinks und Teaser auf der Startseite; englische Artikel aus dem englischen Feed, nicht übersetzte Artikel bleiben deutsch, mit Hinweis für nicht deutsche Sprachen.
- Detailansicht: Filter nach haltender Institution bei Film-Related-Materials, vollständiges FBM-Schema für die Kinemathek-Schemaprüfung, Anzeige von `same_as` auf Manifestation und Exemplar.
- Detailansicht: Screenreader-optimierte Darstellung von Manifestation und Exemplar mit Filter; EFI wird nur einmal angezeigt (sichtbar bzw. für Screenreader).
- Detailansicht: Zusammenfassungsleiste liegt über den Facet-Links, flackert nicht mehr an der Scroll-Schwelle und reserviert ihren Platz.
- Einheitlicher Seitenaufbau: ein Titelstil (h1 auf jeder Seite, gemeinsame PageTitleComp), konsistente Breadcrumbs, Abstand oberhalb der Breadcrumbs, Abstand über dem Footer.
- Header mit Icon- und Textnavigation, zugänglichen Einstellungs- und Benutzermenüs; Eintrag „Vokabular“ aus dem Benutzermenü entfernt.
- Kontakt-Drawer öffnet mit einem Klick und setzt den Fokus auf das E-Mail-Feld.
- Sprachwechsel lädt zuerst die Zielübersetzungen.
- Press-Bereich: Logo-und-Claim-Lockup-Generator mit neuen Logo-Varianten (Schwarz auf Weiß, Graustufen, Weiß auf Dunkel) und Abstand im Dateinamen.
- Datenschutzerklärung verlinkt auf die gehostete Fassung statt sie einzubetten.

#### Themes & Styling

- Angleichung von Tokens, Fonts und Titeltypografie an das Gestaltungshandbuch; Abweichung beim Full-Width-Container dokumentiert.
- Einheitliche Dark-Palette auf Blau-Grau, aufgehelltes base-200 im Light-Theme.
- Ausschließlich Tabler-Icons: Font-Awesome-Icon für externe Links und FormKit-Icon-Collection entfernt, Pfeile und Carets durch Tabler-Varianten ersetzt, Icon-Größenstufen wirksam, größere Level-Icons, einheitliche Icon-Farben.
- Pfeil-rechts als generischer Link zu Datensatz-Details.
- Dark-Theme: Ränder von Pagination und Facet-Panels an andere Panels angeglichen.
- Mobile Darstellung von Startseite (Carousels, Textblöcke), Detailseite, Menü, Cookie-Banner und Suchergebnis-Header überarbeitet.

#### Accessibility & i18n

- Rückmeldungen aus Issue #238 zur Screenreader-Nutzung der Detailseite umgesetzt.
- Skip-Link in das Default-Layout verschoben, Autofocus toleriert ihn.
- Carousel gibt während der Rotation keine Ansagen mehr aus und beachtet reduzierte Bewegung.
- FAQ-Definitionen für Werk und Exemplar sowie Explorer-Texte an die Confluence-Formulierungen angeglichen.

#### APIs & Backend Integration

- Auth: Schreibgeschützte Session, Aktivitäts-Refresh und CSRF-geschütztes Sign-out.
- Auth: Session wird nur bei Nutzeraktivität oder Reload verlängert, solange das Refresh-Token gültig ist; Refresh vor Sitzungsende bei gemeldetem Logout.
- Auth: Fail-closed, wenn die SSR-Sitzungsprüfung fehlschlägt; Auth-Endpunkt-Konfiguration konsolidiert, ungenutzte Keycloak-/Callback-Konfiguration entfernt.
- News-Feed-URL wird aus dem privaten Runtime-Config-Slot gelesen.

#### Mail & Contact Delivery

- Keine wesentlichen funktionalen Änderungen identifiziert (Ausnahme: Verhalten des Kontakt-Drawers, siehe Frontend & UX).

#### Testing & Quality Assurance

- Einführung und Durchsetzung von Quality Gates in CI, inklusive Compare-Guards.
- Backend-API-Contract-Tests laufen außerhalb der Produktion gegen das Testbed-Backend.
- OpenAPI-Contract-Test vorübergehend übersprungen, solange das Backend-`openapi.json` einen 500er liefert.
- Anpassung von Smoke-, E2E- und Typecheck-Tests an das aktuelle Markup (News, Detail-Aktionsmenü, Facet-Menü).
- Quality-Gate-Verträge lesen `.gitlab-ci.yml` mit normalisierten Zeilenenden.

#### CI/CD & Deployment

- News auf Produktion aktiviert, überschreibbar über NUXT_PUBLIC_NEWS_ENABLED.
- Upgrade der Node-Laufzeit von 20 auf 24 LTS; Docker nutzt die gepinnte Yarn-Version.
- Registry-Token wird per stdin an den Deploy-Host übergeben.
- Testbed mit rotiertem NUXT_SECRET neu deployt.
- PLAYWRIGHT_NO_WEBSERVER wird in der Shell statt über YAML-Variablen gesetzt.
- 16 Produktionsdeployments über versionierte Tags (deploy-prod-v1.0.46 bis deploy-prod-v1.0.61).

#### Security & Hardening

- Nitro-Routen geschützt und Client-IP sicher abgeleitet; Backend-Daten werden beim Rendern escaped, Link-Ziele gefiltert.
- Mehrere Dependabot- und yarn-audit-Korrekturen (Oktober); simple-git bleibt auf 3.x, damit `nuxt prepare` im Docker-Install funktioniert.
- Monatlicher Security-Check mit Richtlinien; wöchentliche Dependabot-Skripte erweitert.
- Sensible Environment-Konfiguration und generierte Tailwind-Farbdatei aus dem Repository entfernt.

#### Refactoring & Maintenance

- Refactoring der Explorer-Komponenten auf die Button- und Badge-Klassen der Seite.
- Ungenutzte Exporte (Knip) entfernt; Explorer und Vokabular nutzen eine gemeinsame Schema-Quelle.
- Dokumentation des Facet-Zustands als verfolgtes Risiko.
- Auth-Konfiguration und Umgebungsvariablen bereinigt.

### Notes

- Der Zeitraum ist geprägt vom neuen Datenmodell-Explorer, der News-Funktion, dem überarbeiteten Session-Verhalten und umfangreicher Security-Härtung.
- Viele Änderungen betreffen Konsistenz, Barrierefreiheit und interne Qualitätssicherung und sind für Nutzerinnen und Nutzer nur indirekt sichtbar.

### Breaking Changes

- Keine identifiziert.

### Known Issues

- Der OpenAPI-Contract-Test ist vorübergehend übersprungen, bis das Backend-`openapi.json` wieder fehlerfrei antwortet.
- Backend-abhängige lokale Tests können weiterhin fehlschlagen, wenn Docker oder VPN fehlen.
- Der Facet-Zustand zwischen InstantSearch und Vue Router ist als Risiko dokumentiert.
