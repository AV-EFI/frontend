<template>
  <div class="bg-base-200 py-12">
    <div v-if="manifestData" class="container mx-auto max-w-6xl px-6 space-y-10">
      <header class="space-y-4">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="badge badge-primary mb-2 w-fit">
              {{ t('press.badgeLastUpdated', { date: new Date(manifestData.lastUpdated).toLocaleDateString() }) }}
            </p>
            <h1 class="text-4xl font-bold">{{ t('press.title') }}</h1>
            <p class="text-lg text-base-content/80">{{ t('press.subtitle') }}</p>
          </div>
          <div class="flex flex-col gap-2 text-right">
            <span class="text-sm uppercase tracking-wide text-base-content/70">{{ t('press.contactLabel') }}</span>
            <a class="link link-primary text-lg" :href="`mailto:${manifestData.contact.email}`">
              {{ manifestData.contact.label }}
            </a>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <a class="btn btn-primary" href="/api/press-kit.zip" download>
            {{ t('press.downloadAll') }}
          </a>
          <a class="btn btn-outline" href="/press/manifest.json" target="_blank" rel="noreferrer">
            {{ t('press.viewManifest') }}
          </a>
        </div>
      </header>

      <section :aria-label="bilingualInline('press.boilerplateSection')" class="grid gap-4 md:grid-cols-1">
        <article v-for="block in boilerplateBlocks" :key="block.key" class="card bg-base-100 shadow-xl"
          :aria-label="bilingualInline(block.labelKey)">
          <div class="card-body space-y-4">
            <div class="flex items-center justify-between gap-2">
              <h2 class="card-title text-base">{{ $t(block.labelKey) }}</h2>
            </div>
            <div class="space-y-3">
              <div v-for="entry in bilingualEntries(block.textKey)" :key="`${block.key}-${entry.locale}`"
                class="flex items-start gap-3">
                <div class="grow space-y-1">
                  <span class="text-xs uppercase tracking-wide text-base-content/60">{{ entry.label }}</span>
                  <p class="text-sm leading-relaxed text-base-content/80">{{ entry.text }}</p>
                </div>
                <button class="btn btn-xs btn-outline" type="button"
                  @click="copyBoilerplate(entry.text, block.key, entry.locale)">
                  {{
                  copiedKey === `${block.key}-${entry.locale}`
                  ? bilingualInline('press.boilerplateCopied')
                  : bilingualInline('press.boilerplateCopy')
                  }}
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section :aria-label="$t('press.usageSection')" class="card bg-base-100 shadow-xl">
        <div class="card-body space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="card-title text-xl">{{ translateKey(manifestData.usage.titleKey) }}</h2>
            <span class="badge badge-outline">{{ t('press.brandSafety') }}</span>
          </div>
          <ul class="list-disc space-y-2 pl-6 text-base-content/80">
            <li v-for="(rule, index) in usageItems" :key="`${index}-${rule}`">
              {{ rule }}
            </li>
          </ul>
        </div>
      </section>

      <section v-for="section in sections" :key="section.id" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold">{{ translateKey(section.titleKey) }}</h2>
          <span class="badge badge-secondary capitalize">
            {{ formatBadge(section.badgeKey, section.id.replace('-', ' ')) }}
          </span>
        </div>
        <div class="grid gap-6 md:grid-cols-2">
          <article v-for="item in section.items" :key="item.id" class="card bg-base-100 shadow-xl"
            :aria-label="`${translateKey(section.titleKey)}: ${translateKey(item.titleKey)}`">
            <figure v-if="isImagePreview(item.preview)" class="p-4">
              <img :src="item.preview" :alt="translateKey(item.titleKey)" class="rounded-lg border border-base-200"
                loading="lazy">
            </figure>
            <div class="card-body space-y-4">
              <div>
                <h3 class="card-title text-lg">{{ translateKey(item.titleKey) }}</h3>
                <p class="text-sm uppercase tracking-wide text-base-content/60">
                  {{ assetTypeLabel(item.type) }}
                </p>
              </div>
              <p v-if="item.notesKey" class="text-sm text-base-content/70">
                {{ translateKey(item.notesKey) }}
              </p>
              <div class="flex flex-wrap gap-2">
                <a v-for="file in item.files" :key="`${item.id}-${file.label}`" class="btn btn-sm btn-outline"
                  :href="file.path" :download="getFileName(file.path)">
                  {{ t('press.downloadFile', { label: file.label }) }}
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <div v-else class="container mx-auto max-w-4xl px-6">
      <div class="alert alert-error shadow-lg">
        <div>
          <span>{{ t('press.errorTitle') }}</span>
          <p v-if="manifestErrorMessage" class="text-sm opacity-70">
            {{ manifestErrorMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface PressManifestFile {
  label: string;
  path: string;
}

type AssetType = 'logo' | 'image';
type BoilerplateCopyKey = 'oneLiner' | 'short' | 'long';

type PressManifestBoilerplate = Record<`${BoilerplateCopyKey}Key`, string>;

interface PressManifestItem {
  id: string;
  titleKey: string;
  type: AssetType;
  preview?: string;
  notesKey?: string;
  files: PressManifestFile[];
}

interface PressManifestSection {
  id: string;
  titleKey: string;
  badgeKey?: string;
  items: PressManifestItem[];
}

interface PressManifestUsage {
  titleKey: string;
  itemsKeys: string[];
}

interface PressManifest {
  lastUpdated: string;
  contact: {
    email: string;
    label: string;
  };
  boilerplate: PressManifestBoilerplate;
  usage: PressManifestUsage;
  sections: PressManifestSection[];
}

interface BoilerplateBlock {
  key: BoilerplateCopyKey;
  labelKey: string;
  textKey?: string;
}

interface BilingualEntry {
  locale: PressLocale;
  label: string;
  text: string;
}

const { data: manifest, error } = await useFetch<PressManifest>('/press/manifest.json', {
  server: true,
  lazy: false,
});

if (error.value) {
  console.error('[press-page] Unable to load manifest', error.value);
}

const { t } = useI18n();

const translateKey = (key?: string | null, params?: Record<string, unknown>) =>
  (key ? t(key, params) : '');
const assetTypeLabel = (type: AssetType) => t(`press.assetTypes.${type}`);
const formatBadge = (badgeKey?: string, fallback = '') => translateKey(badgeKey) || fallback;

const pressLocales = ['de', 'en'] as const;
type PressLocale = (typeof pressLocales)[number];

const localeLabels: Record<PressLocale, string> = {
  de: 'Deutsch',
  en: 'English',
};

const translatePressKey = (key: string, localeCode: PressLocale, params?: Record<string, unknown>) =>
  t(key, params, { locale: localeCode });

const bilingualEntries = (key?: string | null, params?: Record<string, unknown>): BilingualEntry[] => {
  if (!key) {
    return [];
  }
  return pressLocales
    .map((localeCode) => ({
      locale: localeCode,
      label: localeLabels[localeCode],
      text: translatePressKey(key, localeCode, params).trim(),
    }))
    .filter((entry) => entry.text.length);
};

const bilingualInline = (key: string, params?: Record<string, unknown>) =>
  bilingualEntries(key, params)
    .map((entry) => entry.text)
    .join(' / ');

const manifestData = computed(() => manifest.value || null);
const manifestErrorMessage = computed(() => {
  const err = error.value;
  if (!err) {
    return '';
  }
  if (typeof err === 'string') {
    return err;
  }
  return (err as { message?: string; statusMessage?: string }).message
    || (err as { statusMessage?: string }).statusMessage
    || t('press.errorFallback');
});

const boilerplateKeyMap: Record<BoilerplateCopyKey, keyof PressManifestBoilerplate> = {
  oneLiner: 'oneLinerKey',
  short: 'shortKey',
  long: 'longKey'
};
const boilerplateOrder: BoilerplateCopyKey[] = ['oneLiner', 'short', 'long'];

const boilerplateBlocks = computed<BoilerplateBlock[]>(() => {
  const data = manifestData.value;
  if (!data) {
    return [];
  }

  return boilerplateOrder.map((key) => {
    const manifestKey = boilerplateKeyMap[key];
    return {
      key,
      labelKey: `press.boilerplateLabels.${key}`,
      textKey: data.boilerplate[manifestKey]
    };
  });
});

const sections = computed(() => manifestData.value?.sections ?? []);
const usageItems = computed(() => {
  const data = manifestData.value;
  if (!data) {
    return [];
  }
  return data.usage.itemsKeys.map((usageKey) => translateKey(usageKey));
});

const copiedKey = ref<string | null>(null);
let copyTimeout: ReturnType<typeof setTimeout> | null = null;

const copyBoilerplate = async (text: string, blockKey: BoilerplateCopyKey, localeCode: PressLocale) => {
  if (!text) {
    return;
  }

  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    copiedKey.value = `${blockKey}-${localeCode}`;
    if (copyTimeout) {
      clearTimeout(copyTimeout);
    }
    copyTimeout = setTimeout(() => {
      copiedKey.value = null;
      copyTimeout = null;
    }, 2000);
  } catch (clipboardError) {
    console.error('Clipboard copy failed', clipboardError);
  }
};

onBeforeUnmount(() => {
  if (copyTimeout) {
    clearTimeout(copyTimeout);
  }
});

const getFileName = (path: string) => path.split('/').filter(Boolean).pop() ?? 'asset';
const isImagePreview = (src?: string) => !!src && /\.(png|jpe?g|webp|svg)$/i.test(src);

useHead(() => ({
  title: t('press.metaTitle'),
  meta: [
    {
      name: 'description',
      content: t('press.metaDescription'),
    },
  ],
}));
</script>
