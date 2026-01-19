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
              type="button"
              @click="randomizeSeed"
            >
              Randomize
            </button>
          </div>

          <div class="space-y-5">
            <!-- Colors -->
            <div>
              <h3 class="mb-2 text-sm font-semibold text-gray-900">Colors</h3>
              <div class="grid grid-cols-2 gap-3">
                <label class="block">
                  <span class="mb-1 block text-xs text-gray-600">Foreground</span>
                  <input
                    v-model="opts.foreground"
                    type="text"
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    placeholder="#111827"
                  />
                </label>
                <label class="block">
                  <span class="mb-1 block text-xs text-gray-600">Background</span>
                  <input
                    v-model="opts.background"
                    type="text"
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    placeholder="#ffffff"
                  />
                </label>
              </div>
              <p class="mt-2 text-xs text-gray-500">
                Any valid CSS color string is supported (hex, rgb(), hsl(), etc.).
              </p>
            </div>

            <!-- Grid -->
            <div>
              <h3 class="mb-2 text-sm font-semibold text-gray-900">Grid</h3>
              <div class="grid grid-cols-2 gap-3">
                <label class="block">
                  <span class="mb-1 block text-xs text-gray-600">gridStep</span>
                  <input
                    v-model.number="opts.gridStep"
                    type="number"
                    min="20"
                    step="1"
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label class="block">
                  <span class="mb-1 block text-xs text-gray-600">strokeWidth</span>
                  <input
                    v-model.number="opts.strokeWidth"
                    type="number"
                    min="0.5"
                    step="0.1"
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>

                <label class="block">
                  <span class="mb-1 block text-xs text-gray-600">gridOpacity</span>
                  <input
                    v-model.number="opts.gridOpacity"
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label class="block">
                  <span class="mb-1 block text-xs text-gray-600">nodeRadius</span>
                  <input
                    v-model.number="opts.nodeRadius"
                    type="number"
                    min="0"
                    step="0.1"
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
              </div>
            </div>

            <!-- Icons -->
            <div>
              <h3 class="mb-2 text-sm font-semibold text-gray-900">Icons</h3>

              <div class="grid grid-cols-2 gap-3">
                <label class="block">
                  <span class="mb-1 block text-xs text-gray-600">iconSize</span>
                  <input
                    v-model.number="opts.iconSize"
                    type="number"
                    min="12"
                    step="1"
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label class="block">
                  <span class="mb-1 block text-xs text-gray-600">seed</span>
                  <input
                    v-model.number="opts.seed"
                    type="number"
                    step="1"
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>

                <label class="block">
                  <span class="mb-1 block text-xs text-gray-600">iconCols</span>
                  <input
                    v-model.number="opts.iconCols"
                    type="number"
                    min="1"
                    step="1"
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
                <label class="block">
                  <span class="mb-1 block text-xs text-gray-600">iconRows</span>
                  <input
                    v-model.number="opts.iconRows"
                    type="number"
                    min="1"
                    step="1"
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <div class="mt-3 grid grid-cols-2 gap-3">
                <label class="block">
                  <span class="mb-1 block text-xs text-gray-600">Underlay shape</span>
                  <select
                    v-model="opts.iconBgShape"
                    class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="circle">circle</option>
                    <option value="roundedRect">roundedRect</option>
                  </select>
                </label>

                <label class="block">
                  <span class="mb-1 block text-xs text-gray-600">Underlay padding</span>
                  <input
                    v-model.number="opts.iconBgPadding"
                    type="number"
                    min="0"
                    step="1"
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>

                <label class="block">
                  <span class="mb-1 block text-xs text-gray-600">Underlay opacity</span>
                  <input
                    v-model.number="opts.iconBgOpacity"
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>

                <label class="block">
                  <span class="mb-1 block text-xs text-gray-600">Underlay radius (optional)</span>
                  <input
                    v-model.number="iconBgRadiusProxy"
                    type="number"
                    min="0"
                    step="1"
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    placeholder="auto"
                  />
                </label>
              </div>

              <div class="mt-4">
                <h4 class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Spread mode
                </h4>

                <div class="grid grid-cols-2 gap-3">
                  <label class="block">
                    <span class="mb-1 block text-xs text-gray-600">Mode</span>
                    <select
                      v-model="opts.iconSpread.mode"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="uniform">uniform</option>
                      <option value="checkerboard">checkerboard</option>
                      <option value="even">even lattice</option>
                      <option value="odd">odd lattice</option>
                      <option value="custom">custom</option>
                    </select>
                  </label>

                  <label class="block">
                    <span class="mb-1 block text-xs text-gray-600">jitterIndex</span>
                    <input
                      v-model.number="opts.iconSpread.jitterIndex"
                      type="number"
                      min="0"
                      max="0.8"
                      step="0.05"
                      class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                      :disabled="opts.iconSpread.mode === 'even' || opts.iconSpread.mode === 'odd'"
                    />
                  </label>
                </div>

                <div v-if="opts.iconSpread.mode === 'custom'" class="mt-3 grid grid-cols-2 gap-3">
                  <label class="block">
                    <span class="mb-1 block text-xs text-gray-600">rowParity (i)</span>
                    <select
                      v-model="opts.iconSpread.rowParity"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="even">even</option>
                      <option value="odd">odd</option>
                    </select>
                  </label>

                  <label class="block">
                    <span class="mb-1 block text-xs text-gray-600">colParity (j)</span>
                    <select
                      v-model="opts.iconSpread.colParity"
                      class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="even">even</option>
                      <option value="odd">odd</option>
                    </select>
                  </label>

                  <label class="block">
                    <span class="mb-1 block text-xs text-gray-600">rowStep</span>
                    <input
                      v-model.number="opts.iconSpread.rowStep"
                      type="number"
                      min="1"
                      step="1"
                      class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>

                  <label class="block">
                    <span class="mb-1 block text-xs text-gray-600">colStep</span>
                    <input
                      v-model.number="opts.iconSpread.colStep"
                      type="number"
                      min="1"
                      step="1"
                      class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>

                  <label class="block">
                    <span class="mb-1 block text-xs text-gray-600">rowOffset</span>
                    <input
                      v-model.number="opts.iconSpread.rowOffset"
                      type="number"
                      min="0"
                      step="1"
                      class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>

                  <label class="block">
                    <span class="mb-1 block text-xs text-gray-600">colOffset</span>
                    <input
                      v-model.number="opts.iconSpread.colOffset"
                      type="number"
                      min="0"
                      step="1"
                      class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>
                </div>

                <p class="mt-2 text-xs text-gray-500">
                  Even/odd modes guarantee perfect alignment on a sublattice. Custom lets you choose parity,
                  step and offsets explicitly.
                </p>
              </div>

              <div class="mt-4">
                <h4 class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Icon set
                </h4>
                <textarea
                  v-model="iconsCsv"
                  rows="3"
                  class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  placeholder="movie, film, camera, clapperboard, ..."
                />
                <p class="mt-2 text-xs text-gray-500">
                  Comma-separated Tabler icon names (no prefix). Invalid names fall back to a simple circle.
                </p>
              </div>
            </div>

            <!-- Export -->
            <div>
              <h3 class="mb-2 text-sm font-semibold text-gray-900">Export</h3>
              <ClientOnly>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    class="rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    type="button"
                    @click="onDownloadSvg"
                  >
                    Download SVG
                  </button>
                  <button
                    class="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 hover:bg-gray-50"
                    type="button"
                    @click="onExportPng"
                  >
                    Export PNG
                  </button>
                  <button
                    class="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 hover:bg-gray-50"
                    type="button"
                    @click="onExportPdf"
                  >
                    Print to PDF
                  </button>
                  <label class="block">
                    <span class="mb-1 block text-xs text-gray-600">PNG scale</span>
                    <input
                      v-model.number="pngScale"
                      type="number"
                      min="1"
                      max="6"
                      step="0.5"
                      class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                    />
                  </label>
                </div>
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="lg:col-span-8">
        <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div class="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-semibold text-gray-900">Preview</h2>
              <p class="text-xs text-gray-500">
                SVG is rendered inline. Export actions use the same generated SVG string.
              </p>
            </div>

            <div class="text-right text-xs text-gray-500">
              <div>{{ opts.width }}×{{ opts.height }}</div>
              <div>gridStep {{ opts.gridStep }}, stroke {{ opts.strokeWidth }}</div>
            </div>
          </div>

          <div class="overflow-hidden rounded-xl border border-gray-100 bg-white">
            <!-- SVG preview -->
            <div class="w-full" v-html="svg" />
          </div>

          <details class="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <summary class="cursor-pointer select-none text-sm font-medium text-gray-900">
              Show SVG source
            </summary>
            <pre class="mt-3 max-h-72 overflow-auto rounded-lg bg-white p-3 text-xs text-gray-800"><code>{{ svg }}</code></pre>
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

const { defaultOptions, buildSvg, downloadSvg, exportPng, exportPdfViaPrint } = useDiamondFilmPatternTabler();

const opts = reactive(structuredClone(defaultOptions));

// convenience: allow clearing iconBgRadius by empty input
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

// keep spread config coherent when switching modes
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

        // non-custom modes: remove custom-only fields to reduce confusion
        delete (opts.iconSpread as any).rowParity;
        delete (opts.iconSpread as any).colParity;
        delete (opts.iconSpread as any).rowStep;
        delete (opts.iconSpread as any).colStep;
        delete (opts.iconSpread as any).rowOffset;
        delete (opts.iconSpread as any).colOffset;

        // reasonable defaults per mode
        if (mode === 'even' || mode === 'odd') opts.iconSpread.jitterIndex = 0;
        else if (typeof opts.iconSpread.jitterIndex !== 'number') opts.iconSpread.jitterIndex = 0.2;
    },
    { immediate: true }
);

const svg = computed(() => buildSvg(opts));

const pngScale = ref(2);

function randomizeSeed() {
    // deterministic but user-friendly
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
/* Keep the inline SVG from creating extra whitespace */
:deep(svg) {
  display: block;
  width: 100%;
  height: auto;
}
</style>