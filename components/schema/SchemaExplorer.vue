<template>
    <section class="schema-explorer" aria-labelledby="schema-explorer-heading">
        <header class="schema-explorer__header">
            <div class="schema-explorer__heading-block">
                <p class="schema-explorer__eyebrow">AVefi metadata schema</p>
                <h1 id="schema-explorer-heading" class="schema-explorer__title">Schema Explorer</h1>
                <p class="schema-explorer__lead">
                    Explore classes, slots, relationships, ranges, identifiers, and controlled vocabularies in the AVefi
                    metadata model. The focus is the schema itself, not individual film records.
                </p>
            </div>
            <dl class="schema-explorer__stats" aria-label="Schema explorer summary">
                <div>
                    <dt>Classes</dt>
                    <dd>{{ stats.classes }}</dd>
                </div>
                <div>
                    <dt>Relationships</dt>
                    <dd>{{ stats.relationships }}</dd>
                </div>
                <div>
                    <dt>Required slots</dt>
                    <dd>{{ stats.requiredSlots }}</dd>
                </div>
                <div>
                    <dt>Vocabulary groups</dt>
                    <dd>{{ stats.vocabularyGroups }}</dd>
                </div>
            </dl>
        </header>

        <div class="schema-explorer__controls" role="search">
            <label class="schema-explorer__search-label" for="schema-explorer-search">
                Search classes, slots, ranges, vocabularies, or modelling notes
            </label>
            <div class="schema-explorer__search-wrap">
                <Icon name="tabler:search" class="icon-action" aria-hidden="true" />
                <input
                    id="schema-explorer-search"
                    v-model="query"
                    type="search"
                    class="schema-explorer__search"
                    autocomplete="off"
                    placeholder="Search has_item, GND, Duration, required..."
                >
            </div>
        </div>

        <div class="schema-explorer__tabs" role="tablist" aria-label="Schema explorer views">
            <button
                v-for="view in views"
                :id="`${view.id}-tab`"
                :key="view.id"
                type="button"
                role="tab"
                class="schema-explorer__tab"
                :class="{ 'schema-explorer__tab--active': activeView === view.id }"
                :aria-selected="activeView === view.id"
                :aria-controls="`${view.id}-panel`"
                @click="activeView = view.id"
            >
                <Icon :name="view.icon" class="icon-inline" aria-hidden="true" />
                <span>{{ view.label }}</span>
            </button>
        </div>

        <p class="sr-only" aria-live="polite">
            {{ filteredClasses.length }} schema classes match the current search.
            Selected class: {{ selectedClass.label }}.
        </p>

        <section
            v-show="activeView === 'map'"
            id="map-panel"
            class="schema-explorer__workspace"
            role="tabpanel"
            aria-labelledby="map-tab"
        >
            <aside class="schema-explorer__class-list" aria-labelledby="schema-class-list-heading">
                <div class="schema-explorer__panel-heading">
                    <h2 id="schema-class-list-heading">Classes</h2>
                    <span>{{ filteredClasses.length }} shown</span>
                </div>
                <div class="schema-explorer__class-buttons" role="list">
                    <button
                        v-for="schemaClass in filteredClasses"
                        :key="schemaClass.id"
                        type="button"
                        class="schema-explorer__class-button"
                        :class="[
                            `schema-explorer__class-button--${schemaClass.group}`,
                            { 'schema-explorer__class-button--active': selectedClass.id === schemaClass.id },
                        ]"
                        :aria-pressed="selectedClass.id === schemaClass.id"
                        @click="selectClass(schemaClass.id)"
                    >
                        <span>{{ schemaClass.label }}</span>
                        <small>
                            {{ schemaClass.abstract ? 'abstract' : schemaClass.group }}
                        </small>
                    </button>
                </div>
            </aside>

            <div class="schema-explorer__map-column">
                <section
                    class="schema-map"
                    aria-labelledby="schema-map-heading"
                    aria-describedby="schema-map-help"
                    @keydown="handleMapKeydown"
                >
                    <div class="schema-explorer__panel-heading">
                        <h2 id="schema-map-heading">Visual schema map</h2>
                        <span>Work / WorkVariant -> Manifestation -> Item</span>
                    </div>
                    <p id="schema-map-help" class="schema-map__help">
                        Use Tab to enter each node. Arrow keys move between visible nodes when focus is inside the map.
                    </p>
                    <div class="schema-map__canvas" role="group" aria-label="Schema relationship map">
                        <svg class="schema-map__edges" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <marker
                                    id="schema-arrow"
                                    markerWidth="7"
                                    markerHeight="7"
                                    refX="6"
                                    refY="3.5"
                                    orient="auto"
                                >
                                    <path d="M0,0 L7,3.5 L0,7 Z" class="schema-map__arrow" />
                                </marker>
                            </defs>
                            <line
                                v-for="edge in visibleSvgEdges"
                                :key="edge.id"
                                :x1="mapPosition(edge.source).x"
                                :y1="mapPosition(edge.source).y"
                                :x2="mapPosition(edge.target).x"
                                :y2="mapPosition(edge.target).y"
                                :class="['schema-map__edge', `schema-map__edge--${edge.kind}`]"
                                marker-end="url(#schema-arrow)"
                            />
                        </svg>

                        <button
                            v-for="schemaClass in visibleMapClasses"
                            :id="nodeButtonId(schemaClass.id)"
                            :key="schemaClass.id"
                            type="button"
                            class="schema-map__node"
                            :class="[
                                `schema-map__node--${schemaClass.group}`,
                                { 'schema-map__node--active': selectedClass.id === schemaClass.id },
                            ]"
                            :style="{ gridArea: mapArea(schemaClass.id) }"
                            :aria-pressed="selectedClass.id === schemaClass.id"
                            :aria-describedby="selectedClass.id === schemaClass.id ? 'schema-selected-summary' : undefined"
                            @click="selectClass(schemaClass.id)"
                        >
                            <span class="schema-map__node-label">{{ schemaClass.shortLabel }}</span>
                            <span class="schema-map__node-meta">
                                {{ schemaClass.abstract ? 'abstract' : `${schemaClass.slots.length} slots` }}
                            </span>
                        </button>
                    </div>
                </section>

                <section class="schema-relations" aria-labelledby="schema-relations-heading">
                    <div class="schema-explorer__panel-heading">
                        <h2 id="schema-relations-heading">Relationships around {{ selectedClass.shortLabel }}</h2>
                        <span>{{ selectedEdges.length }}</span>
                    </div>
                    <ol class="schema-relations__list">
                        <li v-for="edge in selectedEdges" :key="edge.id" class="schema-relations__item">
                            <span :class="['schema-relations__kind', `schema-relations__kind--${edge.kind}`]">
                                {{ edgeKindLabel(edge.kind) }}
                            </span>
                            <p>
                                <strong>{{ getClass(edge.source).shortLabel }}</strong>
                                <span> via </span>
                                <code>{{ edge.slot }}</code>
                                <span> to </span>
                                <strong>{{ getClass(edge.target).shortLabel }}</strong>
                            </p>
                            <small>{{ edge.description }}</small>
                        </li>
                    </ol>
                </section>
            </div>

            <aside class="schema-explorer__details" aria-labelledby="schema-selected-heading">
                <div class="schema-explorer__panel-heading">
                    <h2 id="schema-selected-heading">{{ selectedClass.label }}</h2>
                    <span>{{ selectedClass.group }}</span>
                </div>
                <p id="schema-selected-summary" class="schema-explorer__description">
                    {{ selectedClass.description }}
                </p>
                <div class="schema-explorer__chips" aria-label="Class flags">
                    <span v-if="selectedClass.abstract" class="schema-chip">abstract class</span>
                    <span v-if="selectedClass.inherits" class="schema-chip">inherits {{ selectedClass.inherits }}</span>
                    <span v-if="requiredSlots.length" class="schema-chip">{{ requiredSlots.length }} required</span>
                    <span v-if="controlledVocabularySlots.length" class="schema-chip">
                        {{ controlledVocabularySlots.length }} vocabulary slots
                    </span>
                </div>

                <section aria-labelledby="schema-notes-heading">
                    <h3 id="schema-notes-heading" class="schema-explorer__subheading">AVefi modelling decisions</h3>
                    <ul class="schema-explorer__notes">
                        <li v-for="note in selectedClass.modellingNotes" :key="note">{{ note }}</li>
                    </ul>
                </section>

                <section aria-labelledby="schema-slots-heading">
                    <h3 id="schema-slots-heading" class="schema-explorer__subheading">Slots and ranges</h3>
                    <div class="schema-slot-list">
                        <article v-for="slot in selectedClass.slots" :key="`${selectedClass.id}-${slot.name}`" class="schema-slot">
                            <header>
                                <code>{{ slot.name }}</code>
                                <span v-if="slot.required" class="schema-slot__flag">required</span>
                                <span v-if="slot.multivalued" class="schema-slot__flag">multi</span>
                            </header>
                            <p>{{ slot.description }}</p>
                            <small>Range: {{ formatSlotRange(slot) }}</small>
                        </article>
                    </div>
                </section>
            </aside>
        </section>

        <section
            v-show="activeView === 'structured'"
            id="structured-panel"
            class="schema-structured"
            role="tabpanel"
            aria-labelledby="structured-tab"
        >
            <h2>Structured schema representation</h2>
            <p>
                This non-graph view lists the same classes, properties, cardinalities, ranges, and relationship slots in a
                linear structure.
            </p>
            <div class="schema-structured__classes">
                <article
                    v-for="schemaClass in filteredClasses"
                    :key="`structured-${schemaClass.id}`"
                    class="schema-structured__class"
                >
                    <header>
                        <div>
                            <h3>{{ schemaClass.label }}</h3>
                            <p>{{ schemaClass.description }}</p>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline" @click="selectClass(schemaClass.id); activeView = 'map'">
                            <Icon name="tabler:target-arrow" class="icon-inline" aria-hidden="true" />
                            Inspect
                        </button>
                    </header>
                    <div class="schema-table-wrap">
                        <table class="schema-table">
                            <caption class="sr-only">Slots for {{ schemaClass.label }}</caption>
                            <thead>
                                <tr>
                                    <th scope="col">Slot</th>
                                    <th scope="col">Range</th>
                                    <th scope="col">Kind</th>
                                    <th scope="col">Cardinality</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="slot in schemaClass.slots" :key="`structured-${schemaClass.id}-${slot.name}`">
                                    <th scope="row"><code>{{ slot.name }}</code></th>
                                    <td>{{ formatSlotRange(slot) }}</td>
                                    <td>{{ slotKindLabel(slot.kind) }}</td>
                                    <td>{{ slotCardinality(slot) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </article>
            </div>
        </section>

        <section
            v-show="activeView === 'vocab'"
            id="vocab-panel"
            class="schema-vocab"
            role="tabpanel"
            aria-labelledby="vocab-tab"
        >
            <h2>Controlled vocabularies and authority classes</h2>
            <p>
                Enumerations constrain several slots. Authority resource classes constrain identifiers and same_as links.
            </p>
            <div class="schema-vocab__grid">
                <article v-for="group in model.vocabularyGroups" :key="group.id" class="schema-vocab__group">
                    <header>
                        <Icon name="tabler:list-details" class="icon-action" aria-hidden="true" />
                        <div>
                            <h3>{{ group.label }}</h3>
                            <p>{{ group.description }}</p>
                        </div>
                    </header>
                    <dl>
                        <div>
                            <dt>Applies to</dt>
                            <dd>{{ group.appliesTo.map((id) => getClass(id).shortLabel).join(', ') }}</dd>
                        </div>
                        <div>
                            <dt>Enums or resource classes</dt>
                            <dd>
                                <span v-for="enumName in group.enumNames" :key="enumName" class="schema-chip">
                                    {{ enumName }}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </article>
            </div>
        </section>
    </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import {
    formatSlotRange,
    getControlledVocabularySlots,
    getEdgesForClass,
    getRequiredSlots,
    getSchemaClassById,
    getSchemaStats,
    schemaExplorerModel,
    searchSchemaClasses,
    type SchemaClassId,
    type SchemaEdgeKind,
    type SchemaSlot,
    type SchemaSlotKind,
} from '~/utils/schemaExplorer';

type ViewId = 'map' | 'structured' | 'vocab';

interface MapPosition {
    x: number;
    y: number;
}

const views: Array<{ id: ViewId; label: string; icon: string }> = [
    { id: 'map', label: 'Visual map', icon: 'tabler:chart-dots-3' },
    { id: 'structured', label: 'Structured view', icon: 'tabler:list-tree' },
    { id: 'vocab', label: 'Vocabularies', icon: 'tabler:tags' },
];

const mapAreas: Record<SchemaClassId, string> = {
    WorkVariant: 'work',
    Manifestation: 'manifestation',
    Item: 'item',
    Title: 'title',
    Event: 'event',
    Activity: 'activity',
    Agent: 'agent',
    Genre: 'genre',
    Subject: 'subject',
    Language: 'language',
    Format: 'format',
    Extent: 'extent',
    Duration: 'duration',
    DescriptionResource: 'description',
    MovingImageResource: 'movingResource',
    AuthorityResource: 'authority',
};

const mapPositions: Record<SchemaClassId, MapPosition> = {
    WorkVariant: { x: 18, y: 23 },
    Manifestation: { x: 50, y: 23 },
    Item: { x: 82, y: 23 },
    Title: { x: 18, y: 52 },
    Event: { x: 38, y: 52 },
    Activity: { x: 58, y: 52 },
    Agent: { x: 78, y: 52 },
    Genre: { x: 12, y: 80 },
    Subject: { x: 27, y: 80 },
    Language: { x: 47, y: 80 },
    Format: { x: 62, y: 80 },
    Extent: { x: 77, y: 80 },
    Duration: { x: 90, y: 80 },
    DescriptionResource: { x: 12, y: 96 },
    MovingImageResource: { x: 50, y: 96 },
    AuthorityResource: { x: 86, y: 96 },
};

const model = schemaExplorerModel;
const query = ref('');
const activeView = ref<ViewId>('map');
const selectedClassId = ref<SchemaClassId>('WorkVariant');

const stats = computed(() => getSchemaStats(model));
const selectedClass = computed(() => getSchemaClassById(selectedClassId.value));
const selectedEdges = computed(() => getEdgesForClass(selectedClassId.value, model));
const requiredSlots = computed(() => getRequiredSlots(selectedClass.value));
const controlledVocabularySlots = computed(() => getControlledVocabularySlots(selectedClass.value));
const filteredClasses = computed(() => searchSchemaClasses(query.value, model));
const filteredClassIds = computed(() => new Set(filteredClasses.value.map((schemaClass) => schemaClass.id)));
const visibleMapClasses = computed(() => {
    if (!query.value.trim()) {
        return model.classes;
    }
    return model.classes.filter((schemaClass) => filteredClassIds.value.has(schemaClass.id));
});

const visibleMapClassIds = computed(() => visibleMapClasses.value.map((schemaClass) => schemaClass.id));
const visibleSvgEdges = computed(() => model.edges.filter((edge) => (
    edge.source !== edge.target
    && visibleMapClassIds.value.includes(edge.source)
    && visibleMapClassIds.value.includes(edge.target)
)));

function getClass(id: SchemaClassId) {
    return getSchemaClassById(id);
}

function selectClass(id: SchemaClassId) {
    selectedClassId.value = id;
}

function nodeButtonId(id: SchemaClassId) {
    return `schema-map-node-${id}`;
}

function mapArea(id: SchemaClassId) {
    return mapAreas[id];
}

function mapPosition(id: SchemaClassId) {
    return mapPositions[id];
}

async function focusSelectedNode() {
    await nextTick();
    if (!process.client) {
        return;
    }
    document.getElementById(nodeButtonId(selectedClassId.value))?.focus();
}

function handleMapKeydown(event: KeyboardEvent) {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) {
        return;
    }

    const classIds = visibleMapClassIds.value;
    if (!classIds.length) {
        return;
    }

    event.preventDefault();
    const currentIndex = Math.max(0, classIds.indexOf(selectedClassId.value));
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (currentIndex + direction + classIds.length) % classIds.length;
    selectedClassId.value = classIds[nextIndex] ?? selectedClassId.value;
    focusSelectedNode();
}

function slotKindLabel(kind: SchemaSlotKind) {
    const labels: Record<SchemaSlotKind, string> = {
        property: 'Property',
        relationship: 'Relationship',
        controlledVocabulary: 'Controlled vocabulary',
        identifier: 'Identifier',
        provenance: 'Provenance',
    };
    return labels[kind];
}

function edgeKindLabel(kind: SchemaEdgeKind) {
    const labels: Record<SchemaEdgeKind, string> = {
        spine: 'Spine',
        relationship: 'Relation',
        shared: 'Shared object',
        event: 'Event chain',
        authority: 'Identifier',
        vocabulary: 'Vocabulary',
    };
    return labels[kind];
}

function slotCardinality(slot: SchemaSlot) {
    if (slot.required && slot.multivalued) {
        return 'required, multiple';
    }
    if (slot.required) {
        return 'required';
    }
    if (slot.multivalued) {
        return 'multiple';
    }
    return 'optional';
}
</script>

<style scoped>
.schema-explorer {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  color: var(--color-base-content, #141b1f);
}

.schema-explorer__header {
  display: grid;
  gap: 1rem;
  align-items: end;
}

@media (min-width: 1024px) {
  .schema-explorer__header {
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 28rem);
  }
}

.schema-explorer__heading-block {
  max-width: 58rem;
}

.schema-explorer__eyebrow {
  margin-bottom: 0.25rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary, #4d768d);
}

.schema-explorer__title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  line-height: 1;
}

