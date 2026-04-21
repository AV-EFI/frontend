<template>
    <!-- screen-only toolbar -->
    <div class="p-toolbar" role="toolbar">
        <div class="p-toolbar__left">
            <span v-if="conferenceTag" class="p-toolbar__tag">{{ conferenceTag }}</span>
        </div>
        <button
            class="p-toolbar__btn"
            aria-label="Print this poster or save as PDF"
            @click="() => window.print()"
        >
            ⎙ Print / Save PDF
        </button>
    </div>

    <main class="poster" role="main" lang="en">
        <!-- ===== HEADER ===== -->
        <header class="poster-header" role="banner">
            <!-- brand: logo only -->
            <div class="poster-header__brand">
                <img
                    src="/img/AV-EFI-Logo.svg"
                    alt="AVefi"
                    class="poster-header__logo"
                    @error="($event.target as HTMLImageElement).style.display = 'none'"
                />
            </div>

            <!-- centre: title + subtitle -->
            <div class="poster-header__text">
                <p class="poster-header__title">
                    <slot name="header-title">AVefi</slot>
                </p>
                <p class="poster-header__subtitle">
                    <slot name="header-subtitle">Automated network system for audiovisual holdings via standardised film identifiers</slot>
                </p>
            </div>

            <!-- right: stats -->
            <div class="poster-header__meta">
                <slot name="header-stats">
                    <span class="poster-stat"><strong>18,951</strong><small>Records</small></span>
                    <span class="poster-stat"><strong>4</strong><small>Partner institutions</small></span>
                    <span class="poster-stat"><strong>2023–2026</strong><small>DFG-funded</small></span>
                </slot>
            </div>
        </header>
        <div class="poster-accent-band" aria-hidden="true"></div>

        <!-- ===== BODY: three columns ===== -->
        <div class="poster-body">

            <!-- ── COLUMN 1 · customisable ── -->
            <section class="poster-col" data-col-num="1" aria-labelledby="poster-col1-title">
                <slot name="col1">
                    <!-- default: generic problem statement -->
                    <h2 id="poster-col1-title" class="poster-col__title">1. The fragmentation challenge</h2>
                    <p class="poster-col__intro">
                        Audiovisual works are documented differently across institutions.
                        Local identifiers, heterogeneous metadata models and varying record
                        structures make comparison and reliable matching difficult.
                    </p>
                    <ul class="poster-bullets" aria-label="Consequences of metadata fragmentation">
                        <li>heterogeneous metadata across institutions</li>
                        <li>local identifiers without cross-archive scope</li>
                        <li>ambiguous record matching</li>
                        <li>limited cross-archive comparison</li>
                    </ul>
                </slot>
            </section>

            <!-- ── COLUMN 2 · fixed: WMI hierarchy ── -->
            <section class="poster-col poster-col--center" data-col-num="2" aria-labelledby="poster-col2-title">
                <h2 id="poster-col2-title" class="poster-col__title">2. Structured linking with efi</h2>

                <p class="poster-col__intro">
                    AVefi assigns persistent identifiers to works, manifestations and
                    items following the FIAF Moving Image Cataloguing Manual. This enables
                    structured cross-institutional linking and unambiguous citation.
                </p>

                <!-- WMI hierarchy diagram -->
                <div class="poster-diagram poster-diagram--hier" role="figure" aria-labelledby="poster-hier-label">
                    <p id="poster-hier-label" class="sr-only">
                        A three-level hierarchy: one Work node at the top connects to three
                        Manifestation nodes, which in turn connect to five Item nodes. Every
                        node carries a persistent Handle-based efi identifier
                        (21.11155/[uuid]).
                    </p>

                    <!-- WORK -->
                    <div class="hier-row">
                        <div class="hier-box hier-box--work" aria-label="Work level">
                            <span class="hier-badge">Work</span>
                            <div class="hier-body">
                                <span class="hier-label">Metropolis (1925/1926)</span>
                                <span class="hier-handle">21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406</span>
                            </div>
                        </div>
                    </div>
                    <div class="hier-connector" aria-hidden="true"><span class="hier-vline"></span></div>

                    <!-- MANIFESTATIONS -->
                    <div class="hier-row hier-row--manif">
                        <div class="hier-box hier-box--manif" aria-label="Manifestation 1">
                            <span class="hier-badge">Manifestation</span>
                            <div class="hier-body">
                                <span class="hier-label">Publication · 13 items</span>
                                <span class="hier-handle">21.11155/AF1BEFE7-6E44-41DF-8727-5EAF19503FF9</span>
                            </div>
                        </div>
                        <div class="hier-box hier-box--manif" aria-label="Manifestation 2">
                            <span class="hier-badge">Manifestation</span>
                            <div class="hier-body">
                                <span class="hier-label">Restoration 2010 · 6 items</span>
                                <span class="hier-handle">21.11155/621FA496-A03C-4ABC-B02D-26CF22EAEE4C</span>
                            </div>
                        </div>
                        <div class="hier-box hier-box--manif" aria-label="Manifestation 3">
                            <span class="hier-badge">Manifestation</span>
                            <div class="hier-body">
                                <span class="hier-label">Restoration · 2 items</span>
                                <span class="hier-handle">21.11155/30A9143D-F90E-458A-9EA7-4B1E02CCF63D</span>
                            </div>
                        </div>
                    </div>
                    <div class="hier-connector" aria-hidden="true"><span class="hier-vline"></span></div>

                    <!-- ITEMS -->
                    <div class="hier-row hier-row--items">
                        <div class="hier-box hier-box--item" aria-label="Item: VHS">
                            <span class="hier-badge">Item</span>
                            <div class="hier-body">
                                <span class="hier-label">VHS · Viewing</span>
                                <span class="hier-handle">21.11155/3806D224-02FC-4E1D-989B-AB41F9477D48</span>
                            </div>
                        </div>
                        <div class="hier-box hier-box--item" aria-label="Item: UMatic">
                            <span class="hier-badge">Item</span>
                            <div class="hier-body">
                                <span class="hier-label">UMatic</span>
                                <span class="hier-handle">21.11155/F0088445-9F69-40CA-8A16-011172C8A2DD</span>
                            </div>
                        </div>
                        <div class="hier-box hier-box--item" aria-label="Item: 35 mm Film">
                            <span class="hier-badge">Item</span>
                            <div class="hier-body">
                                <span class="hier-label">35 mm Film · Distribution</span>
                                <span class="hier-handle">21.11155/082DAECA-95B4-4AE1-9F83-55AB746DB5ED</span>
                            </div>
                        </div>
                        <div class="hier-box hier-box--item" aria-label="Item: MXF digital file">
                            <span class="hier-badge">Item</span>
                            <div class="hier-body">
                                <span class="hier-label">MXF · Distribution</span>
                                <span class="hier-handle">21.11155/1436E6EA-364F-462E-9A3B-FD20F8A77666</span>
                            </div>
                        </div>
                        <div class="hier-box hier-box--item" aria-label="Item: DVD">
                            <span class="hier-badge">Item</span>
                            <div class="hier-body">
                                <span class="hier-label">DVD</span>
                                <span class="hier-handle">21.11155/0972ACBE-DCE3-4627-BA95-0DBFD725FEEC</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- workflow strip -->
                <ol class="poster-workflow" aria-label="efi assignment workflow">
                    <li>Partner ingestion</li>
                    <li aria-hidden="true" class="poster-workflow__sep">→</li>
                    <li>Reconciliation</li>
                    <li aria-hidden="true" class="poster-workflow__sep">→</li>
                    <li>Curation</li>
                    <li aria-hidden="true" class="poster-workflow__sep">→</li>
                    <li>efi assignment</li>
                    <li aria-hidden="true" class="poster-workflow__sep">→</li>
                    <li>Search &amp; exploration</li>
                </ol>

                <slot name="col2-extra" />
            </section>

            <!-- ── COLUMN 3 · customisable ── -->
            <section class="poster-col" data-col-num="3" aria-labelledby="poster-col3-title">
                <slot name="col3">
                    <!-- default: generic use & impact -->
                    <h2 id="poster-col3-title" class="poster-col__title">3. Exploration across collections</h2>
                    <p class="poster-col__intro">
                        Structured data and persistent identifiers support cross-archive
                        discovery without flattening the distinction between work,
                        manifestation and item.
                    </p>
                    <ul class="poster-bullets">
                        <li>compare related records across collections</li>
                        <li>trace versions, copies and fragments</li>
                        <li>persistent, citable links for research</li>
                        <li>open to additional archives and data sources</li>
                    </ul>
                </slot>
            </section>

        </div><!-- /poster-body -->

        <!-- ===== FOOTER ===== -->
        <footer class="poster-footer" role="contentinfo">
            <div class="poster-footer__left">
                <span class="poster-footer__url">www.av-efi.de</span>
                <span class="poster-footer__url-sub">projects.tib.eu/av-efi</span>
            </div>

            <div class="poster-footer__center">
                <slot name="footer-note">
                    <p class="poster-footer__note">AVefi · 2025</p>
                </slot>
            </div>

            <div class="poster-footer__logos" aria-label="Partner and funder logos">
                <slot name="footer-logos">
                    <figure class="poster-footer__logo-fig">
                        <img src="/img/logo_hdf.webp" alt="Haus des Dokumentarfilms" class="poster-footer__logo" />
                    </figure>
                    <figure class="poster-footer__logo-fig">
                        <img src="/img/logo_fmd.webp" alt="Filmmuseum Düsseldorf" class="poster-footer__logo" />
                    </figure>
                    <figure class="poster-footer__logo-fig">
                        <img src="/img/logo_sdk.webp" alt="Deutsche Kinemathek" class="poster-footer__logo" />
                    </figure>
                    <figure class="poster-footer__logo-fig">
                        <img src="/img/logo_tib.webp" alt="TIB – Leibniz Information Centre for Science and Technology" class="poster-footer__logo" />
                    </figure>
                    <figure class="poster-footer__logo-fig">
                        <img src="/img/gwdg_logo.min.svg" alt="GWDG" class="poster-footer__logo" />
                    </figure>
                    <figure class="poster-footer__logo-fig">
                        <img src="/img/DFG.svg" alt="Deutsche Forschungsgemeinschaft (DFG)" class="poster-footer__logo" />
                    </figure>
                </slot>
            </div>
        </footer>
    </main>
