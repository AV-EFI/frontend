<template>
    <section :id="`level-${level.id}`" class="explorer-band" :class="`band-${level.id}`" :aria-labelledby="`level-title-${level.id}`">
        <!-- The toggle button stretches over the whole header; the details button lies above it. -->
        <div class="explorer-band-head">
            <Icon :name="level.icon" class="explorer-band-mark" aria-hidden="true" />
            <button
                type="button"
                class="explorer-band-toggle"
                :data-focus="`level-${level.id}`"
                :aria-expanded="open"
                :aria-controls="open ? `level-body-${level.id}` : undefined"
                @click="store.toggleLevel(level.id)"
            >
                <span class="explorer-band-number" aria-hidden="true">{{ level.number }}</span>
                <Icon :name="level.icon" size="34" class="explorer-band-icon" aria-hidden="true" />
                <span class="explorer-band-title">
                    <span :id="`level-title-${level.id}`" class="explorer-band-word">{{ levelText.word }}</span>
                    <span class="explorer-band-gloss">{{ levelText.gloss }}</span>
                </span>
                <span class="btn btn-sm btn-primary explorer-band-action">
                    {{ open ? text.model.hideFields : text.model.showFields }}
                    <Icon :name="open ? 'tabler:caret-up' : 'tabler:caret-down'" size="16" aria-hidden="true" />
                </span>
            </button>
            <button
                type="button"
                class="btn btn-sm btn-primary explorer-band-info"
                :class="{ 'btn-active': detailsShown }"
                :aria-pressed="detailsShown"
                :aria-label="fill(text.model.detailsOf, { word: levelText.word })"
                @click="store.toggleLevelDetails(level.id)"
            >
                <Icon name="tabler:info-circle" size="18" aria-hidden="true" />
                {{ text.model.details }}
            </button>
        </div>

        <Transition name="explorer-expand">
            <div v-if="open" :id="`level-body-${level.id}`" class="explorer-band-body">
                <div
                    v-for="group in groups"
                    :id="`group-${level.id}-${group.id}`"
                    :key="group.id"
                    class="explorer-group"
                >
                    <span class="explorer-group-caption">{{ text.groups[group.id].title }}</span>
                    <div class="explorer-badges">
                        <ExplorerFieldBadge
                            v-for="name in group.slots"
                            :key="name"
                            :class-id="classId"
                            :slot-name="name"
                            :group-id="group.id"
                        />
                    </div>
                </div>

                <div class="explorer-shared-box">
                    <span class="explorer-group-caption is-strong">{{ text.model.sharedBox }}</span>
                    <div
                        v-for="group in shared"
                        :id="`group-${level.id}-${group.id}`"
                        :key="group.id"
                        class="explorer-group"
                    >
                        <span class="explorer-group-caption">{{ text.groups[group.id].title }}</span>
                        <div class="explorer-badges">
                            <ExplorerFieldBadge
                                v-for="name in group.slots"
                                :key="name"
                                :class-id="classId"
                                :slot-name="name"
                                :group-id="group.id"
                            />
                        </div>
                    </div>
                </div>

                <p class="explorer-coverage">
                    {{ fill(text.model.coverage, { shown: coverage.shown, total: coverage.total }) }}
                </p>
            </div>
        </Transition>
    </section>
</template>

<script setup lang="ts">
import { useExplorerStore } from '~/stores/explorerStore';
import { groupsOfLevel, levelCoverage, sharedGroups, type LevelDef } from '~/utils/explorer/model';
import { LEVEL_CLASS } from '~/utils/explorer/schemaModel';

const props = defineProps<{ level: LevelDef; open: boolean }>();

const store = useExplorerStore();
const { text, fill } = useExplorerTexts();

const classId = computed(() => LEVEL_CLASS[props.level.id]);
const levelText = computed(() => text.value.levels[props.level.id]);
const groups = computed(() => groupsOfLevel(props.level.id));
const shared = computed(() => sharedGroups());
const coverage = computed(() => levelCoverage(props.level.id));
const detailsShown = computed(() => store.selection?.kind === 'level' && store.selection.id === props.level.id);
</script>

<style scoped>
.explorer-band {
    position: relative;
    overflow: hidden;
    color: var(--ex-level-ink);
    background-color: var(--band-color);
    /* The grain is a transparent layer of dark specks (4 % at most), so the text contrast on the colour holds. */
    background-image: var(--ex-grain);
    box-shadow: var(--ex-shadow);
}

