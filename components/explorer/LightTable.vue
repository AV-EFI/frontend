<template>
    <dialog
        ref="dialog"
        class="explorer-dialog"
        :aria-labelledby="current ? 'explorer-table-title' : undefined"
        @close="store.closeCase()"
        @click="closeOnBackdrop"
    >
        <div v-if="current" class="explorer-table">
            <button type="button" class="explorer-table-close" @click="store.closeCase()">{{ ct.close }}</button>
            <h2 id="explorer-table-title" ref="heading" tabindex="-1">{{ caseText.tableTitle }}</h2>
            <p class="explorer-table-sub">{{ caseText.sub }}</p>

            <ol class="explorer-steps" :aria-label="ct.progress">
                <li v-for="(step, index) in ct.steps" :key="step" :class="stepClass(index)">
                    {{ step }}<span v-if="index < stepNow" class="sr-only"> ({{ ct.stepDone }})</span>
                    <span v-else-if="index === stepNow" class="sr-only"> ({{ ct.stepCurrent }})</span>
                </li>
            </ol>

            <div class="explorer-cmp">
                <div class="explorer-cmp-head">
                    <h3>{{ ct.newDelivery }}</h3>
                    <p>{{ caseText.docs[0] }}</p>
                </div>
                <div class="explorer-cmp-head is-mid">
                    <h3>{{ ct.yourJudgement }}</h3>
                    <p>{{ ct.sameOrNot }}</p>
                </div>
                <div class="explorer-cmp-head">
                    <h3>{{ ct.existing }}</h3>
                    <p>{{ caseText.docs[1] }}</p>
                </div>

                <template v-for="(row, index) in current.rows" :key="index">
                    <div class="explorer-cell">
                        <small>{{ rowLabel(row) }}</small>
                        <b>{{ valueText(row.incoming) }}</b>
                    </div>

                    <fieldset class="explorer-judge" :disabled="decided !== null">
                        <legend class="sr-only">
                            {{ fill(ct.groupLabel, { field: rowLabel(row), a: valueText(row.incoming), b: valueText(row.existing) }) }}
                        </legend>
                        <div class="explorer-judge-buttons">
                            <label
                                v-for="mode in MODES"
                                :key="mode.id"
                                class="explorer-judge-option"
                                :class="[`is-${mode.id}`, { 'is-on': judgements[index]?.mode === mode.id }]"
                            >
                                <input
                                    type="radio"
                                    class="sr-only"
                                    :name="`judge-${index}`"
                                    :value="mode.id"
                                    :checked="judgements[index]?.mode === mode.id"
                                    @change="judge(index, mode.id)"
                                >
                                <Icon :name="mode.icon" size="20" aria-hidden="true" />
                                <span>{{ ct[mode.id] }}</span>
                            </label>
                        </div>
                        <template v-if="judgements[index]?.mode === 'own'">
                            <label class="sr-only" :for="`own-${index}`">{{ fill(ct.ownLabel, { field: rowLabel(row) }) }}</label>
                            <input
                                :id="`own-${index}`"
                                class="explorer-own"
                                :value="judgements[index]?.value"
                                :placeholder="ct.ownPlaceholder"
                                :disabled="decided !== null"
                                @input="setOwn(index, $event)"
                            >
                        </template>
                        <p v-if="decided !== null && judgements[index]" class="explorer-review" :class="{ 'is-wrong': review(index) === 'wrong' }">
                            <Icon :name="review(index) === 'wrong' ? 'tabler:alert-circle' : 'tabler:circle-check'" size="18" aria-hidden="true" />
                            <span>{{ reviewText(row, index) }}</span>
                        </p>
                    </fieldset>

                    <div class="explorer-cell">
                        <small>{{ rowLabel(row) }}</small>
                        <b>{{ valueText(row.existing) }}</b>
                    </div>
                </template>
            </div>

            <template v-if="decided === null">
                <p class="explorer-instruction">{{ ready ? ct.instructionReady : ct.instructionOpen }}</p>
                <div class="explorer-decide">
                    <button
                        v-for="choice in choices"
                        :key="choice.id"
                        type="button"
                        class="btn btn-outline"
                        :disabled="!ready"
                        @click="decide(choice.id)"
                    >
                        {{ choiceText(choice.id).label }}
                    </button>
                </div>
            </template>

            <template v-else>
                <div class="explorer-verdict" :class="{ 'is-warn': !decidedCorrect }">
                    <h3 ref="verdictHeading" tabindex="-1">{{ choiceText(decided).head }}</h3>
                    <p>{{ choiceText(decided).text }}</p>
                    <p class="explorer-verdict-source">{{ fill(ct.source, { source: caseText.source }) }}</p>
                    <p v-if="misjudged"><b>{{ ct.aboutJudgements }}</b> {{ caseText.ruleNote }}</p>
                </div>
                <p v-if="choiceText(decided).log" class="explorer-log">{{ fill(ct.log, { entry: choiceText(decided).log ?? '' }) }}</p>
                <div class="explorer-decide">
                    <button v-if="decidedCorrect" type="button" class="btn btn-primary" @click="store.closeCase()">{{ ct.continue }}</button>
                    <button v-else type="button" class="btn btn-outline" @click="decided = null">{{ ct.again }}</button>
                </div>
            </template>
        </div>
    </dialog>
