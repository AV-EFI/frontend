<template>
  <div class="space-y-3">
    <KVNode
      :value="data"
      :path="rootPathComputed"
      :labels="labels"
      :tooltips="tooltips"
      :mode="modeComputed"
    />

    <div v-if="stale.length" class="alert alert-warning mt-4">
      {{ stale.length }} field(s) are not in the current model schema.
      <details class="mt-2">
        <summary class="cursor-pointer">Show</summary>
        <ul class="list-disc ml-6 mt-2">
          <li v-for="p in stale" :key="p"><code>{{ p }}</code></li>
        </ul>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, resolveComponent } from 'vue';

type LabelEntry = { de?: string; en?: string };
type Labels = Record<string, LabelEntry>;

type TipEntry = {
  de?: string;
  en?: string;
  showDetail?: boolean;
  showSearch?: boolean;
};
type Tips = Record<string, TipEntry>;

const props = defineProps<{
  /** payload from backend decorator */
  decorated: { data: any; _meta: { labels: Labels; tooltips: Tips; stalePaths: string[] } };
  /** current UI language */
  lang?: 'de' | 'en';
  /** root path where `data` lives */
  rootPath?: string;
  /** visibility mode (affects showDetail/showSearch) */
  mode?: 'detail' | 'search';
}>();

const lang = computed(() => props.lang ?? 'de');
const modeComputed = computed(() => props.mode ?? 'detail');

const data = computed(() => props.decorated?.data ?? {});
const labels = computed<Labels>(() => props.decorated?._meta?.labels ?? {});
const tooltips = computed<Tips>(() => props.decorated?._meta?.tooltips ?? {});
const stale = computed<string[]>(() => props.decorated?._meta?.stalePaths ?? []);
const rootPathComputed = computed(() => props.rootPath ?? 'MovingImageRecord.WorkVariant');

/** Build candidate canonical paths for a given slot path. */
function canonicalCandidates(path: string): string[] {
    const out: string[] = [path];

    // Add Manifestation/Item class hops when missing
    if (/\.manifestations\[\]\.(?!Manifestation\.)/.test(path)) {
        out.push(path.replace(/\.manifestations\[\]\./, '.manifestations[].Manifestation.'));
    }
    if (/\.items\[\]\.(?!Item\.)/.test(path)) {
        out.push(path.replace(/\.items\[\]\./, '.items[].Item.'));
    }
    if (
        /\.manifestations\[\]\.(?!Manifestation\.)/.test(path) &&
    /\.items\[\]\.(?!Item\.)/.test(path)
    ) {
        out.push(
            path
                .replace(/\.manifestations\[\]\./, '.manifestations[].Manifestation.')
                .replace(/\.items\[\]\./, '.items[].Item.')
        );
    }

    // Always add MOI variant as a candidate (safe: used only if present in dict)
    const leaf = path.split('.').pop() || path;
    const moiCand = `MovingImageRecord.WorkVariant.ManifestationOrItem.${leaf}`;
    if (!out.includes(moiCand)) out.push(moiCand);

    // Dedupe
    return Array.from(new Set(out));
}

function labelFor(path: string): string {
    const dict = labels.value;
    const cands = canonicalCandidates(path);
    for (const c of cands) {
        const e = dict[c];
        if (e) return e[lang.value] || e.en || e.de || (c.split('.').pop() || c);
    }
    return path.split('.').pop() || path;
}

function tipFor(path: string): TipEntry | undefined {
    const dict = tooltips.value;
    const cands = canonicalCandidates(path);
    for (const c of cands) {
        const e = dict[c];
        if (e) return e;
    }
    return undefined;
}

function isVisible(path: string, mode: 'detail' | 'search'): boolean {
    const t = tipFor(path);
    if (!t) return true; // default visible
    if (mode === 'detail') return t.showDetail !== false;
    return t.showSearch !== false;
}

/** Local, pure renderer */
const KVNode: any = defineComponent({
    name: 'KVNode',
    props: {
        value: { type: null, required: true },
        path: { type: String, required: true },
        labels: { type: Object as () => Labels, required: true },
        tooltips: { type: Object as () => Tips, required: true },
        mode: { type: String as () => 'detail' | 'search', required: true }
    },
    setup(p) {
        const Icon = resolveComponent('Icon') as any;

        const leafRow = (path: string, v: unknown) => {
            if (!isVisible(path, p.mode)) return null;

            const tip = tipFor(path);
            const title = (tip?.[lang.value as 'de' | 'en'] ||
        tip?.en ||
        tip?.de ||
        '') as string;

            return h('div', { class: 'grid grid-cols-[240px_1fr] gap-3 items-start' }, [
                h('div', { class: 'text-sm font-medium flex items-center gap-1' }, [
                    h('span', null, labelFor(path)),
                    title
                        ? h(Icon, {
                            name: 'tabler:info-circle',
                            class: 'inline-block ml-1 align-text-bottom opacity-60',
                            title
                        })
                        : null
                ]),
                h('div', { class: 'text-sm break-words' }, String(v ?? '—'))
            ]);
        };

        const renderObject = (path: string, v: Record<string, any>) => {
            const rows = Object.keys(v)
                .sort()
                .map((k) => h(KVNode, { value: v[k], path: `${path}.${k}`, labels: p.labels, tooltips: p.tooltips, mode: p.mode }))
                .filter(Boolean);
            return rows.length ? h('div', { class: 'space-y-2' }, rows) : null;
        };

        const renderArray = (path: string, arr: any[]): any => {
            // header (array label + tooltip)
            const tip = tipFor(path);
            const title = (tip?.[lang.value as 'de' | 'en'] || tip?.en || tip?.de || '') as string;

            const header = h(
                'div',
                { class: 'text-sm font-semibold mt-3 flex items-center gap-1' },
                [
                    h('span', null, labelFor(path)),
                    title
                        ? h(Icon, {
                            name: 'tabler:info-circle',
                            class: 'inline-block align-text-bottom opacity-60',
                            title
                        })
                        : null
                ]
            );

            const items: any = arr.length
                ? arr
                    .map((it, idx) =>
                        h('div', { class: 'rounded border p-3 mb-2' }, [
                            h('div', { class: 'text-xs opacity-60 mb-2' }, `#${idx + 1}`),
                            h(KVNode, {
                                value: it,
                                path: `${path}[]`,
                                labels: p.labels,
                                tooltips: p.tooltips,
                                mode: p.mode
                            })
                        ])
                    )
                    .filter(Boolean)
                : [h('div', { class: 'text-sm opacity-60' }, '—')];

            return h('div', null, [header, ...items]);
        };

        return (): any => {
            const v: any = p.value;
            if (v === null || v === undefined) return leafRow(p.path, '');
            if (Array.isArray(v)) return renderArray(p.path, v);
            if (typeof v === 'object') return renderObject(p.path, v);
            return leafRow(p.path, v);
        };
    }
});
</script>
