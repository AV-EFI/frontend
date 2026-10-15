<template>
    <aside v-if="selection" class="explorer-drawer" :style="{ top: topOffset }" aria-labelledby="explorer-drawer-title">
        <header class="explorer-drawer-head">
            <button type="button" class="explorer-drawer-close" @click="store.closeDrawer()">
                {{ text.drawer.close }}
            </button>
            <span class="explorer-drawer-kicker">
                <Icon v-if="kickerIcon" :name="kickerIcon" size="18" aria-hidden="true" />
                {{ head.kicker }}
            </span>
            <h2 id="explorer-drawer-title" ref="title" tabindex="-1">{{ head.title }}</h2>
            <p v-if="head.lead">{{ head.lead }}</p>
        </header>

        <!-- overview -->
        <template v-if="selection.kind === 'overview'">
            <section class="explorer-drawer-section">
                <ul class="explorer-terms">
                    <li v-for="level in LEVELS" :key="level.id">
                        <b>{{ text.levels[level.id].word }}</b>
                        {{ text.levels[level.id].definition }}
                    </li>
                </ul>
            </section>
            <section class="explorer-drawer-section">
                <h3>{{ text.links.heading }}</h3>
                <ExplorerFurtherLinks />
            </section>
            <p class="explorer-drawer-note">{{ text.drawer.overviewNote }}</p>
        </template>

        <!-- one level -->
        <template v-else-if="selection.kind === 'level'">
            <section class="explorer-drawer-section">
                <h3>{{ text.drawer.adjacent }}</h3>
                <div class="explorer-golist">
                    <button v-for="other in neighbours" :key="other.id" type="button" @click="store.goToLevel(other.id)">
                        <Icon :name="other.icon" size="18" aria-hidden="true" />
                        {{ text.levels[other.id].word }}
                    </button>
                </div>
            </section>
            <section class="explorer-drawer-section">
                <h3>{{ text.drawer.levelHint }}</h3>
                <p class="explorer-drawer-text">{{ text.levels[selection.id].hint }}</p>
            </section>
            <section class="explorer-drawer-section">
                <h3>{{ text.drawer.levelFields }}</h3>
                <div class="explorer-golist">
                    <button
                        v-for="group in levelGroups"
                        :key="group.id"
                        type="button"
                        @click="store.select({ kind: 'group', id: group.id })"
                    >
                        {{ text.groups[group.id].title }}
                    </button>
                </div>
            </section>
            <section v-if="levelUpRule" class="explorer-drawer-section">
                <h3>{{ text.drawer.levelRule }}</h3>
                <div class="explorer-golist">
                    <button type="button" @click="store.select({ kind: 'rule', id: levelUpRule })">
                        {{ text.rules[levelUpRule].title }}
                    </button>
                </div>
            </section>
            <section class="explorer-drawer-section">
                <h3>{{ text.links.heading }}</h3>
                <ul class="explorer-plain-list">
                    <li><NuxtLink to="/faq#faq-sections-definitions" class="explorer-text-link">{{ text.links.faqDefinitions }}</NuxtLink></li>
                    <li>
                        <a :href="schemaDocsUrl(LEVEL_CLASS[selection.id])" target="_blank" rel="noopener noreferrer" class="explorer-text-link">
                            {{ text.links.schemaDocs }}
                            <Icon name="tabler:external-link" size="13" aria-hidden="true" />
                            <span class="sr-only"> ({{ text.links.newTab }})</span>
                        </a>
                    </li>
                </ul>
            </section>
        </template>

        <!-- rule between levels -->
        <template v-else-if="selection.kind === 'rule'">
            <section class="explorer-drawer-section">
                <h3>{{ text.drawer.connects }}</h3>
                <div class="explorer-golist">
                    <button v-for="id in ruleLevels" :key="id" type="button" @click="store.goToLevel(id)">
                        <Icon :name="getLevel(id).icon" size="18" aria-hidden="true" />
                        {{ text.levels[id].word }}
                    </button>
                </div>
            </section>
            <section class="explorer-drawer-section">
                <h3>{{ text.drawer.fieldsOfRule }}</h3>
                <ul class="explorer-fields">
                    <ExplorerFieldItem v-for="ref in RULES[selection.id].fields" :key="ref" :field-ref="ref" :selected="false" />
                </ul>
            </section>
            <section class="explorer-drawer-section">
                <ul class="explorer-plain-list">
                    <li><NuxtLink to="/faq#faq-sections-efis" class="explorer-text-link">{{ text.links.faqEfis }}</NuxtLink></li>
                </ul>
            </section>
        </template>

        <!-- a group of fields -->
        <template v-else-if="selection.kind === 'group' && group">
            <section class="explorer-drawer-section">
                <h3>{{ text.drawer.showInOverview }}</h3>
                <div class="explorer-golist">
                    <button v-for="id in groupLevels" :key="id" type="button" @click="store.showGroupAt(group.id, id)">
                        <Icon :name="getLevel(id).icon" size="18" aria-hidden="true" />
                        {{ fill(text.drawer.showAt, { word: text.levels[id].word }) }}
                    </button>
                </div>
            </section>
            <section class="explorer-drawer-section">
                <template v-for="part in fieldsByClass" :key="part.classId">
                    <span v-if="fieldsByClass.length > 1" class="explorer-classtag">{{ part.label }}</span>
                    <ul class="explorer-fields">
                        <ExplorerFieldItem
                            v-for="ref in part.refs"
                            :key="ref"
                            :field-ref="ref"
                            :selected="isSelectedField(ref)"
                        />
                    </ul>
                </template>
            </section>
            <section v-if="extra" class="explorer-drawer-section explorer-extra">
                <h3>{{ extra.heading }}</h3>
                <p v-if="'path' in extra" class="explorer-path" lang="en">
                    <template v-for="(step, index) in extra.path" :key="step">
                        <span v-if="index > 0" aria-hidden="true">→ </span>{{ step }}<br>
                    </template>
                </p>
                <p v-for="paragraph in extra.paragraphs" :key="paragraph" class="explorer-drawer-text">{{ paragraph }}</p>
                <p class="explorer-drawer-source">{{ text.extras.source }}: {{ extra.source }}</p>
            </section>
            <div v-if="hasMatch" class="explorer-bridge">
                {{ text.groups.matchBridge }}
                <button type="button" class="btn btn-primary btn-sm mt-2" @click="toCases">{{ text.groups.toCases }}</button>
            </div>
            <p class="explorer-drawer-note">{{ text.groups.schemaNote }}</p>
        </template>

        <!-- how the work match decides -->
        <template v-else-if="selection.kind === 'caseRules'">
            <section class="explorer-drawer-section">
                <ul class="explorer-terms">
                    <li v-for="item in text.drawer.casesTerms" :key="item.term">
                        <b>{{ item.term }}</b>
                        {{ item.text }}
                    </li>
                </ul>
            </section>
            <p class="explorer-drawer-note">{{ text.drawer.casesNote }}</p>
        </template>

        <!-- rules of a delivery -->
        <template v-else-if="selection.kind === 'imports'">
            <section class="explorer-drawer-section">
                <ul class="explorer-fields">
                    <li v-for="rule in IMPORT_RULES" :key="rule.id" class="explorer-field">
                        <div class="explorer-field-head">
                            <b>{{ text.imports.items[rule.id].title }}</b>
                            <span class="explorer-tag">{{ text.imports.kind[rule.kind] }}</span>
                        </div>
                        <p class="explorer-field-text">{{ text.imports.items[rule.id].text }}</p>
                        <span class="explorer-field-meta">{{ fill(text.cases.table.source, { source: text.imports.items[rule.id].source }) }}</span>
                    </li>
                </ul>
            </section>
            <p class="explorer-drawer-note">{{ text.imports.note }}</p>
        </template>
    </aside>