.band-work { --band-color: var(--color-work); }
.band-manifestation { --band-color: var(--color-manifestation); }
.band-item { --band-color: var(--color-item); }

/* A large pale copy of the level icon, as high as the header. It only lightens the colour, so it cannot lower the contrast. */
.explorer-band-mark {
    position: absolute;
    top: 0.4rem;
    right: 1rem;
    display: block;
    width: auto;
    height: calc(100% - 0.8rem);
    aspect-ratio: 1;
    color: var(--color-secondary-content);
    opacity: 0.16;
    pointer-events: none;
}

.explorer-band-head {
    position: relative;
    display: flex;
    align-items: stretch;
    gap: 0.75rem;
    padding-right: 1rem;
    cursor: pointer;
    transition: background-color 0.15s;
}

.explorer-band-head:hover {
    background-color: color-mix(in oklch, var(--color-secondary-content) 15%, transparent);
}

/* On the level colours the focus ring is dark, so it keeps 3:1 against the colour field in both themes. */
.explorer-band :focus-visible {
    outline-color: var(--ex-level-ink);
    box-shadow: none;
}

.explorer-band-toggle {
    flex: 1;
    display: grid;
    grid-template-columns: 3.25rem 2.75rem minmax(0, 1fr) auto;
    gap: 0.25rem 1rem;
    align-items: center;
    min-width: 0;
    padding: 1.2rem 0.5rem 1.2rem 1.4rem;
    text-align: left;
    color: inherit;
    background: transparent;
    border: 0;
    cursor: pointer;
}

/* The invisible stretch over the whole header makes all of it a click area. */
.explorer-band-toggle::after {
    content: '';
    position: absolute;
    inset: 0;
}

.explorer-band .explorer-band-toggle:focus-visible {
    outline: none;
}

.explorer-band-head:has(.explorer-band-toggle:focus-visible) {
    outline: 3px solid var(--ex-level-ink);
    outline-offset: -4px;
}

.explorer-band-number {
    font-family: 'BreeSerif', Georgia, 'Times New Roman', serif;
    font-size: 2.8rem;
    line-height: 0.9;
}

.explorer-band-icon {
    justify-self: center;
}

.explorer-band-word {
    display: block;
    font-family: 'BreeSerif', Georgia, 'Times New Roman', serif;
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.15;
}

.explorer-band-gloss {
    display: block;
    font-size: 0.9rem;
}

/* The site's outline button in the dark ink of the level colours, so it keeps its contrast in both themes. */
.explorer-band .btn-outline {
    --btn-color: var(--ex-level-ink);
    --btn-fg: var(--ex-level-ink);
    --btn-border: var(--ex-level-ink);
    --btn-bg: transparent;
}

.explorer-band .btn-outline:hover,
.explorer-band .btn-outline.btn-active {
    --btn-fg: var(--ex-level-ink);
    --btn-bg: color-mix(in oklch, var(--color-secondary-content) 35%, transparent);
}

/* The label next to the details button only tells what a click on the header does. */
.explorer-band-action {
    justify-content: center;
    min-width: 12rem;
    pointer-events: none;
    white-space: nowrap;
}

.explorer-band-info {
    position: relative;
    min-width: 7.5rem;
    z-index: 2;
    align-self: center;
}

.explorer-band-body {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    padding: 0 1.4rem 1.3rem 6.3rem;
}

.explorer-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.explorer-group-caption {
    font-size: 0.8rem;
    font-weight: 700;
}

.explorer-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.explorer-shared-box {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    margin-top: 0.4rem;
    padding-top: 0.8rem;
    border-top: 1px dashed currentColor;
}

.explorer-coverage {
    margin: 0;
    font-size: 0.78rem;
}

.explorer-expand-enter-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.explorer-expand-enter-from {
    opacity: 0;
    transform: translateY(-0.6rem);
}

@media (prefers-reduced-motion: reduce) {
    .explorer-expand-enter-active {
        transition: none;
    }
}

@media (max-width: 760px) {
    .explorer-band-head {
        flex-wrap: wrap;
        padding: 0 0.75rem 0.75rem;
    }

    .explorer-band-toggle {
        grid-template-columns: 2.5rem minmax(0, 1fr);
        padding: 0.9rem 0.25rem 0.25rem;
    }

    .explorer-band-icon {
        display: none;
    }

    .explorer-band-toggle .explorer-band-action {
        grid-column: 2;
        justify-self: start;
    }

    .explorer-band-body {
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .explorer-band-mark {
        display: none;
    }
}
</style>
