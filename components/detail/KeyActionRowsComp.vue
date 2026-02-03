<template>
    <section class="w-full">
        <!-- Header -->
        <header class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 min-w-0">
                <h3
                    class="font-bold text-xs text-base-content/90 truncate tracking-wide dark:text-slate-300 text-neutral">
                    {{ keyLabel }}
                </h3>

                <span v-if="showCount" class="badge badge-sm badge-ghost">
                    {{ rows.length }}
                </span>
            </div>

            <!-- optional header action slot -->
            <slot name="headerAction" />
        </header>

        <!-- Empty -->
        <p v-if="rows.length === 0" class="mt-2 text-sm text-base-content/60">
            <slot name="empty">—</slot>
        </p>

        <!-- Rows -->
        <ul v-else class="mt-2 space-y-1" :aria-label="keyLabel">
            <li v-for="(row, idx) in visibleRows" :key="row.key ?? `${keyLabel}-${idx}`" class="group">
                <div class="flex items-start justify-between gap-2 rounded-lg px-1 py-1
                 hover:bg-base-200/60 focus-within:bg-base-200/60
                 focus-within:outline focus-within:outline-2 focus-within:outline-primary/40">
                    <!-- value -->
                    <div class="min-w-0 flex-1">
                        <a v-if="row.href" :href="row.href" class="link link-hover text-sm break-words"
                            :title="row.title ?? row.text">
                            {{ row.text }}
                        </a>

                        <p v-else class="text-sm text-base-content break-words" :title="row.title ?? row.text">
                            {{ row.text }}
                        </p>

                        <p v-if="row.meta" class="mt-0.5 text-xs text-base-content/60 break-words">
                            {{ row.meta }}
                        </p>
                    </div>

                    <!-- per-value actions -->
                    <div class="shrink-0 flex items-start gap-2">
                        <!-- If consumer wants custom actions for the row -->
                        <slot name="rowAction" :row="row" :index="idx">
                            <!-- Default: use existing AVefi same_as menu if present -->
                            <DetailSameAsComp v-if="row.same_as" :same-as-data="row.same_as" :type="sameAsType"
                                :aria-label="sameAsAriaLabel(row.text)" text="sm"
                                class="flex h-6 items-start opacity-70 group-hover:opacity-100 focus-within:opacity-100" />
                        </slot>
                    </div>
                </div>
            </li>
        </ul>

        <!-- Show more / less -->
        <div v-if="rows.length > initialVisible" class="mt-2">
            <button type="button" class="btn btn-ghost btn-sm" @click="expanded = !expanded"
                :aria-expanded="expanded ? 'true' : 'false'">
                <span v-if="!expanded">Show more ({{ rows.length - initialVisible }})</span>
                <span v-else>Show less</span>
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

type SameAsPayload = any;

type InputValue =
  | string
  | {
      has_name?: string;
      label?: string;
      text?: string;
      same_as?: SameAsPayload;
      href?: string;
      meta?: string;
      key?: string | number;
      title?: string;
    };

type NormalizedRow = {
  key?: string | number;
  text: string;
  title?: string;
  href?: string;
  meta?: string;
  same_as?: SameAsPayload;
};

const props = defineProps<{
  keyLabel: string;
  values: InputValue[] | null | undefined;
  sameAsType: "person" | "place" | "subject" | "genre" | "work" | "manifestation" | "item" | string;
  showCount?: boolean;
  initialVisible?: number;
}>();

const expanded = ref(false);

const initialVisible = computed(() => {
    const n = Number(props.initialVisible ?? 6);
    return Number.isFinite(n) && n > 0 ? n : 6;
});

function textFrom(v: InputValue): string {
    if (typeof v === "string") return v;
    return (v.text ?? v.label ?? v.has_name ?? "").toString();
}

const rows = computed<NormalizedRow[]>(() => {
    const raw = Array.isArray(props.values) ? props.values : [];
    const out: NormalizedRow[] = [];

    for (const v of raw) {
        const text = textFrom(v).trim();
        if (!text) continue;

        if (typeof v === "string") {
            out.push({ text });
        } else {
            out.push({
                key: v.key,
                text,
                title: v.title,
                href: v.href,
                meta: v.meta,
                same_as: v.same_as,
            });
        }
    }

    // optional de-dupe by text (case-insensitive)
    const seen = new Set<string>();
    return out.filter((r) => {
        const k = r.text.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
    });
});

const visibleRows = computed(() => {
    if (expanded.value) return rows.value;
    return rows.value.slice(0, initialVisible.value);
});

function sameAsAriaLabel(valueText: string) {
    return `External links for ${valueText}`;
}
</script>
