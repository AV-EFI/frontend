<template>
  <ul
    class="flex flex-col sm:flex-row sm:flex-wrap gap-y-1 sm:gap-x-3 text-[0.75rem] leading-snug text-base-content"
    role="list"
  >
    <li
      v-for="entry in metaEntries"
      :key="entry.key"
      class="flex flex-row items-center gap-1.5 min-w-[6rem]"
      :aria-label="entry.aria"
      :title="entry.aria"
    >
      <Icon
        :name="entry.icon"
        class="w-[0.85rem] h-[0.85rem] text-primary shrink-0 my-auto"
        aria-hidden="true"
      />
      <span class="inline-block whitespace-nowrap">{{ entry.text }}</span>
    </li>
  </ul>
</template>
  
<script setup lang="ts">
const { t } = useI18n();
const props = defineProps<{ data: any }>();
  
function formatDuration(has_value: string): string {
    if (has_value) {
        try {
            const parts = has_value.replace(/^PT/, '')
                .replace(/H/, ':')
                .replace(/M/, ':')
                .replace(/S/, '')
                .split(':');
            return parts.map(p => p.padStart(2, '0')).join(':');
        } catch (e) {
            console.error(e);
            return has_value;
        }
    }
    return has_value;
}
  
const metaEntries = computed(() => {
    const entries: { key: string; icon: string; text: string; aria: string }[] = [];
  
    // Languages
    const langs = props.data?.has_record?.in_language?.map(l => {
        const label = t(l?.code || '');
        const usage = l?.usage?.length ? ` (${l.usage.map((u: string) => t(u)).join(', ')})` : '';
        return label + usage;
    }) || [];
    if (langs.length) {
        entries.push({
            key: 'lang',
            icon: 'mdi:translate',
            text: langs.join(', '),
            aria: t('in_language_code') + ': ' + langs.join(', ')
        });
    }
  
    // Colour
    const colour =
      props.data?.has_colour_type ||
      props.data?.has_record?.has_colour_type ||
      props.data?.has_record?.described_by?.has_colour_attribute;
    if (colour) {
        entries.push({
            key: 'colour',
            icon: 'mdi:palette',
            text: t(colour),
            aria: t('has_colour') + ': ' + t(colour)
        });
    }
  
    // Sound
    const sound =
      props.data?.has_sound_type ||
      props.data?.has_record?.has_sound_type ||
      props.data?.has_record?.described_by?.has_sound_attribute;
    if (sound) {
        entries.push({
            key: 'sound',
            icon: sound.toLowerCase().includes('silent') ? 'mdi:volume-off' : 'mdi:volume-high',
            text: t(sound),
            aria: t('has_sound_type') + ': ' + t(sound)
        });
    }
  
    // Duration
    const rawDuration = props.data?.has_duration?.has_value || props.data?.has_record?.has_duration?.has_value;
    if (rawDuration) {
        const d = formatDuration(rawDuration);
        entries.push({
            key: 'duration',
            icon: 'mdi:clock-outline',
            text: d,
            aria: t('duration') + ': ' + d
        });
    }
  
    // Extent + unit
    const extent = props.data?.has_extent?.has_value || props.data?.has_record?.has_extent?.has_value;
    const unit = props.data?.has_extent?.has_unit || props.data?.has_record?.has_extent?.has_unit;
    if (extent) {
        entries.push({
            key: 'extent',
            icon: 'mdi:ruler-square',
            text: `${extent} ${unit ? t(unit) : ''}`.trim(),
            aria: `${t('avefi:Extent')}: ${extent} ${unit ? t(unit) : ''}`.trim()
        });
    }
  
    // Element Type
    const elementType = props.data?.has_record?.element_type;
    if (elementType) {
        entries.push({
            key: 'elementType',
            icon: 'mdi:filmstrip-box-multiple',
            text: t(elementType),
            aria: t('tooltip.elementType') + ': ' + t(elementType)
        });
    }

    const formatTypes =
  props.data?.has_record?.has_format?.map((f: any) => f?.type).filter(Boolean) ||
  (props.data?.has_record?.has_format?.type ? [props.data.has_record.has_format.type] : []) ||
  (props.data?.has_record?.has_digital_format ? [props.data.has_record.has_digital_format] : []);

    if (formatTypes.length) {
        const translatedFormats = formatTypes.map((f: string) => t(f)).join(', ');
        entries.push({
            key: 'format',
            icon: 'mdi:disc',
            text: translatedFormats,
            aria: t('tooltip.format') + ': ' + translatedFormats
        });
    }
  
    return entries;
});
</script>
  