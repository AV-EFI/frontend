<template>
    <div
        :class="`divider before:bg-${inClass} after:bg-${inClass}`"
        :aria-label="labelSuffix ? `${$t('divider')}: ${$t(labelText)} ${labelSuffix}` : $t('divider')"
    >
        <MicroBadgeCategoryComp
            v-if="labelText"
            :category="labelText"
            :suffix="labelSuffix"
            :icon="true"
            class="md:text-regular"
        />
    </div>
</template>
<script lang="ts" setup>
defineProps({
    'inClass': {
        type: String,
        required: true
    },
    'labelText': {
        type: String,
        default: 'avefi:WorkVariant'
    },
    'labelSuffix': {
        type: String,
        default: ''
    }
});
</script>