</template>

<script setup lang="ts">
import { useExplorerStore } from '~/stores/explorerStore';
import { schemaDocsUrl } from '~/utils/explorer/links';
import {
    IMPORT_RULES,
    LEVELS,
    RULES,
    getGroup,
    getLevel,
    groupDetailFields,
    groupHasMatch,
    groupsOfLevel,
    levelsOfGroup,
} from '~/utils/explorer/model';
import { LEVEL_CLASS, getSchemaClass, getSlotByRef, splitFieldRef } from '~/utils/explorer/schemaModel';

const store = useExplorerStore();
const { t } = useI18n();
const { text, language, fill } = useExplorerTexts();

const { visible: maintenanceBannerVisible } = useMaintenanceBanner();

/** The drawer starts below the site header, and below the maintenance banner while that is shown. */
const topOffset = computed(() => (maintenanceBannerVisible.value
    ? 'calc(var(--header-height) + var(--maintenance-banner-height))'
    : 'var(--header-height)'));

const selection = computed(() => store.selection);
const title = ref<HTMLElement | null>(null);

const group = computed(() => (selection.value?.kind === 'group' ? getGroup(selection.value.id) : null));
const groupLevels = computed(() => (group.value ? levelsOfGroup(group.value) : []));
const hasMatch = computed(() => (group.value ? groupHasMatch(group.value) : false));
const extra = computed(() => (group.value?.extra ? text.value.extras[group.value.extra] : null));

