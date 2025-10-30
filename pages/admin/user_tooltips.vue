<template>
  <GlobalBreadcrumbsComp
    :breadcrumbs="[['Home','/'],[$t('userGlossary'),'admin/user_tooltips']]"
  />
  <NuxtLayout name="partial-layout-1-center" padding-class="p-0">
    <template #title>
      <h2 class="text-2xl font-bold pl-2">{{ $t('ut.pageTitle') }}</h2>
    </template>

    <template #cardBody>
      <div class="mx-auto p-2 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <!-- LEFT: Tree + controls -->
        <section>
          <div v-if="!canEdit" class="alert alert-info my-3">
            {{ $t('ut.editingDisabled') }}
          </div>

          <h1 class="text-2xl font-bold mb-2">{{ $t('ut.sectionTitle') }}</h1>
          <div class="text-sm opacity-70 mb-3" v-if="updatedAt">
            {{ $t('ut.lastSaved') }}: {{ formatDate(updatedAt) }}
          </div>

          <div class="mb-3">
            <input v-model="q" class="input input-bordered w-full" :placeholder="$t('ut.searchPlaceholder')" />
          </div>

          <div class="border rounded-lg p-2 h-[70vh] overflow-auto">
            <div v-if="loadingTree" class="p-4 opacity-60">{{ $t('ut.loadingTree') }}</div>
            <div v-else-if="!tree" class="p-4 opacity-60">{{ $t('ut.noTree') }}</div>
            <TreeNode
              v-else
              :node="tree"
              :filter="q"
              :active-path="currentPath"
              :root="true"
              @select="onSelect"
            />
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <button class="btn btn-sm" @click="exportJSON">{{ $t('ut.exportJSON') }}</button>
            <button class="btn btn-sm" @click="exportCSV">{{ $t('ut.exportCSV') }}</button>
          </div>

          <!-- Stale (orphan) tooltips -->
          <div v-if="staleList.length" class="alert alert-warning mt-4">
            <div class="flex-1">
              <span class="font-semibold">{{ $t('ut.headsUp') }}</span>
              {{ staleList.length }} {{ $t('ut.staleRest') }}
              <details class="mt-2">
                <summary class="cursor-pointer">{{ $t('ut.showList') }}</summary>
                <ul class="list-disc ml-6 mt-2">
                  <li v-for="p in staleList" :key="p">
                    <a class="link" href="#" @click.prevent="jumpTo(p)">{{ p }}</a>
                  </li>
                </ul>
              </details>
            </div>
            <div class="flex items-center gap-2 mt-3">
              <label class="label cursor-pointer gap-2">
                <input type="checkbox" class="checkbox checkbox-sm" v-model="staleSelectAll" />
                <span class="label-text text-sm">{{ $t('ut.selectAll') }}</span>
              </label>
              <button class="btn btn-sm" @click="deleteSelectedStale" :disabled="!staleSelection.size || !canEdit">{{ $t('ut.deleteSelected') }}</button>
              <button class="btn btn-sm btn-outline" @click="deleteAllStale" :disabled="!staleList.length || !canEdit">{{ $t('ut.deleteAll') }}</button>
            </div>
          </div>

          <div v-if="errors.length" class="alert alert-error mt-4">
            <ul class="list-disc ml-6">
              <li v-for="(e,i) in errors" :key="i">{{ e }}</li>
            </ul>
          </div>
        </section>

        <!-- RIGHT: Editor -->
        <section>
          <div class="card bg-base-100 shadow">
            <div class="card-body">
              <div class="flex flex-col items-start justify-between gap-3">
                <div>
                  <h2 class="card-title">{{ $t('ut.editTooltip') }}</h2>
                  <h3>{{ currentHint?.label }}</h3>
                  <p v-if="currentHint?.description" class="text-sm opacity-70 mt-1">
                    {{ currentHint.description }}
                    <a v-if="currentHint?.docsUrl" :href="currentHint.docsUrl" target="_blank" class="link ml-2">{{ $t('ut.docs') }} ↗</a>
                  </p>
                  <code class="text-xs opacity-70" v-if="currentPath">{{ currentPath }}</code>
                </div>
              </div>

              <FormKit
                type="form"
                :actions="false"
                @submit="save"
                :config="{ validationVisibility: 'live' }"
                :disabled="!currentPath || !canEdit || saving"
                class="mt-4"
              >
                <div class="grid gap-4 md:grid-cols-2 border-t pt-4">
                  <FormKit
                    type="textarea"
                    name="de"
                    v-model="form.de"
                    :label="$t('ut.deLabel')"
                    validation="length:0,2000"
                    :placeholder="$t('ut.dePlaceholder')"
                  />
                  <FormKit
                    type="textarea"
                    name="en"
                    v-model="form.en"
                    :label="$t('ut.enLabel')"
                    validation="length:0,2000"
                    :placeholder="$t('ut.enPlaceholder')"
                  />
                </div>
                <div class="grid gap-3 md:grid-cols-2 mt-2">
  <FormKit
    type="checkbox"
    name="showDetail"
    v-model="form.showDetail"
    :label="$t('ut.showInDetail')"
  />
  <FormKit
    type="checkbox"
    name="showSearch"
    v-model="form.showSearch"
    :label="$t('ut.showInSearch')"
  />
