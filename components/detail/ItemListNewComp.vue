<template>
  <div
    v-for="exemplar in items"
    :key="exemplar?.id"
    class="grid grid-cols-4 gap-x-2 gap-y-0 mb-4 grid-rows-[minmax(0,1fr)] px-2 md:ml-4 md:px-2 py-1 dark:text-white border-l-2 border-item text-neutral-700"
  >
    <div class="col-span-full row-start-1 mb-2">
      <MicroDividerComp
        class="mx-auto lg:mt-[5px] mb-4"
        label-text="avefi:Item"
        in-class="item"
      />
    </div>

    <!-- EFI/handle (no tooltip gating here) -->
    <div class="col-span-full md:col-span-3 row-start-2">
      <DetailKeyValueComp
        :id="exemplar._id ?? exemplar?.handle?.replace('21.11155/', '') ?? exemplar?.handle"
        :keytxt="$t('EFI')"
        :valtxt="exemplar?.handle"
        class="w-full mb-2"
        :clip="true"
      />
    </div>

    <!-- Webresource (MOI) -->
    <div
      class="col-span-full md:col-span-1 md:row-start-2 flex flex-col justify-end"
      v-if="visible('MovingImageRecord.WorkVariant.ManifestationOrItem.has_webresource')"
    >
      <span class="flex items-center gap-1">
        <MicroLabelComp label-text="webresource" />
        <span
          class="inline ml-2"
          role="img"
          aria-label="Info"
          tabindex="0"
          :title="tip('MovingImageRecord.WorkVariant.ManifestationOrItem.has_webresource') || ''"
        >
          <Icon
            v-if="tip('MovingImageRecord.WorkVariant.ManifestationOrItem.has_webresource')"
            name="tabler:info-circle"
          />
        </span>
      </span>
      <a
        v-if="exemplar?.has_record?.has_webresource"
        :href="exemplar?.has_record?.has_webresource"
        target="_blank"
        class="link link-primary my-auto"
      >
        <Icon name="tabler:external-link" />&nbsp;{{ $t('webresource') }}
      </a>
      <p v-else>-</p>
    </div>

    <!-- has_access_status (Item) -->
    <div
      class="col-span-full md:col-span-1"
      v-if="visible('MovingImageRecord.WorkVariant.manifestations[].items[].Item.has_access_status')"
    >
      <MicroLabelComp
        label-text="has_access_status"
        :alt="$t('has_access_status')"
        :title="$t('has_access_status')"
      />
      <span
        class="inline ml-2"
        role="img"
        aria-label="Info"
        tabindex="0"
        :title="tip('MovingImageRecord.WorkVariant.manifestations[].items[].Item.has_access_status') || ''"
      >
        <Icon
          v-if="tip('MovingImageRecord.WorkVariant.manifestations[].items[].Item.has_access_status')"
          name="tabler:info-circle"
        />
      </span>
      <SearchHighlightSingleComp
        :item="exemplar?.has_record?.has_access_status?.type || null"
        :hitlite="highlightResult?.manifestations?.items.has_record?.has_access_status?.matchedWords"
        class="mb-2"
      />
    </div>

    <!-- has_format (MOI) -->
    <div
      class="col-span-full md:col-span-1"
      v-if="visible('MovingImageRecord.WorkVariant.ManifestationOrItem.has_format')"
    >
      <MicroLabelComp label-text="has_format" />
      <span
        class="inline ml-2 text-neutral-500 dark:text-neutral-300 text-sm cursor-help"
        role="img"
        aria-label="Info"
        :title="formatTip || ''"
      >
        <Icon v-if="formatTip" name="tabler:info-circle" />
      </span>

      <SearchHighlightListComp
        :items="exemplar?.has_record?.has_format?.map(form => form.type) || []"
        :hilite="highlightResult?.manifestations?.items.has_record?.has_format.matchedWords"
        class="mb-2"
      />
    </div>

    <!-- element_type (Item) -->
    <div
      class="col-span-full md:col-span-1"
      v-if="visible('MovingImageRecord.WorkVariant.manifestations[].items[].Item.element_type')"
    >
      <MicroLabelComp label-text="item_element_type" />
      <span
        class="ml-2 text-neutral-500 dark:text-neutral-300 text-sm cursor-help group relative"
        role="img"
        aria-label="Info"
        tabindex="0"
        :title="tip('MovingImageRecord.WorkVariant.manifestations[].items[].Item.element_type') || ''"
      >
        <Icon
          v-if="tip('MovingImageRecord.WorkVariant.manifestations[].items[].Item.element_type')"
          name="tabler:info-circle"
        />
      </span>

      <SearchHighlightSingleComp
        :item="exemplar?.has_record?.element_type || null"
        :hitlite="highlightResult?.manifestations?.items.has_record?.element_type?.matchedWords"
        class="mb-2"
      />
    </div>

    <!-- in_language (MOI) -->
    <div
      class="col-span-full md:col-span-1"
      v-if="visible('MovingImageRecord.WorkVariant.ManifestationOrItem.in_language')"
    >
      <MicroLabelComp label-text="in_language_code" />
      <span
        class="inline ml-2"
        role="img"
        aria-label="Info"
        tabindex="0"
        :title="tip('MovingImageRecord.WorkVariant.ManifestationOrItem.in_language') || ''"
      >
        <Icon
          v-if="tip('MovingImageRecord.WorkVariant.ManifestationOrItem.in_language')"
          name="tabler:info-circle"
        />
      </span>
      <SearchHighlightListComp
        :items="
          exemplar?.has_record?.in_language?.flatMap(
            (il) => `${$t(il?.code)} (${il?.usage?.map((u) => $t(u)).join(', ')})`
          ) || []
        "
        :hilite="highlightResult?.manifestations?.items?.has_record?.in_language?.code?.matchedWords"
        class="mb-2"
      />
    </div>

    <!-- Duration (MOI) -->
    <div
      class="col-span-full md:col-span-1"
      v-if="visible('MovingImageRecord.WorkVariant.ManifestationOrItem.has_duration')"
    >
      <MicroLabelComp label-text="has_duration" />
      <span
        class="inline ml-2"
        role="img"
        aria-label="Info"
        tabindex="0"
        :title="tip('MovingImageRecord.WorkVariant.ManifestationOrItem.has_duration') || ''"
      >
        <Icon
          v-if="tip('MovingImageRecord.WorkVariant.ManifestationOrItem.has_duration')"
          name="tabler:info-circle"
        />
      </span>
      <p class="mb-2">
        {{
          exemplar?.has_record?.has_duration?.has_value
            ? exemplar.has_record.has_duration.has_value.replace('PT', '').toLowerCase()
            : '-'
        }}
      </p>
    </div>

    <!-- Extent (MOI) -->
    <div
      class="col-span-full md:col-span-1"
      v-if="visible('MovingImageRecord.WorkVariant.ManifestationOrItem.has_extent')"
    >
      <MicroLabelComp label-text="avefi:Extent" />
      <span
        class="inline ml-2"
        role="img"
        aria-label="Info"
        tabindex="0"
        :title="tip('MovingImageRecord.WorkVariant.ManifestationOrItem.has_extent') || ''"
      >
        <Icon
          v-if="tip('MovingImageRecord.WorkVariant.ManifestationOrItem.has_extent')"
          name="tabler:info-circle"
        />
      </span>
      <p class="mb-2">
        {{
          exemplar?.has_record?.has_extent
            ? `${exemplar.has_record.has_extent.has_value} ${$t(exemplar.has_record.has_extent.has_unit)}`
            : '-'
        }}
      </p>
    </div>

    <!-- Colour Type (MOI) -->
    <div
      class="col-span-full md:col-span-1"
      v-if="visible('MovingImageRecord.WorkVariant.ManifestationOrItem.has_colour_type')"
    >
      <MicroLabelComp label-text="has_colour_type" />
      <span
        class="inline ml-2"
        role="img"
        aria-label="Info"
        tabindex="0"
        :title="tip('MovingImageRecord.WorkVariant.ManifestationOrItem.has_colour_type') || ''"
      >
        <Icon
          v-if="tip('MovingImageRecord.WorkVariant.ManifestationOrItem.has_colour_type')"
          name="tabler:info-circle"
        />
      </span>
      <p class="mb-2">
        {{ exemplar?.has_record?.has_colour_type ? $t(exemplar.has_record.has_colour_type) : '-' }}
      </p>
    </div>

    <!-- Sound Type (MOI) -->
    <div
      class="col-span-full md:col-span-1"
      v-if="visible('MovingImageRecord.WorkVariant.ManifestationOrItem.has_sound_type')"
    >
      <MicroLabelComp label-text="has_sound_type" />
      <span
        class="inline ml-2"
        role="img"
        aria-label="Info"
        tabindex="0"
        :title="tip('MovingImageRecord.WorkVariant.ManifestationOrItem.has_sound_type') || ''"
      >
        <Icon
          v-if="tip('MovingImageRecord.WorkVariant.ManifestationOrItem.has_sound_type')"
          name="tabler:info-circle"
        />
      </span>
      <p class="mb-2">
        {{ exemplar?.has_record?.has_sound_type ? $t(exemplar.has_record.has_sound_type) : '-' }}
      </p>
    </div>

    <!-- Notes (MOI) -->
    <div
      v-if="exemplar?.has_record?.has_note?.length && visible('MovingImageRecord.WorkVariant.ManifestationOrItem.has_note')"
      class="col-span-full"
    >
      <MicroLabelComp label-text="has_note" />
      <span
        class="inline ml-2"
        role="img"
        aria-label="Info"
        tabindex="0"
        :title="tip('MovingImageRecord.WorkVariant.ManifestationOrItem.has_note') || ''"
      >
        <Icon
          v-if="tip('MovingImageRecord.WorkVariant.ManifestationOrItem.has_note')"
          name="tabler:info-circle"
        />
      </span>
      <ul class="text-sm mb-2 list-disc list-inside">
        <li v-for="note in exemplar.has_record.has_note" :key="note">
          {{ note }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';


type Props = {
    items: any[];
  highlightResult?: any;
  productionDetailsChecked?: boolean;
  showAdminStats?: boolean;
  mode?: 'detail' | 'search';
};

const props = withDefaults(defineProps<Props>(), {
    highlightResult: () => ({} as any),
    productionDetailsChecked: false,
    showAdminStats: false,
    mode: 'detail'
});

const { locale, t } = useI18n();
const lang = computed<'de' | 'en'>(() => (locale.value === 'en' ? 'en' : 'de'));

/* 1) Load user tooltips (entries map). If the API is empty/missing, we still render fallbacks. */
const { data: tipsRes } = await useAsyncData('usertips', () =>
    $fetch('/api/cms/usertooltips').catch(() => ({ entries: {} }))
);
const tips = computed<
  Record<string, { de?: string; en?: string; showInDetail?: boolean; showInSearch?: boolean }>
>(() => (tipsRes.value?.entries ?? {}));

/* 2) Map canonical schema paths → your i18n ‘tooltip.*’ keys for fallback text */
const I18N_FALLBACK: Record<string, string> = {
    // MOI-level
    'MovingImageRecord.WorkVariant.ManifestationOrItem.has_format': 'tooltip.format',
    'MovingImageRecord.WorkVariant.ManifestationOrItem.has_webresource': 'tooltip.webresource',
    'MovingImageRecord.WorkVariant.ManifestationOrItem.has_note': 'has_note', // you had no tooltip text; adjust if you add one
    'MovingImageRecord.WorkVariant.ManifestationOrItem.has_duration': 'has_duration',
    'MovingImageRecord.WorkVariant.ManifestationOrItem.has_extent': 'avefi:Extent',
    'MovingImageRecord.WorkVariant.ManifestationOrItem.has_colour_type': 'has_colour_type',
    'MovingImageRecord.WorkVariant.ManifestationOrItem.has_sound_type': 'has_sound_type',
    'MovingImageRecord.WorkVariant.ManifestationOrItem.in_language': 'in_language_code',

    // Item-level
    'MovingImageRecord.WorkVariant.manifestations[].items[].Item.element_type': 'tooltip.elementType',
    'MovingImageRecord.WorkVariant.manifestations[].items[].Item.has_access_status': 'has_access_status'
};

type TipsEntry = {
  de?: string
  en?: string
  showInDetail?: boolean
  showInSearch?: boolean
};

/** canonicalization unchanged */
function canonicalCandidates(path: string): string[] {
  const out: string[] = [path];

  if (
    path.startsWith('MovingImageRecord.WorkVariant.') &&
    !path.includes('.ManifestationOrItem.') &&
    !path.includes('.manifestations[]')
  ) {
    out.push(
      path.replace(
        /^MovingImageRecord\.WorkVariant\./,
        'MovingImageRecord.WorkVariant.ManifestationOrItem.'
      )
    );
  }
  if (path.includes('.manifestations[].') && !path.includes('.Manifestation.')) {
    out.push(path.replace('.manifestations[].', '.manifestations[].Manifestation.'));
  }
  if (path.includes('.items[].') && !path.includes('.Item.')) {
    out.push(path.replace('.items[].', '.items[].Item.'));
  }
  return Array.from(new Set(out));
}

/** gather user entries for all candidate keys (order preserved) */
function collectEntries(path: string): ReadonlyArray<readonly [string, TipsEntry]> {
  const map = tips.value as Record<string, TipsEntry>;
  return canonicalCandidates(path)
    .map(k => [k, map[k]] as const)
    .filter(([, e]) => !!e) as ReadonlyArray<readonly [string, TipsEntry]>;
}

function flagKey(): 'showInDetail' | 'showInSearch' {
  return (props.mode === 'search' ? 'showInSearch' : 'showInDetail');
}

/** Visibility rule driven by user flags; default = visible */
function visible(path: string): boolean {
  const entries = collectEntries(path);
  const key = flagKey();

  // explicit false wins
  if (entries.some(([, e]) => e[key] === false)) return false;
  // explicit true wins if present and no false above
  if (entries.some(([, e]) => e[key] === true)) return true;
  // default visible
  return true;
}

/**
 * Tooltip text:
 *  - if not visible() → undefined
 *  - else prefer user text (lang → en → de)
 *  - else (still visible) use i18n fallback for the first matching canonical key
 */
function tip(path: string): string | undefined {
  if (!visible(path)) return undefined;

  const entries = collectEntries(path);
  for (const [, e] of entries) {
    const txt = (e[lang.value] as string | undefined) || e.en || e.de;
    if (txt) return txt;
  }

  // i18n fallback AFTER visibility check
  for (const k of canonicalCandidates(path)) {
    const fk = I18N_FALLBACK[k];
    if (fk) {
      const tr = t(fk);
      if (tr && tr !== fk) return String(tr);
    }
  }
  return undefined;
}

/** keep your existing computed that the template uses */
const formatTip = computed(
  () => tip('MovingImageRecord.WorkVariant.ManifestationOrItem.has_format') || ''
);

</script>