const levelGroups = computed(() => (selection.value?.kind === 'level' ? groupsOfLevel(selection.value.id) : []));
const levelUpRule = computed(() => (selection.value?.kind === 'level' ? getLevel(selection.value.id).upRule : null));
const ruleLevels = computed(() => (selection.value?.kind === 'rule' ? RULES[selection.value.id].levels : []));
const neighbours = computed(() => {
    if (selection.value?.kind !== 'level') return [];
    const number = getLevel(selection.value.id).number;
    return LEVELS.filter((level) => Math.abs(level.number - number) === 1);
});

/** Group fields by schema class, so fields of an event are not mixed with fields of an agent. */
const fieldsByClass = computed(() => {
    if (!group.value) return [];
    const parts = new Map<string, string[]>();
    for (const ref of groupDetailFields(group.value)) {
        const { classId } = splitFieldRef(ref);
        parts.set(classId, [...(parts.get(classId) ?? []), ref]);
    }
    return [...parts.entries()].map(([classId, refs]) => {
        const schemaClass = getSchemaClass(classId);
        const label = (language.value === 'de' ? schemaClass.labelDe : schemaClass.labelEn) ?? classId;
        return { classId, label, refs };
    });
});

function isSelectedField(ref: string): boolean {
    const current = selection.value;
    return current?.kind === 'group' && current.field === getSlotByRef(ref).name;
}

const head = computed(() => {
    const current = selection.value;
    const texts = text.value;
    switch (current?.kind) {
        case 'level': {
            const level = getLevel(current.id);
            return {
                kicker: fill(texts.model.levelHeading, { n: level.number, word: texts.levels[current.id].word }),
                title: texts.levels[current.id].word,
                lead: texts.levels[current.id].definition,
            };
        }
        case 'rule':
            return { kicker: texts.model.ruleRegion, title: texts.rules[current.id].title, lead: texts.rules[current.id].note };
        case 'group': {
            const scope = getGroup(current.id).scope;
            const plain = texts.groups[current.id].plain;
            return {
                kicker: scope === 'all' ? texts.groups.scopeAll : texts.levels[scope].word,
                title: texts.groups[current.id].title,
                lead: plain || (current.id === 'i_access' ? t('tooltip.accessStatus') : ''),
            };
        }
        case 'imports':
            return { kicker: texts.imports.kicker, title: texts.imports.title, lead: texts.imports.lead };
        case 'caseRules':
            return { kicker: texts.drawer.casesKicker, title: texts.drawer.casesTitle, lead: texts.drawer.casesLead };
        default:
            return { kicker: texts.drawer.overviewKicker, title: texts.drawer.overviewTitle, lead: texts.drawer.overviewLead };
    }
});

const kickerIcon = computed(() => {
    const current = selection.value;
    if (current?.kind === 'level') return getLevel(current.id).icon;
    if (current?.kind === 'group') {
        const scope = getGroup(current.id).scope;
        return scope === 'all' ? null : getLevel(scope).icon;
    }
    return null;
});

function toCases() {
    store.setView('cases');
}

/* Focus follows the visitor: the heading of the drawer when it opens or changes, the opening control when it closes. */
let lastTrigger: HTMLElement | null = null;

function rememberTrigger(event: Event) {
    const target = event.target;
    if (!(target instanceof HTMLElement) || target.closest('.explorer-drawer')) return;
    lastTrigger = target.closest<HTMLElement>('button, a') ?? null;
}

function onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || !store.drawerOpen || store.activeCaseId) return;
    store.closeDrawer();
}

watch(
    selection,
    async (next, previous) => {
        if (next) {
            await nextTick();
            title.value?.focus({ preventScroll: true });
        } else if (previous && lastTrigger?.isConnected) {
            lastTrigger.focus({ preventScroll: true });
        }
    },
    { flush: 'post' },
);