</template>

<script setup lang="ts">
import { useExplorerStore } from '~/stores/explorerStore';
import { allJudged, hasMisjudgedRow, isCorrectChoice, reviewRow, type JudgementMode, type Judgements } from '~/utils/explorer/caseEngine';
import { getCase, type CaseRow, type CaseValue, type ExplorerCase } from '~/utils/explorer/cases';

interface ChoiceText {
    label: string;
    head: string;
    text: string;
    log?: string;
}

const MODES = [
    { id: 'same', icon: 'tabler:equal' },
    { id: 'diff', icon: 'tabler:equal-not' },
    { id: 'own', icon: 'tabler:pencil' },
] as const;

const store = useExplorerStore();
const { text, fill } = useExplorerTexts();

const dialog = ref<HTMLDialogElement | null>(null);
const heading = ref<HTMLElement | null>(null);
const verdictHeading = ref<HTMLElement | null>(null);

const judgements = ref<Judgements>({});
const decided = ref<string | null>(null);
/** The decisions are shown in a random order and look alike, so neither position nor style gives the answer away. */
const choices = ref<ExplorerCase['choices'][number][]>([]);

const ct = computed(() => text.value.cases.table);
const current = computed(() => (store.activeCaseId ? getCase(store.activeCaseId) ?? null : null));
const caseText = computed(() => text.value.cases[current.value?.id ?? 'undine']);

const ready = computed(() => (current.value ? allJudged(current.value, judgements.value) : false));
const stepNow = computed(() => (decided.value ? 3 : ready.value ? 2 : 1));
const decidedCorrect = computed(() => (current.value && decided.value ? isCorrectChoice(current.value, decided.value) : false));
const misjudged = computed(() => (current.value ? hasMisjudgedRow(current.value, judgements.value) : false));

function stepClass(index: number): string {
    if (index < stepNow.value) return 'is-done';
    return index === stepNow.value ? 'is-on' : '';
}

const rowLabel = (row: CaseRow): string => text.value.cases.rowLabels[row.label];
const valueText = (value: CaseValue): string => (typeof value === 'string' ? value : text.value.cases.values[value.key]);
function choiceText(id: string): ChoiceText {
    const choice = (caseText.value.choices as Record<string, ChoiceText>)[id];
    if (!choice) throw new Error(`The case has no text for the decision ${id}`);
    return choice;
}

function review(index: number) {
    const row = current.value?.rows[index];
    const judgement = judgements.value[index];
    return row && judgement ? reviewRow(row, judgement) : null;
}

function reviewText(row: CaseRow, index: number): string {
    const judgement = judgements.value[index];
    const result = review(index);
    if (!judgement || !result) return '';
    if (result === 'own') return fill(ct.value.ownValue, { value: judgement.value.trim() || ct.value.empty });
    if (result === 'correct') return ct.value.rightJudgement;
    return row.same ? ct.value.reallySame : ct.value.reallyDiffer;
}