</template>

<script setup lang="ts">
defineProps<{
    /** Optional tag shown in the toolbar, e.g. "GreyNet International 2025" */
    conferenceTag?: string
}>();
</script>

<style scoped>
@font-face {
  font-family: "Bree Serif";
  src: url("/fonts/BreeSerif-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter.ttf") format("truetype");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

/* ── Design tokens (scoped to .poster so they don't bleed out) ─── */
.poster {
  --p-primary:       #4d768d;
  --p-accent:        #d8899c;
  --p-neutral:       #141b1f;
  --p-base:          #fafcfd;
  --p-surface:       #f0f4f7;
  --p-work:          #8ea1a1;
  --p-manif:         #7c949e;
  --p-item:          #748599;
  --p-line:          #cdd5db;
  --p-muted:         #587080;
  --p-col1:          #7b9e87;
  --p-col3:          #9e87a5;
  --p-font-serif:    "Bree Serif", Georgia, "Times New Roman", serif;
  --p-font-sans:     Inter, "Segoe UI", Arial, sans-serif;
  --p-font-mono:     ui-monospace, "Cascadia Mono", Consolas, monospace;
}

/* ── Reset ──────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Screen toolbar ─────────────────────────────────────────────── */
.p-toolbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1.5rem;
  background: #1c2b35;
  gap: 1rem;
  font-family: Inter, sans-serif;
}

