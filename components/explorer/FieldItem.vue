<template>
    <li class="explorer-field" :class="{ 'is-match': matchKind !== null, 'is-selected': selected }">
        <div class="explorer-field-head">
            <b>{{ term ?? slotInfo.name }}</b>
            <span v-if="slotInfo.required" class="badge badge-neutral badge-sm ml-2">{{ text.drawer.required }}</span>
            <span v-if="matchKind" class="badge badge-highlight badge-sm ml-2">{{ text.match.prefix }}: {{ text.match[matchKind] }}</span>
        </div>
        <span class="explorer-field-meta">
            <code lang="en">{{ slotInfo.name }}</code>
            <span v-if="slotInfo.range"> · <span lang="en">{{ slotInfo.range }}</span></span>
            <span v-if="slotInfo.multivalued"> · {{ text.drawer.multiple }}</span>
        </span>
        <span v-if="!term" class="explorer-field-meta">{{ text.drawer.noGermanTerm }}</span>
        <p v-if="slotInfo.description" class="explorer-field-text" :lang="text.drawer.schemaLanguage">{{ slotInfo.description }}</p>

        <div v-if="selected && values.length > 0" class="explorer-values">
            <p class="explorer-values-caption">{{ text.links.values }}</p>
            <p class="explorer-values-list">
                <span v-for="value in shownValues" :key="value.term" class="explorer-value" :title="value.definition || undefined">{{ value.label }}</span>
            </p>
            <NuxtLink :to="vocabularyUrl(slotInfo.range ?? '')" class="explorer-field-link">
                {{ fill(text.links.allValues, { n: values.length }) }}
            </NuxtLink>
        </div>

        <a
            class="explorer-field-link"
            :href="schemaDocsUrl(slotInfo.name)"
            target="_blank"
            rel="noopener noreferrer"
        >
            {{ text.links.fieldDocs }}
            <Icon name="tabler:external-link" size="13" aria-hidden="true" />
            <span class="sr-only"> ({{ text.links.newTab }})</span>
        </a>
    </li>
</template>

<script setup lang="ts">
import { fieldTerm } from '~/utils/explorer/fieldTerms';
import { schemaDocsUrl, vocabularyUrl } from '~/utils/explorer/links';
import { MATCH_FIELD_KIND } from '~/utils/explorer/model';
import { getSlotByRef } from '~/utils/explorer/schemaModel';
import { loadEnumValues, type VocabularyValue } from '~/utils/explorer/vocabulary';

const props = defineProps<{
    /** "Class.field" as the schema names it. */
    fieldRef: string;
    selected: boolean;
}>();

const VALUES_SHOWN = 8;

const { text, language, fill } = useExplorerTexts();

const slotInfo = computed(() => getSlotByRef(props.fieldRef));
const term = computed(() => fieldTerm(slotInfo.value.classId, slotInfo.value, language.value));
const matchKind = computed(() => MATCH_FIELD_KIND[props.fieldRef] ?? null);

const values = ref<VocabularyValue[]>([]);
const shownValues = computed(() => values.value.slice(0, VALUES_SHOWN));

/** Only a value list ("ColourTypeEnum") has values in the vocabulary; its selected field shows them. */
watch(
    () => [props.selected, language.value] as const,
    async ([selected, locale]) => {
        const range = slotInfo.value.range;
        values.value = selected && range?.endsWith('Enum') ? await loadEnumValues(range, locale) : [];
    },
    { immediate: true },
);
</script>

<style scoped>
.explorer-field {
    padding: 0.5rem 0;
    font-size: 0.82rem;
    border-top: 1px solid var(--ex-line);
}

.explorer-field.is-match {
    padding-left: 0.5rem;
    background: color-mix(in oklch, var(--color-accent) 18%, transparent);
    box-shadow: inset 3px 0 0 var(--color-accent);
}

.explorer-field.is-selected {
    padding-left: 0.5rem;
    background: color-mix(in oklch, var(--color-primary) 18%, transparent);
    box-shadow: inset 3px 0 0 var(--color-primary);
}

.explorer-field-head b {
    font-weight: 700;
}


.explorer-field-meta {
    display: block;
    font-size: 0.75rem;
    color: var(--ex-muted);
}

.explorer-field-text {
    margin: 0.2rem 0 0;
}

.explorer-values {
    margin-top: 0.4rem;
}

.explorer-values-caption {
    margin: 0;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--ex-muted);
}

.explorer-values-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin: 0.25rem 0;
}

.explorer-value {
    padding: 0.1rem 0.5rem;
    font-size: 0.75rem;
    border: 1px solid var(--ex-line);
}

.explorer-field-link {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    min-height: 1.5rem;
    margin-top: 0.25rem;
    margin-right: 0.8rem;
    font-size: 0.75rem;
    color: var(--color-base-content);
    text-decoration: underline;
    text-underline-offset: 3px;
}
</style>