function shuffled<T>(items: readonly T[]): T[] {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index--) {
        const other = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[other]] = [copy[other]!, copy[index]!];
    }
    return copy;
}

async function judge(index: number, mode: JudgementMode) {
    const previous = judgements.value[index];
    judgements.value = { ...judgements.value, [index]: { mode, value: previous?.mode === 'own' ? previous.value : '' } };
    if (mode === 'own') {
        await nextTick();
        document.getElementById(`own-${index}`)?.focus();
    }
}

function setOwn(index: number, event: Event) {
    const judgement = judgements.value[index];
    if (judgement) judgement.value = (event.target as HTMLInputElement).value;
}

async function decide(choiceId: string) {
    decided.value = choiceId;
    if (current.value && isCorrectChoice(current.value, choiceId)) store.markSolved(current.value.id);
    await nextTick();
    verdictHeading.value?.focus();
    verdictHeading.value?.scrollIntoView({ block: 'nearest' });
}

/** A click on the dark backdrop closes the table; clicks inside the sheet do not reach the dialog element itself. */
function closeOnBackdrop(event: MouseEvent) {
    if (event.target === dialog.value) store.closeCase();
}

watch(
    () => store.activeCaseId,
    async (id) => {
        const element = dialog.value;
        if (!element) return;
        if (id) {
            judgements.value = {};
            decided.value = null;
            choices.value = shuffled(getCase(id)?.choices ?? []);
            if (!element.open) element.showModal();
            await nextTick();
            heading.value?.focus();
        } else if (element.open) {
            element.close();
        }
    },
    { flush: 'post' },
);
</script>

<style scoped>
.explorer-dialog {
    width: min(65rem, calc(100% - 2rem));
    max-width: none;
    max-height: calc(100dvh - 2rem);
    padding: 0;
    margin: auto;
    overflow: auto;
    color: var(--color-base-content);
    background: var(--color-base-100);
    border: 1px solid var(--ex-line);
}

.explorer-dialog::backdrop {
    background: rgb(5 8 10 / 0.72);
}

.explorer-table {
    position: relative;
    padding: 1.4rem 1.5rem 1.25rem;
}

.explorer-table-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.3rem 0.75rem;
    font-size: 0.85rem;
    background: transparent;
    border: 1px solid var(--ex-line);
    cursor: pointer;
}

.explorer-table h2 {
    margin: 0 0 0.1rem;
    padding-right: 6rem;
    font-family: 'BreeSerif', Georgia, 'Times New Roman', serif;
    font-size: 1.75rem;
    font-weight: 400;
}

.explorer-table h2:focus,
.explorer-verdict h3:focus {
    outline: none;
}

.explorer-table-sub {
    margin: 0 0 1rem;
    font-size: 0.85rem;
    color: var(--ex-muted);
}

.explorer-steps {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0 0 0.9rem;
    padding: 0;
    list-style: none;
}

.explorer-steps li {
    padding: 0.2rem 0.65rem;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--ex-muted);
    border: 1px solid var(--ex-line);
}

.explorer-steps li.is-on {
    color: var(--color-primary-content);
    background: var(--color-primary);
    border-color: var(--color-primary);
}

.explorer-steps li.is-done {
    color: var(--color-base-content);
    border-color: var(--color-success);
}

.explorer-cmp {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 17rem minmax(0, 1fr);
}

.explorer-cmp-head {
    position: relative;
    padding: 1.1rem 1rem 0.5rem;
    color: var(--ex-ink);
    background: var(--ex-paper);
}

.explorer-cmp-head::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 0.5rem;
    background: repeating-linear-gradient(90deg, var(--ex-ink) 0 0.5rem, transparent 0.5rem 1.1rem);
    opacity: 0.85;
}

.explorer-cmp-head h3 {
    margin: 0.25rem 0 0.1rem;
    font-size: 0.78rem;
    font-weight: 800;
    color: var(--ex-paper-muted);
}

