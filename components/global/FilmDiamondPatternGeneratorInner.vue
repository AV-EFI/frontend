<template>
    <div class="w-full">
        <div class="flex flex-col gap-4">
            <section class="w-full">
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <!-- Controls -->
                    <div class="lg:col-span-4">
                        <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div class="mb-4 flex items-center justify-between gap-3">
                                <h2 class="text-base font-semibold text-gray-900">Diamond Film Pattern</h2>
                                <button
                                    class="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
                                    type="button" @click="randomizeSeed">
                                    Randomize
                                </button>
                            </div>
                            <!-- ...existing controls and inputs... -->
                            <!-- Colors, Grid, Icons, Export sections -->
                            <!-- ...existing code... -->
                        </div>
                    </div>
                    <!-- Preview -->
                    <div class="lg:col-span-8">
                        <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                            <!-- ...existing preview code... -->
                            <div class="overflow-hidden rounded-xl border border-gray-100 bg-white">
                                <div class="w-full" v-html="svg" />
                            </div>
                            <details class="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                                <summary class="cursor-pointer select-none text-sm font-medium text-gray-900">
                                    Show SVG source
                                </summary>
                                <pre
                                    class="mt-3 max-h-72 overflow-auto rounded-lg bg-white p-3 text-xs text-gray-800"><code>{{ svg }}</code></pre>
                            </details>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
// Only import icons as needed
const { defaultOptions, buildSvg, downloadSvg, exportPng, exportPdfViaPrint } = useDiamondFilmPatternTabler();
const opts = reactive(structuredClone(defaultOptions));
const iconBgRadiusProxy = computed<number | null>({
    get() {
        return typeof opts.iconBgRadius === 'number' ? opts.iconBgRadius : null;
    },
    set(v) {
        if (v === null || Number.isNaN(v)) delete (opts as any).iconBgRadius;
        else opts.iconBgRadius = v;
    },
});
const iconsCsv = ref(opts.tablerIcons.join(', '));
watch(
    iconsCsv,
    (v) => {
        const cleaned = v
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        opts.tablerIcons = cleaned.length ? cleaned : defaultOptions.tablerIcons;
    },
    { immediate: true }
);
watch(
    () => opts.iconSpread.mode,
    (mode) => {
        if (mode === 'custom') {
            opts.iconSpread.rowParity ??= 'even';
            opts.iconSpread.colParity ??= 'even';
            opts.iconSpread.rowStep ??= 1;
            opts.iconSpread.colStep ??= 1;
            opts.iconSpread.rowOffset ??= 0;
            opts.iconSpread.colOffset ??= 0;
            opts.iconSpread.jitterIndex ??= 0.2;
            return;
        }
        delete (opts.iconSpread as any).rowParity;
        delete (opts.iconSpread as any).colParity;
        delete (opts.iconSpread as any).rowStep;
        delete (opts.iconSpread as any).colStep;
        delete (opts.iconSpread as any).rowOffset;
        delete (opts.iconSpread as any).colOffset;
        if (mode === 'even' || mode === 'odd') opts.iconSpread.jitterIndex = 0;
        else if (typeof opts.iconSpread.jitterIndex !== 'number') opts.iconSpread.jitterIndex = 0.2;
    },
    { immediate: true }
);
const svg = computed(() => buildSvg(opts));
const pngScale = ref(2);
function randomizeSeed() {
    opts.seed = Math.floor(Math.random() * 1_000_000_000);
}
function fileBase() {
    const mode = opts.iconSpread.mode;
    return `diamond-film_${opts.width}x${opts.height}_step${opts.gridStep}_icons${opts.iconRows}x${opts.iconCols}_${mode}_seed${opts.seed}`;
}
function onDownloadSvg() {
    downloadSvg(svg.value, `${fileBase()}.svg`);
}
async function onExportPng() {
    await exportPng(svg.value, `${fileBase()}.png`, pngScale.value, opts.background);
}
function onExportPdf() {
    exportPdfViaPrint(svg.value, fileBase());
}
</script>

<style scoped>
:deep(svg) {
    display: block;
    width: 100%;
    height: auto;
}
</style>