.schema-explorer__lead {
  margin-top: 0.75rem;
  max-width: 48rem;
  font-size: 1rem;
  line-height: 1.65;
  color: color-mix(in srgb, var(--color-base-content, #141b1f) 76%, transparent);
}

.schema-explorer__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
}

.schema-explorer__stats div {
  border: 1px solid var(--color-base-300, #d1d5db);
  border-radius: 0.5rem;
  padding: 0.75rem;
  background: var(--color-base-100, #fff);
}

.schema-explorer__stats dt {
  font-size: 0.75rem;
  font-weight: 700;
  color: color-mix(in srgb, var(--color-base-content, #141b1f) 64%, transparent);
}

.schema-explorer__stats dd {
  margin-top: 0.15rem;
  font-size: 1.45rem;
  font-weight: 800;
}

.schema-explorer__controls {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.schema-explorer__search-label {
  font-size: 0.9rem;
  font-weight: 700;
}

.schema-explorer__search-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--color-base-300, #d1d5db);
  border-radius: 0.5rem;
  background: var(--color-base-100, #fff);
  padding: 0.25rem 0.65rem;
}

.schema-explorer__search {
  min-height: 2.75rem;
  width: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
  font-size: 1rem;
  outline: none;
}

.schema-explorer__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  border-bottom: 1px solid var(--color-base-300, #d1d5db);
}

.schema-explorer__tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid transparent;
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 0.65rem 0.85rem;
  font-weight: 700;
}

.schema-explorer__tab--active {
  border-color: var(--color-base-300, #d1d5db);
  border-bottom-color: var(--color-base-100, #fff);
  background: var(--color-base-100, #fff);
  color: var(--color-primary, #4d768d);
}

.schema-explorer__workspace {
  display: grid;
  gap: 1rem;
}

@media (min-width: 1180px) {
  .schema-explorer__workspace {
    grid-template-columns: minmax(12rem, 16rem) minmax(0, 1fr) minmax(18rem, 25rem);
  }
}

.schema-explorer__class-list,
.schema-explorer__details,
.schema-map,
.schema-relations,
.schema-structured,
.schema-vocab {
  border: 1px solid var(--color-base-300, #d1d5db);
  border-radius: 0.5rem;
  background: var(--color-base-100, #fff);
}

.schema-explorer__class-list,
.schema-explorer__details,
.schema-map,
.schema-relations {
  min-width: 0;
}

.schema-explorer__panel-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  border-bottom: 1px solid var(--color-base-300, #d1d5db);
  padding: 0.75rem;
}

.schema-explorer__panel-heading h2 {
  min-width: 0;
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.25;
}

.schema-explorer__panel-heading span {
  flex-shrink: 0;
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--color-base-content, #141b1f) 64%, transparent);
}

.schema-explorer__class-buttons {
  display: grid;
  max-height: 44rem;
  gap: 0.35rem;
  overflow: auto;
  padding: 0.75rem;
}

.schema-explorer__class-button {
  display: flex;
  min-height: 3.2rem;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border-left: 0.25rem solid var(--color-base-300, #d1d5db);
  border-radius: 0.5rem;
  padding: 0.55rem 0.65rem;
  text-align: left;
  background: var(--color-base-200, #f3f4f6);
}

.schema-explorer__class-button span {
  font-weight: 800;
}

.schema-explorer__class-button small {
  color: color-mix(in srgb, var(--color-base-content, #141b1f) 66%, transparent);
}

.schema-explorer__class-button--active {
  outline: 2px solid var(--color-primary, #4d768d);
  outline-offset: 2px;
  background: color-mix(in srgb, var(--color-primary, #4d768d) 12%, var(--color-base-100, #fff));
}

.schema-explorer__class-button--spine,
.schema-map__node--spine {
  border-color: var(--color-work, #8ea1a1);
}

.schema-explorer__class-button--event,
.schema-map__node--event {
  border-color: var(--color-accent, #d8899c);
}

.schema-explorer__class-button--agent,
.schema-map__node--agent {
  border-color: var(--color-primary, #4d768d);
}

.schema-explorer__class-button--vocabulary,
.schema-map__node--vocabulary {
  border-color: var(--color-secondary, #000);
}

.schema-explorer__class-button--identifier,
.schema-map__node--identifier {
  border-color: var(--color-compare-list, #3a434a);
}

.schema-explorer__map-column {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1rem;
}

.schema-map__help {
  padding: 0.75rem 0.75rem 0;
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--color-base-content, #141b1f) 72%, transparent);
}

.schema-map__canvas {
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, minmax(5.5rem, 1fr));
  grid-template-areas:
    "work work manifestation manifestation item item"
    "title event event activity activity agent"
    "genre subject language format extent duration"
    "description description movingResource movingResource authority authority";
  gap: 1rem;
  min-height: 31rem;
  padding: 1rem;
  overflow: auto;
}

.schema-map__edges {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.schema-map__edge {
  stroke: var(--color-base-content, #141b1f);
  stroke-width: 0.35;
  stroke-linecap: round;
  opacity: 0.5;
}

.schema-map__edge--spine {
  stroke: var(--color-primary, #4d768d);
  stroke-width: 0.55;
  opacity: 0.82;
}

.schema-map__edge--event {
  stroke: var(--color-accent, #d8899c);
}

.schema-map__edge--authority {
  stroke: var(--color-compare-list, #3a434a);
}

.schema-map__edge--vocabulary {
  stroke: var(--color-secondary, #000);
}

.schema-map__arrow {
  fill: var(--color-base-content, #141b1f);
}

.schema-map__node {
  position: relative;
  z-index: 1;
  display: inline-flex;
  min-width: 0;
  min-height: 4.5rem;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.25rem;
  border: 2px solid var(--color-base-300, #d1d5db);
  border-radius: 0.5rem;
  background: color-mix(in srgb, var(--color-base-100, #fff) 92%, var(--color-primary, #4d768d));
  padding: 0.75rem;
  text-align: left;
  box-shadow: 0 0.4rem 1.4rem color-mix(in srgb, var(--color-neutral, #141b1f) 10%, transparent);
}

.schema-map__node--active {
  border-color: var(--color-primary, #4d768d);
  outline: 3px solid color-mix(in srgb, var(--color-primary, #4d768d) 32%, transparent);
  outline-offset: 2px;
}

.schema-map__node-label {
  max-width: 100%;
  font-weight: 900;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.schema-map__node-meta {
  font-size: 0.78rem;
  color: color-mix(in srgb, var(--color-base-content, #141b1f) 68%, transparent);
}

.schema-relations__list {
  display: grid;
  gap: 0.6rem;
  margin: 0;
  padding: 0.75rem;
  list-style: none;
}

.schema-relations__item {
  display: grid;
  gap: 0.25rem;
  border-left: 0.2rem solid var(--color-base-300, #d1d5db);
  padding-left: 0.65rem;
}

.schema-relations__item p {
  line-height: 1.45;
}

.schema-relations__item small {
  color: color-mix(in srgb, var(--color-base-content, #141b1f) 70%, transparent);
}

.schema-relations__kind {
  width: fit-content;
  border-radius: 999px;
  padding: 0.1rem 0.45rem;
  font-size: 0.7rem;
  font-weight: 800;
  background: var(--color-base-200, #f3f4f6);
}

.schema-relations__kind--spine {
  background: color-mix(in srgb, var(--color-primary, #4d768d) 18%, var(--color-base-100, #fff));
}

.schema-relations__kind--event {
  background: color-mix(in srgb, var(--color-accent, #d8899c) 24%, var(--color-base-100, #fff));
}

.schema-relations__kind--authority {
  background: color-mix(in srgb, var(--color-compare-list, #3a434a) 18%, var(--color-base-100, #fff));
}

.schema-explorer__details {
  padding-bottom: 0.75rem;
}

.schema-explorer__description,
.schema-explorer__subheading,
.schema-explorer__notes,
.schema-slot-list {
  margin: 0.75rem;
}

.schema-explorer__description {
  line-height: 1.6;
}

.schema-explorer__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.75rem;
}

.schema-chip,
.schema-slot__flag {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-base-300, #d1d5db);
  border-radius: 999px;
  background: var(--color-base-200, #f3f4f6);
  padding: 0.15rem 0.45rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.schema-explorer__subheading {
  font-size: 0.95rem;
  font-weight: 900;
}

.schema-explorer__notes {
  display: grid;
  gap: 0.4rem;
  padding-left: 1rem;
}

.schema-slot-list {
  display: grid;
  gap: 0.6rem;
  max-height: 31rem;
  overflow: auto;
}

.schema-slot {
  border: 1px solid var(--color-base-300, #d1d5db);
  border-radius: 0.5rem;
  padding: 0.65rem;
}

.schema-slot header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}

.schema-slot code,
.schema-relations__item code,
.schema-table code {
  color: var(--color-primary, #4d768d);
  font-weight: 800;
}

.schema-slot p {
  margin-top: 0.35rem;
  line-height: 1.5;
}

.schema-slot small {
  display: block;
  margin-top: 0.35rem;
  color: color-mix(in srgb, var(--color-base-content, #141b1f) 70%, transparent);
}

.schema-structured,
.schema-vocab {
  padding: 1rem;
}

.schema-structured > h2,
.schema-vocab > h2 {
  font-size: 1.25rem;
  font-weight: 900;
}

.schema-structured > p,
.schema-vocab > p {
  margin-top: 0.35rem;
  max-width: 52rem;
  line-height: 1.6;
}

.schema-structured__classes,
.schema-vocab__grid {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.schema-structured__class,
.schema-vocab__group {
  border: 1px solid var(--color-base-300, #d1d5db);
  border-radius: 0.5rem;
  padding: 0.9rem;
}

.schema-structured__class header,
.schema-vocab__group header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

.schema-structured__class h3,
.schema-vocab__group h3 {
  font-size: 1rem;
  font-weight: 900;
}

.schema-structured__class p,
.schema-vocab__group p {
  margin-top: 0.25rem;
  line-height: 1.55;
}

.schema-table-wrap {
  margin-top: 0.75rem;
  overflow: auto;
}

.schema-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.schema-table th,
.schema-table td {
  border-top: 1px solid var(--color-base-300, #d1d5db);
  padding: 0.55rem;
  text-align: left;
  vertical-align: top;
}

.schema-table thead th {
  border-top: 0;
  background: var(--color-base-200, #f3f4f6);
}

.schema-vocab__grid {
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
}

.schema-vocab__group header {
  justify-content: flex-start;
}

.schema-vocab__group dl {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
}

.schema-vocab__group dt {
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
}

.schema-vocab__group dd {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.25rem;
}

:where(button, input):focus-visible {
  outline: 3px solid var(--color-primary, #4d768d);
  outline-offset: 2px;
}

@media (max-width: 760px) {
  .schema-map__canvas {
    grid-template-columns: minmax(9rem, 1fr);
    grid-template-areas:
      "work"
      "manifestation"
      "item"
      "event"
      "activity"
      "agent"
      "title"
      "genre"
      "subject"
      "language"
      "format"
      "extent"
      "duration"
      "description"
      "movingResource"
      "authority";
  }

  .schema-map__edges {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