.explorer-cmp-head p {
    margin: 0;
    font-family: 'BreeSerif', Georgia, 'Times New Roman', serif;
    font-size: 1.1rem;
}

.explorer-cmp-head.is-mid {
    color: var(--color-base-content);
    text-align: center;
    background: transparent;
}

.explorer-cmp-head.is-mid::before {
    display: none;
}

.explorer-cmp-head.is-mid h3 {
    color: var(--ex-muted);
}

.explorer-cmp-head.is-mid p {
    font-family: inherit;
    font-size: 0.82rem;
    color: var(--ex-muted);
}

.explorer-cell {
    padding: 0.55rem 1rem 0.5rem;
    color: var(--ex-ink);
    background: var(--ex-paper);
    border-top: 1px solid var(--ex-paper-line);
}

.explorer-cell small {
    display: block;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--ex-paper-muted);
}

.explorer-cell b {
    font-size: 1rem;
    font-weight: 600;
}

.explorer-judge {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.4rem;
    min-width: 0;
    padding: 0.5rem 0.75rem;
    margin: 0;
    border: 0;
}

.explorer-judge-buttons {
    display: flex;
    gap: 0.4rem;
}

.explorer-judge-option {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
    padding: 0.4rem 0.2rem 0.35rem;
    font-size: 0.78rem;
    font-weight: 700;
    line-height: 1.15;
    text-align: center;
    background: var(--color-base-100);
    border: 1px solid var(--ex-line);
    cursor: pointer;
}

.explorer-judge-option:hover {
    border-color: var(--ex-muted);
}

.explorer-judge-option.is-on {
    color: var(--color-primary-content);
    background: var(--color-primary);
    border-color: var(--color-primary);
}

.explorer-judge-option.is-diff.is-on {
    color: var(--color-base-100);
    background: var(--color-base-content);
    border-color: var(--color-base-content);
}

.explorer-judge-option.is-own.is-on {
    color: var(--color-base-content);
    background: var(--color-base-300);
    border-color: var(--color-base-content);
}

.explorer-judge-option:has(input:focus-visible) {
    outline: 3px solid var(--color-base-content);
    outline-offset: 2px;
}

.explorer-own {
    width: 100%;
    padding: 0.4rem 0.55rem;
    font: inherit;
    font-size: 0.85rem;
    color: var(--color-base-content);
    background: var(--color-base-100);
    border: 1px solid var(--ex-muted);
}

.explorer-review {
    display: flex;
    gap: 0.35rem;
    align-items: flex-start;
    margin: 0;
    font-size: 0.75rem;
    color: var(--color-base-content);
}

.explorer-review.is-wrong {
    font-weight: 700;
    color: var(--color-primary-text);
}

.explorer-instruction {
    margin: 0.9rem 0 0;
    padding: 0.7rem 0.9rem;
    font-size: 0.9rem;
    background: var(--color-base-200);
    border-left: 4px solid var(--color-primary);
}

.explorer-decide {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 0.8rem;
}

.explorer-verdict {
    margin-top: 0.9rem;
    padding: 0.9rem 1rem;
    background: var(--color-base-200);
    border-left: 4px solid var(--color-success);
}

.explorer-verdict.is-warn {
    border-left-color: var(--color-base-content);
}

.explorer-verdict h3 {
    margin: 0 0 0.25rem;
    font-size: 0.78rem;
}

.explorer-verdict p {
    margin: 0.25rem 0;
}

.explorer-verdict-source {
    font-size: 0.8rem;
    color: var(--ex-muted);
}

.explorer-log {
    margin: 0.75rem 0 0;
    padding: 0.5rem 0.75rem;
    font-family: ui-monospace, Menlo, Consolas, monospace;
    font-size: 0.75rem;
    color: var(--ex-muted);
    border: 1px dashed var(--ex-line);
}

@media (max-width: 760px) {
    .explorer-cmp {
        grid-template-columns: 1fr;
    }

    .explorer-cmp-head.is-mid {
        display: none;
    }
}
</style>
