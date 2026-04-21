<template>
    <PosterAvefiPosterComp>

        <!-- ── Header ── -->
        <template #header-title>Find films. Link data.</template>
        <template #header-subtitle>
            AVefi connects the holdings of multiple institutions to a film work
            and makes them permanently identifiable for discovery and research.
        </template>
        <template #header-stats>
            <p class="poster-header__stats">
                <span class="poster-stat">18,951 records</span>
                <span class="poster-stat-sep">·</span>
                <span class="poster-stat">4 partner institutions</span>
                <span class="poster-stat-sep">·</span>
                <span class="poster-stat">DFG-funded, 2023–2026</span>
                <span class="poster-stat-sep">·</span>
                <span class="poster-stat">av-efi.de</span>
            </p>
        </template>

        <!-- ── Column 1: What is AVefi? ── -->
        <template #col1>
            <h2 id="poster-col1-title" class="poster-col__title">1. The challenge</h2>

            <p class="poster-col__intro">
                Audiovisual works are documented independently by each institution —
                under different titles, in different systems, with local identifiers
                that carry no cross-archive meaning. There is no shared layer that
                links these records to the same film.
            </p>

            <!-- archive card diagram -->
            <div class="poster-diagram" role="figure" aria-labelledby="col1-diagram-label">
                <p id="col1-diagram-label" class="sr-only">
                    Three separate archive records for similar works cannot be
                    automatically matched because each institution uses a different
                    identifier scheme.
                </p>
                <div class="archive-cards">
                    <div class="archive-card">
                        <span class="archive-card__label">Haus des Dokumentarfilms</span>
                        <span class="archive-card__val">Pfingsten Unteruhldingen</span>
                        <span class="archive-card__id">21.11155/1883DA35-3892-4446-8E74-BB864AF205B3</span>
                    </div>
                    <div class="archive-card">
                        <span class="archive-card__label">Filmmuseum Düsseldorf</span>
                        <span class="archive-card__val">Die Antwort · 1963</span>
                        <span class="archive-card__id">21.11155/1853E153-A5BB-4F24-A5E3-55BBA3AFC82C</span>
                    </div>
                    <div class="archive-card">
                        <span class="archive-card__label">Deutsche Kinemathek</span>
                        <span class="archive-card__val">Metropolis · 1925/1926</span>
                        <span class="archive-card__id">21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406</span>
                    </div>
                </div>
                <div class="connector-block" aria-hidden="true">
                    <div class="connector-lines">
                        <span class="line"></span><span class="line"></span><span class="line"></span>
                    </div>
                    <div class="question-box">?</div>
                    <p class="diagram-caption">No shared identifier — record matching uncertain</p>
                </div>
            </div>

            <ul class="poster-bullets" aria-label="Consequences of metadata fragmentation">
                <li>heterogeneous metadata across institutions</li>
                <li>local identifiers without cross-archive scope</li>
                <li>ambiguous record matching</li>
                <li>limited cross-archive comparison</li>
            </ul>
        </template>

        <!-- ── Column 3: Use & impact ── -->
        <template #col3>
            <h2 id="poster-col3-title" class="poster-col__title">3. Exploration &amp; impact</h2>

            <p class="poster-col__intro">
                AVefi is a platform for interdisciplinary film research, film
                archiving, and cultural work. Structured metadata and persistent
                identifiers enable cross-archive discovery without flattening the
                distinction between work, manifestation and item.
            </p>

            <!-- mockup -->
            <div class="poster-mockup" role="figure" aria-labelledby="mockup-label">
                <p id="mockup-label" class="sr-only">
                    Schematic interface showing faceted search results for "Metropolis"
                    grouped as Work, Manifestations and Items.
                </p>
                <div aria-hidden="true">
                    <div class="poster-mockup__search">
                        <span class="poster-mockup__search-label">Search:</span>
                        <span class="poster-mockup__search-query">"Metropolis"</span>
                    </div>
                    <div class="poster-mockup__body">
                        <div class="poster-mockup__filters">
                            <p class="poster-mockup__filter-title">Facets</p>
                            <ul>
                                <li>Format</li>
                                <li>Archive</li>
                                <li>Year</li>
                                <li>Category</li>
                            </ul>
                        </div>
                        <div class="poster-mockup__results">
                            <p class="poster-mockup__results-title">Results</p>
                            <div class="result-group">
                                <span class="result-badge result-badge--work">Work</span>
                                <span class="result-text">Metropolis (1925/1926)</span>
                            </div>
                            <div class="result-group">
                                <span class="result-badge result-badge--manif">Manifestations</span>
                                <span class="result-text">8 records · Deutsche Kinemathek</span>
                            </div>
                            <div class="result-group">
                                <span class="result-badge result-badge--item">Items</span>
                                <span class="result-text">VHS, 35 mm, DVD, MXF …</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section aria-labelledby="subsec-use">
                <h3 id="subsec-use" class="poster-subsec-title">For research and archival practice</h3>
                <ul class="poster-bullets">
                    <li>compare related records across collections</li>
                    <li>trace versions, copies and fragments</li>
                    <li>persistent, citable links for scholarly references</li>
                    <li>improve provenance and contextual understanding</li>
                </ul>
            </section>

            <section aria-labelledby="subsec-project">
                <h3 id="subsec-project" class="poster-subsec-title">Project context</h3>
                <p class="poster-context-text">
                    AVefi is a project funded by the Deutsche Forschungsgemeinschaft (DFG),
                    2023–2026. A follow-up phase (AVefi plus, 2025–2028) will expand the
                    service and strengthen international data integration.
                </p>
                <p class="poster-context-text">
                    AVefi complements existing identifiers and platforms — including
                    Filmportal, EIDR, GND and NFDI4Culture — and is open to additional
                    data sources and collaborations.
                </p>
                <p class="poster-context-text">
                    Project partners: Deutsche Kinemathek · TIB Hannover · GWDG Göttingen
                    · Filmmuseum Düsseldorf · Marburg Center for Digital Culture &amp;
                    Infrastructure.
                </p>
            </section>
        </template>

        <!-- ── Footer note ── -->
        <template #footer-note>
            <p class="poster-footer__note">AVefi · av-efi.de · 2025</p>
        </template>

    </PosterAvefiPosterComp>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
</script>

<style scoped>
/* header stats are defined in the component; forward token values locally */
.poster-header__stats { font-size: 0.65rem; color: #5a6570; }
.poster-stat-sep { margin: 0 0.3rem; color: #d7dee3; }
</style>
