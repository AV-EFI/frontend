import { computed, onBeforeUnmount, onMounted, ref, type ComputedRef } from 'vue';

export type MaintenanceBannerState = 'planned' | 'active';

export interface MaintenanceBannerConfig {
  enabled?: boolean | string;
  previewEnabled?: boolean | string;
  state?: string;
  status?: string;
  startsAt?: string;
  endsAt?: string;
  messageDe?: string;
  messageEn?: string;
}

export interface ResolvedMaintenanceBanner {
  visible: boolean;
  state: MaintenanceBannerState | null;
  startsAt: Date | null;
  endsAt: Date | null;
  message: string;
  preview: boolean;
}

interface ResolveMaintenanceBannerOptions {
  config?: MaintenanceBannerConfig | null;
  locale?: string;
  now?: Date;
  previewState?: string | string[] | null;
}

function normalizeBoolean(value: MaintenanceBannerConfig['enabled']): boolean {
  if (value === true) return true;
  if (typeof value !== 'string') return false;

  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

function normalizeState(value: string | undefined): MaintenanceBannerState | null {
  const normalized = value?.trim().toLowerCase();

  if (normalized === 'planned' || normalized === 'scheduled') return 'planned';
  if (['active', 'ongoing', 'incident', 'outage'].includes(normalized || '')) return 'active';

  return null;
}

function parseDate(value: string | undefined): Date | null {
  if (!value?.trim()) return null;

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function localizedMessage(config: MaintenanceBannerConfig, locale = 'de'): string {
  const primary = locale.toLowerCase().startsWith('de') ? config.messageDe : config.messageEn;
  const fallback = locale.toLowerCase().startsWith('de') ? config.messageEn : config.messageDe;

  return (primary?.trim() || fallback?.trim() || '');
}

export function resolveMaintenanceBanner({
  config,
  locale,
  now = new Date(),
  previewState,
}: ResolveMaintenanceBannerOptions): ResolvedMaintenanceBanner {
  const rawConfig = config ?? {};
  const normalizedPreviewState = normalizeState(Array.isArray(previewState) ? previewState[0] : previewState || undefined);
  const preview = normalizeBoolean(rawConfig.previewEnabled) && normalizedPreviewState !== null;
  const state = preview ? normalizedPreviewState : normalizeState(rawConfig.state || rawConfig.status);
  const startsAt = parseDate(rawConfig.startsAt);
  const endsAt = parseDate(rawConfig.endsAt);

  if (!preview && (!normalizeBoolean(rawConfig.enabled) || !state)) {
    return { visible: false, state, startsAt, endsAt, message: '', preview };
  }

  if (preview) {
    return {
      visible: true,
      state,
      startsAt: null,
      endsAt: null,
      message: localizedMessage(rawConfig, locale),
      preview,
    };
  }

  if (endsAt && now > endsAt) {
    return { visible: false, state, startsAt, endsAt, message: localizedMessage(rawConfig, locale), preview };
  }

  if (state === 'active' && startsAt && now < startsAt) {
    return { visible: false, state, startsAt, endsAt, message: localizedMessage(rawConfig, locale), preview };
  }

  return {
    visible: true,
    state,
    startsAt,
    endsAt,
    message: localizedMessage(rawConfig, locale),
    preview,
  };
}

function localeCode(locale: unknown): string {
  if (typeof locale === 'string') return locale;
  if (locale && typeof locale === 'object' && 'value' in locale) {
    const value = (locale as { value?: unknown }).value;
    return typeof value === 'string' ? value : 'de';
  }

  return 'de';
}

function queryPreviewState(value: unknown): string | string[] | null {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.filter((entry): entry is string => typeof entry === 'string');

  return null;
}

export function useMaintenanceBanner(): {
  resolved: ComputedRef<ResolvedMaintenanceBanner>;
  visible: ComputedRef<boolean>;
  state: ComputedRef<MaintenanceBannerState | null>;
  } {
  const runtimeConfig = useRuntimeConfig();
  const { locale } = useI18n();
  const route = typeof useRoute === 'function' ? useRoute() : null;
  const now = ref(new Date());
  let timer: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    timer = setInterval(() => {
      now.value = new Date();
    }, 60_000);
  });

  onBeforeUnmount(() => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  });

  const resolved = computed(() => resolveMaintenanceBanner({
    config: runtimeConfig.public?.maintenanceBanner as MaintenanceBannerConfig | undefined,
    locale: localeCode(locale),
    now: now.value,
    previewState: queryPreviewState(route?.query?.maintenanceBannerPreview),
  }));

  return {
    resolved,
    visible: computed(() => resolved.value.visible),
    state: computed(() => resolved.value.state),
  };
}