</div>
                <div class="mt-4 flex items-center gap-2 border-t pt-4">
                  <button class="btn btn-primary" type="submit" :disabled="!currentPath || saving">{{ $t('ut.save') }}</button>
                  <button class="btn btn-outline" type="button" @click="revert" :disabled="!dirty || saving">{{ $t('ut.revert') }}</button>
                  <span v-if="saving" class="loading loading-spinner loading-sm"></span>
                  <span v-if="savedFlash" class="text-success">{{ $t('ut.saved') }}</span>
                </div>
              </FormKit>

              <details class="collapse collapse-arrow bg-base-200 mt-6">
                <summary class="collapse-title text-md font-medium">{{ $t('ut.bulkEdit') }}</summary>
                <div class="collapse-content">
                  <div class="overflow-x-auto mt-3">
                    <table class="table table-zebra">
                      <thead>
                        <tr>
                          <th>{{ $t('ut.thPath') }}</th>
                          <th>{{ $t('ut.thDe') }}</th>
                          <th>{{ $t('ut.thEn') }}</th>
                          <th class="text-right">{{ $t('ut.thActions') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in rows" :key="row.path">
                          <td class="align-top"><code>{{ row.path }}</code></td>
                          <td class="align-top">
                            <textarea v-model="row.de" class="textarea textarea-bordered textarea-sm w-full" rows="2"></textarea>
                          </td>
                          <td class="align-top">
                            <textarea v-model="row.en" class="textarea textarea-bordered textarea-sm w-full" rows="2"></textarea>
                          </td>
                          <td class="text-right align-top">
                            <button class="btn btn-ghost btn-sm" @click="removeRow(row.path)" :disabled="!canEdit">✕</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="mt-3 flex items-center gap-2">
                    <button class="btn btn-sm" @click="saveAll" :disabled="saving || !canEdit">{{ $t('ut.btnSaveAll') }}</button>
                    <button class="btn btn-sm" @click="dedupe" :disabled="saving">{{ $t('ut.btnDedupe') }}</button>
                    <button class="btn btn-sm" @click="sortRows" :disabled="saving">{{ $t('ut.btnSort') }}</button>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </section>
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineComponent, h } from 'vue';

type HintMap = Record<string, { label?: string; description?: string; docsUrl?: string }>;
type Row = {
  path: string;
  de: string;
  en: string;
  showDetail?: boolean;
  showSearch?: boolean;
};
type TreeNodeT = { name: string; path: string; kind: 'object'|'array'|'group'|'string'; description?: string; children: TreeNodeT[] };

const q = ref<string>('');
const tree = ref<TreeNodeT | null>(null);
const loadingTree = ref<boolean>(true);
const hints = ref<HintMap>({});
const currentPath = ref<string>('');
// init
const form = ref<Row>({ path: '', de: '', en: '', showDetail: undefined, showSearch: undefined });
const rows = ref<Row[]>([]);
const updatedAt = ref<string | null>(null);
const errors = ref<string[]>([]);
const saving = ref<boolean>(false);
const savedFlash = ref<boolean>(false);

const runtime = useRuntimeConfig();
const canEdit = (runtime?.public?.cms?.allowUserTooltipEdits ?? true) as boolean;

const dirty = computed<boolean>(() => {
    if (!currentPath.value) return false;
    const r = rows.value.find(x => x.path === currentPath.value);
    return !!r && (r.de !== form.value.de || r.en !== form.value.en);
});
const currentHint = computed(() => (currentPath.value ? hints.value[currentPath.value] || null : null));

/** collect leaf slot paths */
const validPaths = ref<Set<string>>(new Set<string>());
function collectValidPaths(n: TreeNodeT | null): void {
    const out: string[] = [];
    function walk(node: TreeNodeT): void {
        if (node.kind === 'string') { // leaf slot
            out.push(node.path);
            return;
        }
        for (const c of node.children || []) walk(c);
    }
    if (n) walk(n);
    validPaths.value = new Set(out);
}

/** stale/orphan detection */
const staleList = computed<string[]>(() =>
    rows.value.map(r => r.path).filter(p => !validPaths.value.has(p)).sort((a,b)=>a.localeCompare(b))
);
const staleSelection = ref<Set<string>>(new Set<string>());
const staleSelectAll = computed<boolean>({
    get(): boolean {
        return staleList.value.length > 0 && staleSelection.value.size === staleList.value.length;
    },
    set(v: boolean) {
        if (v) staleSelection.value = new Set(staleList.value);
        else staleSelection.value.clear();
    }
});

async function loadTree(): Promise<void> {
    loadingTree.value = true;
    try {
        const data = await $fetch<TreeNodeT>('/api/cms/modeltree', { cache: 'no-cache' as any });
        tree.value = data;
        collectValidPaths(tree.value);
    } catch (e: any) {
        errors.value.push('Failed to load model tree: ' + (e?.statusMessage || e?.message || String(e)));
        tree.value = null;
    } finally {
        loadingTree.value = false;
    }
}
async function loadHints(): Promise<void> {
    hints.value = await $fetch<HintMap>('/api/cms/modelhints', { cache: 'no-cache' as any });
}
async function loadTooltips(): Promise<void> {
    const data = await $fetch<{ entries: Row[]; updatedAt: string }>('/api/cms/usertooltips', { cache: 'no-cache' as any });
    rows.value = data.entries;
    updatedAt.value = data.updatedAt;
}

function formatDate(iso: string): string {
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

function onSelect(node: TreeNodeT): void {
    if (!node?.path || node.kind !== 'string') return; // select only leaf slots
    currentPath.value = node.path;
    bindFormFor(node.path);
}
function bindFormFor(path: string): void {
    const existing = rows.value.find(r => r.path === path);
    form.value = {
        path,
        de: existing?.de ?? '',
        en: existing?.en ?? '',
        showDetail: existing?.showDetail,
        showSearch: existing?.showSearch
    };

}

function upsertRow(r: Row): void {
    const i = rows.value.findIndex(x => x.path === r.path);
    if (i >= 0) rows.value[i] = { ...rows.value[i], ...r };
    else rows.value.push({ ...r });
}

async function save(): Promise<void> {
    if (!currentPath.value) return;
    saving.value = true;
    try {
        upsertRow({
            path: currentPath.value,
            de: form.value.de ?? '',
            en: form.value.en ?? '',
            showDetail: form.value.showDetail,
            showSearch: form.value.showSearch
        });
        const payload = {
            entries: rows.value.map(r => ({
                path: r.path,
                de: r.de ?? '',
                en: r.en ?? '',
                showDetail: r.showDetail,
                showSearch: r.showSearch
            }))
        };
        const res = await $fetch<{ ok: boolean; updatedAt: string }>('/api/cms/usertooltips', { method: 'PUT', body: payload });
        updatedAt.value = res.updatedAt;
        savedFlash.value = true;
        setTimeout(() => { savedFlash.value = false; }, 1200);
    } catch (e: any) {
        errors.value = ['Save failed: ' + (e?.statusMessage || e?.message || String(e))];
    } finally {
        saving.value = false;
    }
}

function revert(): void {
    if (currentPath.value) bindFormFor(currentPath.value);
}
function removeRow(path: string): void {
    rows.value = rows.value.filter(r => r.path !== path);
}
function sortRows(): void {
    rows.value = [...rows.value].sort((a,b)=>a.path.localeCompare(b.path));
}
function dedupe(): void {
    const seen = new Set<string>();
    rows.value = rows.value.filter(r => {
        if (!r.path || seen.has(r.path)) return false;
        seen.add(r.path);
        return true;
    });
}
async function saveAll(): Promise<void> {
    saving.value = true;
    try {
        const payload = { entries: rows.value.map(r => ({ path: r.path, de: r.de ?? '', en: r.en ?? '' })) };
        const res = await $fetch<{ ok: boolean; updatedAt: string }>('/api/cms/usertooltips', { method: 'PUT', body: payload });
        updatedAt.value = res.updatedAt;
        savedFlash.value = true;
        setTimeout(() => { savedFlash.value = false; }, 1200);
    } catch (e: any) {
        errors.value = ['Save failed: ' + (e?.statusMessage || e?.message || String(e))];
    } finally {
        saving.value = false;
    }
}
function jumpTo(p: string): void {
    currentPath.value = p;
    bindFormFor(p);
    staleSelection.value.add(p);
}
function deleteSelectedStale(): void {
    if (!staleSelection.value.size) return;
    rows.value = rows.value.filter(r => !staleSelection.value.has(r.path));
    staleSelection.value.clear();
}
function deleteAllStale(): void {
    const set = new Set(staleList.value);
    rows.value = rows.value.filter(r => !set.has(r.path));
    staleSelection.value.clear();
}

function exportJSON(): void {
    const blob = new Blob([JSON.stringify({ entries: rows.value }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'user-tooltips.json';
    a.click();
    URL.revokeObjectURL(a.href);
}

function exportCSV(): void {
    const header = 'path,de,en';
    const esc = (s: string) => `"${(s ?? '').replace(/"/g, '""')}"`;
    const lines = rows.value.map(r => [r.path, r.de ?? '', r.en ?? ''].map(esc).join(','));
    const csv = [header, ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'user-tooltips.csv';
    a.click();
    URL.revokeObjectURL(a.href);
}

onMounted(async () => {
    await Promise.all([loadTree(), loadHints(), loadTooltips()]);
});

/** Local tree renderer */
const TreeNode = defineComponent({
    name: 'TreeNode',
    props: {
        node: { type: Object as () => ({ name: string; path: string; kind: 'object'|'array'|'group'|'string'; description?: string; children?: any[] }), required: true },
        filter: { type: String, default: '' },
        activePath: { type: String, default: '' },
        root: { type: Boolean, default: false }
    },
    emits: ['select'],
    data() {
        return { open: (this.root as boolean) || false };
    },
    computed: {
        term(): string { return (this.filter || '').toLowerCase(); },
        isActive(): boolean { return this.activePath === (this.node as any).path; },
        childrenAll(): any[] { return ((this.node as any).children || []) as any[]; },
        childrenFiltered(): any[] {
            const kids = this.childrenAll;
            if (!this.term) return kids;
            const t = this.term;
            const matches = (n: any): boolean =>
                (n.name?.toLowerCase().includes(t) ||
         n.path?.toLowerCase().includes(t)) ||
        (n.children || []).some(matches);
            return kids.filter(matches);
        }
    },
    methods: {
        toggle(e?: Event): void {
            if (e) e.stopPropagation();
            if ((this.node as any).kind === 'string') return; // leafs don't toggle
            this.open = !this.open;
        },
        rowClick(): void {
            const n = this.node as any;
            if (n.kind === 'string') this.$emit('select', n); // leaf: select
            else this.toggle(); // non-leaf: toggle on row click
        }
    },
    render() {
        const node = this.node as any;
        const kids = this.childrenFiltered;
        const isLeaf = node.kind === 'string';
        const hasChildren = !isLeaf && kids.length > 0;
        const Self = resolveComponent('TreeNode') as any;

        return h('div', { class: 'pl-2' }, [
            h(
                'div',
                {
                    class: [
                        'flex items-center gap-2 py-1 rounded hover:bg-base-200',
                        isLeaf ? 'cursor-pointer' : 'cursor-default',
                        this.isActive ? 'bg-base-300' : ''
                    ],
                    onClick: this.rowClick
                },
                [
                    // no chevron for leaves
                    isLeaf
                        ? h('span', { class: 'inline-block w-4' }) // spacer
                        : h('button', { class: 'btn btn-ghost btn-xs', onClick: (e: Event) => this.toggle(e) }, this.open ? '▾' : '▸'),
                    h('span', { class: 'font-mono text-xs opacity-70' }, node.kind),
                    h('span', { class: 'font-semibold' }, node.name),
                    h('code', { class: 'ml-auto text-xs opacity-70' }, node.path)
                ]
            ),
            // only non-leaves can show a children panel
            !isLeaf && this.open
                ? h('div', { class: 'pl-4' },
                    hasChildren
                        ? kids.map((child: any) =>
                            h(Self, {
                                node: child,
                                filter: this.filter,
                                activePath: this.activePath,
                                onSelect: (n: any) => this.$emit('select', n)
                            })
                        )
                        : [h('div', { class: 'text-xs opacity-60 pl-6 py-1' }, this.$t('ut.noChildren') as string)]
                )
                : null
        ]);
    }
});


</script>
