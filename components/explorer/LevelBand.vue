<template>
    <section :id="`level-${level.id}`" class="explorer-band" :class="`band-${level.id}`" :aria-labelledby="`level-title-${level.id}`">
        <button
            type="button"
            class="explorer-band-head"
            :data-focus="`level-${level.id}`"
            :aria-expanded="open"
            :aria-controls="`level-body-${level.id}`"
            @click="store.toggleLevel(level.id, isLargeScreen)"
        >
            <span class="explorer-band-number" aria-hidden="true">{{ level.number }}</span>
            <Icon :name="level.icon" size="34" class="explorer-band-icon" aria-hidden="true" />
            <span class="explorer-band-title">
                <span :id="`level-title-${level.id}`" class="explorer-band-word">{{ levelText.word }}</span>
                <span class="explorer-band-gloss">{{ levelText.gloss }}</span>
            </span>
            <span class="explorer-band-toggle">{{ open ? text.model.hideFields : text.model.showFields }}</span>
        </button>

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
const { isLargeScreen } = useIsLargeScreen('(min-width: 1100px)');

const classId = computed(() => LEVEL_CLASS[props.level.id]);
const levelText = computed(() => text.value.levels[props.level.id]);
const groups = computed(() => groupsOfLevel(props.level.id));
const shared = computed(() => sharedGroups());
const coverage = computed(() => levelCoverage(props.level.id));
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
    display: grid;
    grid-template-columns: 4rem 2.75rem minmax(0, 1fr) auto;
    gap: 0.25rem 1rem;
    align-items: center;
    width: 100%;
    padding: 1.4rem 1.6rem;
    text-align: left;
    color: inherit;
    background: transparent;
    border: 0;
    cursor: pointer;
}

.explorer-band-head:hover {
    background: color-mix(in oklch, var(--ex-paper) 12%, transparent);
}

.explorer-band-number {
    font-family: 'BreeSerif', Georgia, 'Times New Roman', serif;
    font-size: 3.1rem;
    line-height: 0.9;
}

.explorer-band-icon {
    justify-self: center;
}

.explorer-band-word {
    display: block;
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
}

.explorer-band-gloss {
    display: block;
    font-size: 0.9rem;
}

.explorer-band-toggle {
    padding: 0.25rem 0.65rem;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
    border: 1px solid currentColor;
}

.explorer-band-body {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    padding: 0 1.6rem 1.4rem 6.6rem;
}

.explorer-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.explorer-group-caption {
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
}

.explorer-group-caption.is-strong {
    font-size: 0.72rem;
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
        grid-template-columns: 2.5rem minmax(0, 1fr);
        padding: 1rem;
    }

    .explorer-band-icon {
        display: none;
    }

    .explorer-band-toggle {
        grid-column: 2;
        justify-self: start;
    }

    .explorer-band-body {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}
</style>