onMounted(() => {
    document.addEventListener('pointerdown', rememberTrigger, true);
    document.addEventListener('focusin', rememberTrigger, true);
    document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', rememberTrigger, true);
    document.removeEventListener('focusin', rememberTrigger, true);
    document.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.explorer-drawer {
    position: fixed;
    top: var(--header-height);
    right: 0;
    bottom: 0;
    z-index: 25;
    width: min(26.5rem, 92vw);
    padding-bottom: 1rem;
    overflow: auto;
    background: var(--color-base-100);
    border-left: 1px solid var(--ex-line);
    box-shadow: -1rem 0 2.4rem rgb(0 0 0 / 0.34);
    animation: explorer-drawer-in 0.18s ease-out;
}

@keyframes explorer-drawer-in {
    from { transform: translateX(1.5rem); opacity: 0; }
    to { transform: none; opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
    .explorer-drawer { animation: none; }
}

@media (max-width: 760px) {
    .explorer-drawer { width: 100vw; }
}

.explorer-drawer-head {
    position: relative;
    padding: 1.4rem 1rem 0.8rem;
    color: var(--ex-ink);
    background: var(--ex-paper);
    border-bottom: 1px solid var(--ex-paper-line);
}

/* Perforation strip as on the film-strip paper of the design. Decoration only. */
.explorer-drawer-head::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 0.5rem;
    background: repeating-linear-gradient(90deg, var(--ex-ink) 0 0.5rem, transparent 0.5rem 1.1rem);
    opacity: 0.85;
}

.explorer-drawer-kicker {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.4rem;
    font-size: 0.78rem;
    font-weight: 800;
    color: var(--ex-paper-muted);
}

.explorer-drawer-head h2 {
    margin: 0.1rem 0 0.4rem;
    padding-right: 5rem;
    font-family: 'BreeSerif', Georgia, 'Times New Roman', serif;
    font-size: 1.55rem;
    font-weight: 400;
    line-height: 1.1;
}

.explorer-drawer-head h2:focus {
    outline: none;
}

.explorer-drawer-head p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--ex-paper-muted);
}

.explorer-drawer-close {
    position: absolute;
    top: 1rem;
    right: 0.7rem;
    padding: 0.2rem 0.65rem;
    font-size: 0.8rem;
    color: var(--ex-ink);
    background: transparent;
    border: 1px solid var(--ex-paper-line);
    cursor: pointer;
}

.explorer-drawer-section {
    padding: 0.8rem 1rem 0;
}

.explorer-drawer-section h3 {
    margin: 0 0 0.4rem;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--ex-muted);
}

.explorer-drawer-text {
    margin: 0 0 0.5rem;
    font-size: 0.85rem;
}

.explorer-drawer-note,
.explorer-drawer-source {
    margin: 0.8rem 1rem 0;
    font-size: 0.75rem;
    color: var(--ex-muted);
}

.explorer-extra .explorer-drawer-source {
    margin: 0;
}

.explorer-terms,
.explorer-plain-list,
.explorer-fields {
    margin: 0;
    padding: 0;
    list-style: none;
}

.explorer-terms li {
    padding: 0.6rem 0;
    font-size: 0.85rem;
    border-top: 1px solid var(--ex-line);
}

.explorer-terms b {
    display: block;
    font-family: 'BreeSerif', Georgia, 'Times New Roman', serif;
    font-size: 1.05rem;
    font-weight: 400;
}

.explorer-golist {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.explorer-golist button {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.7rem;
    font-size: 0.8rem;
    background: transparent;
    border: 1px solid var(--ex-line);
    cursor: pointer;
}

.explorer-golist button:hover {
    border-color: var(--ex-muted);
}

.explorer-classtag {
    display: inline-block;
    margin: 0.5rem 0 0.1rem;
    font-size: 0.78rem;
    font-weight: 800;
    color: var(--color-primary-text);
}

.explorer-text-link {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem 0;
    font-size: 0.85rem;
    color: var(--color-primary-text);
    text-decoration: underline;
    text-underline-offset: 3px;
}

.explorer-path {
    margin: 0 0 0.5rem;
    padding: 0.5rem 0.75rem;
    font-family: ui-monospace, Menlo, Consolas, monospace;
    font-size: 0.78rem;
    line-height: 1.7;
    background: var(--color-base-200);
    border-left: 4px solid var(--color-primary);
}

.explorer-bridge {
    margin: 0.8rem 1rem 0;
    padding: 0.7rem 0.85rem;
    font-size: 0.85rem;
    background: var(--color-base-200);
    border-left: 4px solid var(--color-primary);
}

.explorer-field {
    padding: 0.5rem 0;
    font-size: 0.82rem;
    border-top: 1px solid var(--ex-line);
}

.explorer-field-head b {
    font-weight: 700;
}

.explorer-field-text {
    margin: 0.2rem 0 0;
}

.explorer-field-meta {
    display: block;
    font-size: 0.75rem;
    color: var(--ex-muted);
}

.explorer-tag {
    margin-left: 0.4rem;
    padding: 0.05rem 0.4rem;
    font-size: 0.78rem;
    font-weight: 800;
    background: var(--color-base-content);
    color: var(--color-base-100);
}
</style>
