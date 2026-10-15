<template>
    <div>
        <div class="explorer-headrow">
            <div>
                <h2 class="explorer-lead">{{ text.cases.lead }}</h2>
                <p class="explorer-sub">{{ text.cases.sub }}</p>
            </div>
            <button
                type="button"
                class="explorer-ghost"
                :aria-pressed="store.selection?.kind === 'caseRules'"
                @click="toggleRules"
            >
                {{ text.cases.rules }}
            </button>
        </div>

        <ul class="explorer-cards">
            <li v-for="item in CASES" :key="item.id">
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
                        <span class="explorer-card-flag">{{ solved(item.id) ? text.cases.solved : text.cases.open }}</span>
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
    color: var(--color-highlight);
    background: var(--color-neutral);
    border: 3px solid var(--ex-paper);
    border-radius: 50%;
    box-shadow: var(--ex-shadow);
}

.explorer-card:hover .explorer-card-thumb {
    border-color: var(--color-highlight);
}

.explorer-card.is-solved .explorer-card-thumb {
    border-color: var(--color-success);
}

.explorer-card-label {
    padding: 1.7rem 0.9rem 0.8rem;
    color: var(--ex-ink);
    background: var(--ex-paper);
    box-shadow: var(--ex-shadow);
}

.explorer-card-name {
    display: block;
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    line-height: 1.2;
    text-transform: uppercase;
}

.explorer-card-year {
    font-size: 0.75rem;
    font-style: italic;
    color: var(--ex-paper-muted);
}

.explorer-card-flag {
    display: block;
    width: fit-content;
    margin-top: 0.35rem;
    padding: 0.1rem 0.45rem;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-highlight);
    background: var(--color-accent-content);
}

.explorer-card.is-solved .explorer-card-flag {
    color: var(--ex-ink);
    background: var(--color-success);
}

.explorer-card-why {
    display: block;
    margin-top: 0.3rem;
    font-size: 0.8rem;
    color: var(--ex-paper-muted);
}
</style>