.p-toolbar__left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.p-toolbar__tag {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #d8899c;
  border: 1px solid #d8899c;
  border-radius: 3px;
  padding: 0.18rem 0.55rem;
}

.p-toolbar__btn {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #fff;
  background: #4d768d;
  border: none;
  border-radius: 4px;
  padding: 0.45rem 1.1rem;
  cursor: pointer;
  transition: background 0.15s;
}
.p-toolbar__btn:hover { background: #3d617a; }
.p-toolbar__btn:focus-visible { outline: 2px solid #d8899c; outline-offset: 2px; }

/* ── Poster shell ───────────────────────────────────────────────── */
.poster {
  width: 1160px;
  max-width: 100%;
  margin: 2rem auto 4rem;
  background: var(--p-base);
  color: var(--p-neutral);
  font-family: var(--p-font-sans);
  font-size: 13px;
  line-height: 1.55;
  box-shadow: 0 6px 40px rgba(0, 0, 0, 0.13);
  overflow: hidden;
}

/* ── Header ─────────────────────────────────────────────────────── */
.poster-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 2rem;
  padding: 1.6rem 2.5rem 1.4rem;
  background: linear-gradient(135deg, #1c2b35 0%, #2d4a5e 55%, #3e6179 100%);
  color: #fff;
}

.poster-header__brand {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.poster-header__logo {
  height: 52px;
  width: auto;
  filter: brightness(0) invert(1);
}

.poster-header__wordmark {
  font-family: var(--p-font-serif);
  font-size: 1.55rem;
  color: #fff;
  letter-spacing: 0.02em;
  line-height: 1;
}

.poster-header__text {
  text-align: center;
}

.poster-header__title {
  font-family: var(--p-font-serif);
  font-size: 1.65rem;
  font-weight: 400;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 0.45rem;
}

.poster-header__subtitle {
  font-size: 0.84rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.5;
  max-width: 65ch;
  margin: 0 auto;
}

.poster-header__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
  text-align: right;
  white-space: nowrap;
}

.poster-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.poster-stat strong {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  font-family: var(--p-font-serif);
  line-height: 1;
}

.poster-stat small {
  font-size: 0.62rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.poster-stat-sep { display: none; }

/* gradient accent band */
.poster-accent-band {
  height: 5px;
  background: linear-gradient(
    90deg,
    var(--p-col1) 0%,
    var(--p-work) 25%,
    var(--p-primary) 50%,
    var(--p-manif) 75%,
    var(--p-accent) 100%
  );
}

/* ── Body: three columns ────────────────────────────────────────── */
.poster-body {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  min-height: 0;
}

/* ── Column common ──────────────────────────────────────────────── */
.poster-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.8rem 1.65rem;
  position: relative;
  overflow: hidden;
}

.poster-col + .poster-col {
  border-left: 1px solid var(--p-line);
}

.poster-col--center {
  background: var(--p-surface);
}

/* large ghost column-number behind content */
.poster-col::before {
  content: attr(data-col-num);
  position: absolute;
  top: 0.4rem;
  right: 1.4rem;
  font-family: var(--p-font-serif);
  font-size: 7rem;
  font-weight: 400;
  color: rgba(77, 118, 141, 0.07);
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

.poster-col__title {
  font-family: var(--p-font-serif);
  font-size: 1.05rem;
  font-weight: 400;
  color: var(--p-primary);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--p-primary);
  position: relative;
  z-index: 1;
}

.poster-col__intro {
  font-size: 0.78rem;
  color: var(--p-muted);
  line-height: 1.6;
}

/* ── Shared bullets ─────────────────────────────────────────────── */
.poster-bullets {
  padding-left: 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.poster-bullets li {
  font-size: 0.77rem;
  color: #3d4d58;
}

/* ── Sub-section headings ───────────────────────────────────────── */
.poster-subsec-title {
  font-family: var(--p-font-serif);
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--p-neutral);
  border-bottom: 1px solid var(--p-line);
  padding-bottom: 0.25rem;
}

/* ── SR only ────────────────────────────────────────────────────── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* ── Shared diagram shell ───────────────────────────────────────── */
.poster-diagram {
  background: #fff;
  border: 1px solid var(--p-line);
  border-radius: 6px;
  padding: 0.85rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

/* ── Archive cards (Col 1) ──────────────────────────────────────── */
.archive-cards {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.archive-card {
  display: flex;
  flex-direction: column;
  gap: 0.08rem;
  background: #fff;
  border: 1px solid var(--p-line);
  border-left: 4px solid var(--p-primary);
  border-radius: 0 5px 5px 0;
  padding: 0.5rem 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.archive-card--hdf { border-left-color: var(--p-col1); }
.archive-card--fmd { border-left-color: var(--p-manif); }
.archive-card--sdk { border-left-color: var(--p-primary); }

.archive-card__issuer {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--p-muted);
  margin-bottom: 0.05rem;
}

.archive-card__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--p-neutral);
}

.archive-card__val {
  font-size: 0.69rem;
  color: var(--p-muted);
}

.archive-card__id {
  font-family: var(--p-font-mono);
  font-size: 0.62rem;
  color: var(--p-primary);
  margin-top: 0.12rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Connector + question box */
.connector-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.22rem;
}

.connector-lines {
  display: flex;
  justify-content: space-around;
  width: 85%;
}

.connector-lines .line {
  width: 1px;
  height: 14px;
  background: var(--p-line);
  display: block;
}

.question-box {
  border: 2px solid var(--p-accent);
  border-radius: 5px;
  padding: 0.3rem 1.6rem;
  font-size: 0.9rem;
  font-weight: 400;
  font-family: var(--p-font-serif);
  color: var(--p-accent);
  background: #fff;
}

.diagram-caption {
  font-size: 0.62rem;
  color: var(--p-muted);
  text-align: center;
  margin-top: 0.3rem;
}

/* ── WMI hierarchy diagram (Col 2) ─────────────────────────────── */
.poster-diagram--hier {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 0.7rem;
}

.hier-row {
  display: flex;
  justify-content: center;
  gap: 0.35rem;
}

.hier-row--manif { justify-content: space-between; }
.hier-row--items { justify-content: space-between; flex-wrap: wrap; gap: 0.3rem; }

.hier-connector {
  display: flex;
  justify-content: center;
}

.hier-vline {
  display: block;
  width: 1px;
  height: 13px;
  background: var(--p-line);
}

.hier-box {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--p-line);
  border-radius: 5px;
  overflow: hidden;
  min-width: 0;
}

.hier-box--work  { width: 62%; }
.hier-box--manif { flex: 1 1 0; }
.hier-box--item  { flex: 1 1 0; min-width: 72px; }

.hier-badge {
  display: block;
  font-size: 0.57rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  padding: 0.22rem 0.55rem;
  width: 100%;
}

.hier-box--work  .hier-badge { background: var(--p-work); }
.hier-box--manif .hier-badge { background: var(--p-manif); }
.hier-box--item  .hier-badge { background: var(--p-item); }

.hier-body {
  padding: 0.28rem 0.5rem 0.32rem;
}

.hier-label {
  font-size: 0.67rem;
  font-weight: 600;
  color: var(--p-neutral);
  line-height: 1.3;
}

.hier-handle {
  font-family: var(--p-font-mono);
  font-size: 0.52rem;
  color: var(--p-primary);
  display: block;
  margin-top: 0.1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.8;
}

/* ── Workflow strip ─────────────────────────────────────────────── */
.poster-workflow {
  list-style: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  background: linear-gradient(90deg, rgba(77, 118, 141, 0.07) 0%, rgba(77, 118, 141, 0.03) 100%);
  border: 1px solid var(--p-line);
  border-radius: 30px;
  padding: 0.5rem 0.9rem;
}

.poster-workflow li {
  font-size: 0.67rem;
  color: var(--p-neutral);
  padding: 0.1rem 0.5rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 30px;
}

.poster-workflow__sep {
  background: none !important;
  padding: 0 !important;
  color: var(--p-primary);
  font-weight: 700;
  font-size: 0.8rem;
}

/* ── UI mockup (Col 3) ──────────────────────────────────────────── */
.poster-mockup {
  border: 1px solid var(--p-line);
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.poster-mockup__search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(90deg, var(--p-primary) 0%, #3d617a 100%);
  color: #fff;
  padding: 0.5rem 0.75rem;
  font-size: 0.7rem;
}

.poster-mockup__search-label {
  font-weight: 700;
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.75;
}

.poster-mockup__search-query {
  font-style: italic;
}

.poster-mockup__body {
  display: flex;
}

.poster-mockup__filters {
  flex-shrink: 0;
  width: 36%;
  border-right: 1px solid var(--p-line);
  padding: 0.6rem 0.7rem;
  background: var(--p-surface);
}

.poster-mockup__filter-title {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--p-neutral);
  margin-bottom: 0.35rem;
}

.poster-mockup__filters ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
}

