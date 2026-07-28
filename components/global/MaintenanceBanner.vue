<template>
    <section
        v-if="visible"
        :class="bannerClasses"
        :role="alertRole"
        :aria-live="ariaLive"
        data-testid="maintenance-banner"
    >
        <div class="container mx-auto flex min-h-full items-start gap-3 px-4 py-2 text-sm">
            <Icon :name="iconName" class="icon-status mt-0.5" aria-hidden="true" />
            <div class="min-w-0">
                <p class="font-semibold leading-snug">
                    <span
                        v-if="resolved.preview"
                        class="mr-2 inline-flex rounded-sm border border-current px-1.5 py-0.5 text-xs uppercase"
                    >
                        {{ t('maintenanceBanner.previewLabel') }}
                    </span>
                    {{ title }}
                </p>
                <p class="leading-snug">
                    {{ message }}
                </p>
                <p v-if="windowLabel" class="text-xs leading-snug opacity-90">
                    {{ windowLabel }}
                </p>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useMaintenanceBanner } from '~/composables/useMaintenanceBanner';

const { resolved, visible, state } = useMaintenanceBanner();
const { locale, t } = useI18n();

const isActive = computed(() => state.value === 'active');
const title = computed(() => t(`maintenanceBanner.${state.value || 'planned'}.title`));
const message = computed(() => {
    if (resolved.value.message) return resolved.value.message;

    return t(`maintenanceBanner.${state.value || 'planned'}.message`);
});
const iconName = computed(() => isActive.value ? 'tabler:alert-triangle' : 'tabler:calendar-event');
const alertRole = computed(() => isActive.value ? 'alert' : 'status');
const ariaLive = computed(() => isActive.value ? 'assertive' : 'polite');
const bannerClasses = computed(() => [
    'maintenance-banner h-(--maintenance-banner-height) overflow-y-auto border-b',
    isActive.value
        ? 'border-error/40 bg-error text-error-content'
        : 'border-warning/40 bg-warning text-warning-content',
]);

const localeCode = computed(() => {
    if (typeof locale === 'string') return locale;

    return locale.value || 'de';
});

const dateFormatter = computed(() => new Intl.DateTimeFormat(
    localeCode.value === 'de' ? 'de-DE' : 'en-US',
    {
        dateStyle: 'medium',
        timeStyle: 'short',
    },
));

const formatDate = (date: Date | null) => date ? dateFormatter.value.format(date) : '';

const windowLabel = computed(() => {
    const start = formatDate(resolved.value.startsAt);
    const end = formatDate(resolved.value.endsAt);

    if (start && end) return t('maintenanceBanner.window', { start, end });
    if (start) return t('maintenanceBanner.startsAt', { start });
    if (end) return t('maintenanceBanner.endsAt', { end });

    return '';
});
</script>
