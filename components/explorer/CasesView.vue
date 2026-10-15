<template>
    <div>
        <div class="explorer-headrow">
            <div>
                <h2 class="explorer-lead">{{ text.cases.lead }}</h2>
                <p class="explorer-sub">{{ text.cases.sub }}</p>
            </div>
            <button
                type="button"
                class="btn btn-sm btn-outline explorer-rules-button"
                :class="{ 'btn-active': store.selection?.kind === 'caseRules' }"
                :aria-pressed="store.selection?.kind === 'caseRules'"
                @click="toggleRules"
            >
                {{ text.cases.rules }}
            </button>
        </div>

        <ul class="explorer-cards">
            <li v-for="(item, index) in CASES" :key="item.id" class="explorer-rise" :style="{ '--i': index }">
                <button
                    type="button"
                    class="explorer-card"
                    :class="{ 'is-solved': solved(item.id) }"
                    :aria-label="fill(text.cases.cardLabel, { name: text.cases[item.id].name, year: item.year, state: solved(item.id) ? text.cases.stateSolved : text.cases.stateOpen })"
                    @click="store.openCase(item.id)"
                >
                    <span class="explorer-card-thumb" aria-hidden="true">
                        <Icon :name="solved(item.id) ? 'tabler:circle-check' : 'tabler:stack-front'" size="44" />
                    </span>
                    <span class="explorer-card-label">
                        <span class="explorer-card-name">{{ text.cases[item.id].name }}</span>
                        <span class="explorer-card-year">{{ item.year }}</span>
                        <span class="badge explorer-card-flag" :class="solved(item.id) ? 'badge-outline' : 'badge-primary'">
                            <Icon v-if="solved(item.id)" name="tabler:circle-check" size="14" aria-hidden="true" />
                            {{ solved(item.id) ? text.cases.solved : text.cases.open }}
                        </span>
                        <span class="explorer-card-why">{{ text.cases[item.id].sub }}</span>
                    </span>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useExplorerStore } from '~/stores/explorerStore';
import { CASES } from '~/utils/explorer/cases';

const store = useExplorerStore();
const { text, fill } = useExplorerTexts();

const solved = (id: string): boolean => store.solvedCaseIds.includes(id);

function toggleRules() {
    if (store.selection?.kind === 'caseRules') store.closeDrawer();
    else store.select({ kind: 'caseRules' });
}
</script>

<style scoped>
.explorer-headrow {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
}

.explorer-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
    gap: 2.75rem 1.75rem;
    margin: 2.75rem 0 0;
    padding: 0;
    list-style: none;
}

.explorer-card {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0;
    text-align: left;
    background: transparent;
    border: 0;
    cursor: pointer;
}

.explorer-card-thumb {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 5.25rem;
    height: 5.25rem;
    margin-bottom: -1.1rem;
    margin-left: 1rem;
    color: var(--color-neutral-content);
    background: var(--color-neutral);
    border: 3px solid var(--color-neutral-content);
    border-radius: 50%;
    box-shadow: var(--ex-shadow);
}

/* Hovering adds a ring around the icon; the border of the icon stays. */
.explorer-card:hover .explorer-card-thumb,
.explorer-card:focus-visible .explorer-card-thumb {
    box-shadow: 0 0 0 0.3rem var(--color-highlight), var(--ex-shadow);
}

.explorer-card.is-solved .explorer-card-thumb {
    border-color: var(--color-success);
}

.explorer-card-label {
    padding: 1.7rem 0.9rem 0.8rem;
    color: var(--ex-ink);
    background: var(--ex-paper);
    box-shadow: var(--ex-shadow);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.explorer-card:hover .explorer-card-label {
    box-shadow: 0 0.7rem 1.4rem color-mix(in oklch, var(--color-neutral) 35%, transparent);
    transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
    .explorer-card-label {
        transition: none;
    }

    .explorer-card:hover .explorer-card-label {
        transform: none;
    }
}

.explorer-card-name {
    display: block;
    font-size: 0.95rem;
    font-weight: 800;
    line-height: 1.2;
}

.explorer-card-year {
    font-size: 0.75rem;
    font-style: italic;
    color: var(--ex-paper-muted);
}

.explorer-card-flag {
    display: flex;
    width: fit-content;
    margin-top: 0.35rem;
}

/* The outline button sits on the primary colour of the cases stage, so it takes that stage's text colour. */
.explorer-rules-button {
    --btn-color: var(--color-primary-content);
    --btn-fg: var(--color-primary-content);
    --btn-border: var(--color-primary-content);
    --btn-bg: transparent;
}

.explorer-rules-button:hover,
.explorer-rules-button.btn-active {
    --btn-fg: var(--color-primary);
    --btn-bg: var(--color-primary-content);
}

.explorer-card-why {
    display: block;
    margin-top: 0.3rem;
    font-size: 0.8rem;
    color: var(--ex-paper-muted);
}
</style>