.poster-mockup__filters li {
  font-size: 0.67rem;
  color: #4d6070;
  padding-left: 0.55rem;
  border-left: 2px solid var(--p-line);
}

.poster-mockup__results {
  flex: 1;
  padding: 0.6rem 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.poster-mockup__results-title {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--p-neutral);
  margin-bottom: 0.1rem;
}

.result-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.result-badge {
  font-size: 0.55rem;
  font-weight: 700;
  padding: 0.06rem 0.35rem;
  border-radius: 2px;
  white-space: nowrap;
  color: #fff;
}

.result-badge--work  { background: var(--p-work); }
.result-badge--manif { background: var(--p-manif); }
.result-badge--item  { background: var(--p-item); }

.result-text {
  font-size: 0.68rem;
  color: var(--p-neutral);
}

/* ── Context / body text ────────────────────────────────────────── */
.poster-context-text {
  font-size: 0.77rem;
  color: #3d4a52;
  line-height: 1.55;
}

/* ── Footer ─────────────────────────────────────────────────────── */
.poster-footer {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 2.5rem;
  background: var(--p-surface);
  border-top: 3px solid var(--p-primary);
}

.poster-footer__left {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.poster-footer__url {
  font-size: 0.85rem;
  font-weight: 400;
  font-family: var(--p-font-serif);
  color: var(--p-primary);
}

.poster-footer__url-sub {
  font-size: 0.66rem;
  color: var(--p-muted);
}

.poster-footer__center {
  text-align: center;
}

.poster-footer__note {
  font-size: 0.7rem;
  color: var(--p-muted);
  line-height: 1.45;
}

.poster-footer__logos {
  display: flex;
  align-items: center;
  gap: 1.3rem;
}

.poster-footer__logo-fig {
  margin: 0;
}

.poster-footer__logo {
  height: 30px;
  width: auto;
  max-width: 88px;
  object-fit: contain;
}

/* ── Print ───────────────────────────────────────────────────────── */
@media print {
  @page { size: A1 portrait; margin: 10mm; }

  .p-toolbar { display: none !important; }

  body, html {
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .poster {
    width: 100%;
    max-width: 100%;
    margin: 0;
    box-shadow: none;
    font-size: 9pt;
  }

  .poster-header { padding: 1rem 1.5rem 0.9rem; }
  .poster-col    { padding: 1.2rem 1.1rem; }
  .poster-footer { padding: 0.75rem 1.5rem; }

  .poster-header,
  .poster-accent-band,
  .poster-footer,
  .hier-badge,
  .result-badge,
  .poster-mockup__search,
  .archive-card,
  .poster-col--center,
  .poster-workflow {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .poster-body,
  .poster-col,
  .poster-diagram,
  .poster-footer {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
</style>