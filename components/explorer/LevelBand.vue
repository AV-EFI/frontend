<template>
    <section :id="`level-${level.id}`" class="explorer-band" :class="`band-${level.id}`" :aria-labelledby="`level-title-${level.id}`">
        <div class="explorer-band-head">
            <button
                type="button"
                class="explorer-band-toggle"
                :data-focus="`level-${level.id}`"
                :aria-expanded="open"
                :aria-controls="`level-body-${level.id}`"
                @click="store.toggleLevel(level.id)"
            >
                <span class="explorer-band-number" aria-hidden="true">{{ level.number }}</span>
                <Icon :name="level.icon" size="34" class="explorer-band-icon" aria-hidden="true" />
                <span class="explorer-band-title">
                    <span :id="`level-title-${level.id}`" class="explorer-band-word">{{ levelText.word }}</span>
                    <span class="explorer-band-gloss">{{ levelText.gloss }}</span>
                </span>
                <span class="explorer-band-action">{{ open ? text.model.hideFields : text.model.showFields }}</span>
            </button>
            <button
                type="button"
                class="explorer-band-action explorer-band-info"
                :aria-pressed="detailsShown"
                :aria-label="fill(text.model.detailsOf, { word: levelText.word })"
                @click="store.toggleLevelDetails(level.id)"
            >
                <Icon name="tabler:info-circle" size="18" aria-hidden="true" />
                {{ text.model.details }}
            </button>
        </div>

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
                            shared
                        />
                    </div>
                </div>
            </div>

            <p class="explorer-coverage">
                {{ fill(text.model.coverage, { shown: coverage.shown, total: coverage.total }) }}
            </p>
        </div>
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
    color: var(--ex-level-ink);
    background: var(--band-color);
}

.band-work { --band-color: var(--color-work); }
.band-manifestation { --band-color: var(--color-manifestation); }
.band-item { --band-color: var(--color-item); }

/* Grain keeps the flat colour field from looking like a plain box. It is decoration only. */
.explorer-band::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: var(--ex-grain);
    mix-blend-mode: multiply;
    opacity: 0.28;
}

.explorer-band > * {
    position: relative;
    z-index: 1;
}

.explorer-band-head {
    display: flex;
    align-items: stretch;
    gap: 0.5rem;
    padding-right: 1rem;
}

.explorer-band-toggle {
    display: grid;
    flex: 1;
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

.explorer-band-toggle:hover {
    background: color-mix(in oklch, var(--ex-paper) 12%, transparent);
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

.explorer-band-action {
    padding: 0.25rem 0.7rem;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
    border: 1px solid currentColor;
}

.explorer-band-info {
    align-self: center;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: inherit;
    background: transparent;
    cursor: pointer;
}

.explorer-band-info:hover,
.explorer-band-info[aria-pressed='true'] {
    background: color-mix(in oklch, var(--ex-paper) 35%, transparent);
}

.explorer-band-info[aria-pressed='true'] {
    box-shadow: inset 0 -3px 0 currentColor;
}

.explorer-band-body {
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
}
</style>
