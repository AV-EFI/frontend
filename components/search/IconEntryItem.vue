<template>
    <div
        :class="entryClass"
        tabindex="0"
        :aria-label="entry.aria"
        :title="entry.aria"
    >
        <Icon :name="entry.icon" :class="iconClass" aria-hidden="true" />

        <span :class="textClass">
            <span :id="contentId" :class="valueBlockClass">
                <template v-if="Array.isArray(entry.text)">
                    <template v-for="(seg, i) in visibleSegs" :key="i">
                        <SearchClickableFacetValue
                            v-if="facetAttribute"
                            :attribute="facetAttribute"
                            :value="seg.facetValue ?? seg.text"
                            :label="seg.text"
                            :class="segClass"
                        >
                            {{ seg.text }}
                        </SearchClickableFacetValue>
                        <span v-else :class="segClass">{{ seg.text }}</span>
                        <MicroDataQualityWarningIcon
                            v-if="shouldWarn(seg)"
                            class="ml-1"
                            :label="warnLabel(seg)"
                        />
                        <span
                            v-if="seg.hilite"
                            :title="`${t('matchedField')}: ${seg.text}`"
                            class="badge-highlight-xs ml-1"
                        />
                        <span v-if="i < visibleSegs.length - 1">; </span>
                    </template>
                </template>

                <template v-else>
                    <SearchClickableFacetValue
                        v-if="facetAttribute"
                        :attribute="facetAttribute"
                        :value="entry.text"
                        :label="entry.text"
                        :class="singleValueClass"
                    >
                        {{ entry.text }}
                    </SearchClickableFacetValue>
                    <span v-else :class="singleValueClass">{{ entry.text }}</span>
                </template>
            </span>

            <button
                v-if="hasOverflow"
                type="button"
                :class="toggleButtonClass"
                :aria-expanded="expanded ? 'true' : 'false'"
                :aria-label="toggleText"
                :aria-controls="contentId"
                @click="expanded = !expanded"
            >
                {{ toggleText }}
            </button>
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getSuspiciousAgentNamePattern, isWhitespaceCommaOnlyText } from '~/utils/agentQuality';
import type { IconEntry, IconSegment } from '~/types/iconEntry';
import {
    VISIBLE_LIMIT_BY_KEY,
    VISIBLE_LIMIT_DEFAULT,
    VISIBLE_LIMIT_RESPONSIVE,
} from '~/config/entryDisplayConfig';

const props = defineProps<{
    entry: IconEntry;
    facetAttribute: string;
    entryClass: string;
    textClass: string;
    valueBlockClass: string;
    iconClass: string | string[];
    toggleButtonClass: string;
    singleValueClass: string;
    segClass: string | Record<string, boolean>;
    contentId: string;
    isLargeScreen: boolean;
}>();

const { t } = useI18n();
const expanded = ref(false);

const visibleLimit = computed(() => {
    const spec = VISIBLE_LIMIT_BY_KEY[props.entry.key];
    if (spec === 'responsive') return props.isLargeScreen ? VISIBLE_LIMIT_RESPONSIVE.desktop : VISIBLE_LIMIT_RESPONSIVE.mobile;
    return spec ?? VISIBLE_LIMIT_DEFAULT;
});

const hasOverflow = computed(() =>
    Array.isArray(props.entry.text) && props.entry.text.length > visibleLimit.value,
);

const visibleSegs = computed((): IconSegment[] => {
    if (!Array.isArray(props.entry.text)) return [];
    if (!hasOverflow.value || expanded.value) return props.entry.text;
    return props.entry.text.slice(0, visibleLimit.value);
});

const hiddenCount = computed(() =>
    Array.isArray(props.entry.text)
        ? Math.max(0, props.entry.text.length - visibleLimit.value)
        : 0,
);

const toggleText = computed(() =>
    expanded.value ? t('showLess') : `${t('showMore')} (+${hiddenCount.value})`,
);

function shouldWarn(seg: IconSegment): boolean {
    if (props.entry.key === 'creators') return Boolean(getSuspiciousAgentNamePattern(seg.text));
    if (props.entry.key === 'production') return isWhitespaceCommaOnlyText(seg.text);
    return false;
}

function warnLabel(seg: IconSegment): string {
    if (props.entry.key === 'production' && isWhitespaceCommaOnlyText(seg.text)) {
        return `Empty, whitespace-only, or comma-only production value. ${t('dataQuality.probableImportIssue')}`;
    }
    const pattern = getSuspiciousAgentNamePattern(seg.text);
    return pattern ? `${pattern.description}. ${t('dataQuality.probableImportIssue')}` : '';
}
</script>
