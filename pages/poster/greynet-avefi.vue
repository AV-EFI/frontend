<template>
    <PosterAvefiPosterComp conference-tag="GreyNet International 2025">

        <!-- ── Header: grey holdings specific ── -->
        <template #header-title>Making Audiovisual Grey Holdings Findable</template>
        <template #header-subtitle>
            From metadata fragmentation to structured discovery — AVefi assigns
            persistent identifiers to film works, manifestations and items across
            heterogeneous archival holdings.
        </template>
        <template #header-stats>
            <div class="gn-stats">
                <span class="gn-stat"><strong>18,951</strong><small>Records</small></span>
                <span class="gn-stat"><strong>4</strong><small>Partner institutions</small></span>
                <span class="gn-stat"><strong>2023–2026</strong><small>DFG-funded</small></span>
                <span class="gn-tag">GreyNet 2025</span>
            </div>
        </template>

        <!-- ── Column 1: grey holdings fragmentation ── -->
        <template #col1>
            <h2 id="poster-col1-title" class="poster-col__title">1. Grey holdings — the identification challenge</h2>

            <p class="poster-col__intro">
                Educational films, documentary films, regional and amateur productions
                are held by multiple archives — each with its own cataloguing practice,
                local identifier, and metadata model. The same film may exist in
                several collections without any shared link between the records.
            </p>

            <!-- archive card diagram -->
            <div class="poster-diagram" role="figure" aria-labelledby="col1-diagram-label">
                <p id="col1-diagram-label" class="sr-only">
                    Three separate archive records from different institutions represent
                    works that cannot be automatically linked because there is no shared
                    identifier.
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

            <ul class="poster-bullets" aria-label="Consequences of fragmentation in grey holdings">
                <li>heterogeneous metadata across collections</li>
                <li>local identifiers without cross-archive scope</li>
                <li>ambiguous record matching for the same title</li>
                <li>grey holdings largely invisible to cross-archive search</li>
            </ul>
        </template>

        <!-- ── Column 3: grey holdings use case ── -->
        <template #col3>
            <h2 id="poster-col3-title" class="poster-col__title">3. Grey holdings become findable</h2>

            <p class="poster-col__intro">
                AVefi makes grey holdings — educational, instructional and documentary
                films, regional productions — visible and citable across institutions.
                Persistent identifiers and structured metadata enable reliable
                cross-archive discovery.
            </p>

            <!-- mockup tuned for grey holdings -->
            <div class="poster-mockup" role="figure" aria-labelledby="gn-mockup-label">
                <p id="gn-mockup-label" class="sr-only">
                    Interface mockup showing faceted search with filters for Format,
                    Archive, Year and Category applied to a grey holdings query.
                </p>
                <div aria-hidden="true">
                    <div class="poster-mockup__search">
                        <span class="poster-mockup__search-label">Search:</span>
                        <span class="poster-mockup__search-query">"Dokumentarfilm 1960"</span>
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
                                <span class="result-text">Die Antwort (1963)</span>
                            </div>
                            <div class="result-group">
                                <span class="result-badge result-badge--manif">Manifestations</span>
                                <span class="result-text">Filmmuseum Düsseldorf</span>
                            </div>
                            <div class="result-group">
                                <span class="result-badge result-badge--item">Items</span>
                                <span class="result-text">16 mm · Viewing copy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section aria-labelledby="gn-subsec-use">
                <h3 id="gn-subsec-use" class="poster-subsec-title">For grey literature research</h3>
                <ul class="poster-bullets">
                    <li>locate documentary and instructional films across collections</li>
                    <li>compare holdings — format, access status, condition</li>
                    <li>persistent, citable links for grey literature publications</li>
                    <li>support for film-related materials beyond feature cinema</li>
                </ul>
            </section>

            <section aria-labelledby="gn-subsec-project">
                <h3 id="gn-subsec-project" class="poster-subsec-title">Project context</h3>
                <p class="poster-context-text">
                    AVefi is funded by the Deutsche Forschungsgemeinschaft (DFG),
                    2023–2026, with a follow-up phase (AVefi plus, 2025–2028) expanding
                    coverage and international integration.
                </p>
                <p class="poster-context-text">
                    Film metadata ranges from early cinema to educational, instructional
                    and amateur productions — with a particular focus on collections
                    underrepresented in mainstream film databases.
                </p>
                <p class="poster-context-text">
                    Project partners: Deutsche Kinemathek · TIB Hannover · GWDG Göttingen
                    · Filmmuseum Düsseldorf · Marburg Center for Digital Culture &amp;
                    Infrastructure.
                </p>
            </section>
        </template>

        <!-- ── Footer: conference note ── -->
        <template #footer-note>
            <p class="poster-footer__note">
                GreyNet International Conference 2025 · AVefi · av-efi.de
            </p>
        </template>

    </PosterAvefiPosterComp>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
</script>

<style scoped>
.gn-stats { font-size: 0.78rem; color: rgba(255,255,255,0.85); display: flex; flex-direction: column; align-items: flex-end; gap: 0.3rem; }
.gn-stat  { display: flex; flex-direction: column; align-items: flex-end; }
.gn-stat strong { font-size: 1.1rem; font-weight: 700; color: #fff; font-family: "Bree Serif", serif; line-height: 1; }
.gn-stat small  { font-size: 0.6rem; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.05em; }
.gn-tag   { font-size: 0.65rem; font-weight: 700; color: #d8899c; border: 1px solid #d8899c; border-radius: 3px; padding: 0.15rem 0.5rem; align-self: flex-end; letter-spacing: 0.04em; text-transform: uppercase; }
</style>
