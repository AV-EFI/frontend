<template>
    <span v-if="category.indexOf('avefi:') > -1" :title="badgeLabel" :aria-label="badgeLabel"
          role="status" :class="[
              category === 'avefi:WorkVariant' ? 'badge-work' :
              category === 'avefi:Manifestation' ? 'badge-manifestation' :
              category === 'avefi:Item' ? 'badge-item' : 'badge-primary',
              category === 'avefi:WorkVariantPart' ? 'badge-work-part mx-auto' : '',
              'badge badge-sm inline-flex h-5 items-center align-middle text-xs font-semibold leading-none',
              dense ? 'w-10 justify-center px-1' : 'gap-1.5 px-2',
          ]">
        <span class="mx-auto inline-flex h-full items-center justify-center gap-1.5 leading-none">
            <Icon v-if="levelIcon" :name="levelIcon" class="icon-inline icon-level block text-current" aria-hidden="true" />
            <span class="block leading-none">
                {{ dense ? baseLabel.charAt(0) : badgeLabel }}
            </span>
        </span>
    </span>
    <span v-else-if="category.indexOf('Serial') > -1 || category.indexOf('AnthologyFilm') > -1"
          class="badge bg-base mx-auto font-semibold h-4" :title="badgeLabel" :aria-label="badgeLabel"
          role="status">
        {{ dense ? baseLabel.charAt(0) : badgeLabel }}
        <Icon v-if="icon" name="fa:caret-down" class="icon-inline ml-1" aria-hidden="true" />
    </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
const { t } = useI18n();

const props = defineProps({
    category: {
        type: String,
        default: 'avefi:WorkVariant'
    },
    dense: {
        type: Boolean,
        default: false
    },
    icon: {
        type: Boolean,
        default: false
    },
    suffix: {
        type: String,
        default: ''
    }
});

const baseLabel = computed(() => t(props.category ?? ''));
const badgeLabel = computed(() => {
    const suffix = props.suffix.trim();
    return suffix ? `${baseLabel.value} ${suffix}` : baseLabel.value;
});

const levelIcon = computed(() => {
    if (props.category === 'avefi:WorkVariant' || props.category === 'avefi:WorkVariantPart') {
        return 'tabler:stack-front';
    }
    if (props.category === 'avefi:Manifestation') {
        return 'tabler:stack-middle';
    }
    if (props.category === 'avefi:Item') {
        return 'tabler:stack-back';
    }
    return '';
});
</script>
