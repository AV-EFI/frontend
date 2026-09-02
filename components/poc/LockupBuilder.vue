<!-- eslint-disable vue/no-v-html -->
<template>
    <div class="flex flex-col gap-6 lg:flex-row">
        <div class="flex flex-col gap-4 lg:w-64">
            <fieldset class="fieldset">
                <legend class="fieldset-legend">{{ t('pressLockupPoc.language') }}</legend>
                <div class="join">
                    <button v-for="opt in languageOptions" :key="opt" type="button"
                            class="btn btn-sm join-item" :class="language === opt ? 'btn-primary' : 'btn-outline'"
                            @click="language = opt">
                        {{ opt.toUpperCase() }}
                    </button>
                </div>
            </fieldset>

            <fieldset class="fieldset">
                <legend class="fieldset-legend">{{ t('pressLockupPoc.theme') }}</legend>
                <div class="join">
                    <button v-for="opt in themeOptions" :key="opt" type="button"
                            class="btn btn-sm join-item" :class="theme === opt ? 'btn-primary' : 'btn-outline'"
                            @click="theme = opt">
                        {{ t(`pressLockupPoc.themeLabels.${opt}`) }}
                    </button>
                </div>
            </fieldset>

            <fieldset class="fieldset">
                <legend class="fieldset-legend">{{ t('pressLockupPoc.layout') }}</legend>
                <div class="join">
                    <button v-for="opt in layoutOptions" :key="opt" type="button"
                            class="btn btn-sm join-item" :class="layout === opt ? 'btn-primary' : 'btn-outline'"
                            @click="layout = opt">
                        {{ t(`pressLockupPoc.layoutLabels.${opt}`) }}
                    </button>
                </div>
            </fieldset>

            <fieldset class="fieldset">
                <legend class="fieldset-legend">{{ t('pressLockupPoc.spacing') }}</legend>
                <div class="join">
                    <button v-for="opt in spacingOptions" :key="opt" type="button"
                            class="btn btn-sm join-item" :class="spacing === opt ? 'btn-primary' : 'btn-outline'"
                            @click="spacing = opt">
                        {{ t(`pressLockupPoc.spacingLabels.${opt}`) }}
                    </button>
                </div>
            </fieldset>

            <button type="button" class="btn btn-primary" :disabled="!composedSvg" @click="downloadSvg">
                {{ t('pressLockupPoc.download') }}
            </button>
        </div>

        <div class="flex flex-1 items-center justify-center rounded-lg border border-base-300 p-6">
            <p v-if="loadError" class="text-sm text-error">{{ loadError }}</p>
            <div v-else-if="composedSvg" class="max-w-full" v-html="composedSvg" />
            <MicroLoadingSpinner v-else :label="t('pressLockupPoc.loading')" size="md" :show-label="true" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

type Language = 'de' | 'en';
type Theme = 'light' | 'dark';
type Layout = 'horizontal' | 'vertical';
type Spacing = 'compact' | 'standard' | 'spacious';

const { t } = useI18n();

const languageOptions: Language[] = ['de', 'en'];
const themeOptions: Theme[] = ['light', 'dark'];
const layoutOptions: Layout[] = ['horizontal', 'vertical'];
const spacingOptions: Spacing[] = ['compact', 'standard', 'spacious'];

const language = ref<Language>('de');
const theme = ref<Theme>('light');
const layout = ref<Layout>('horizontal');
const spacing = ref<Spacing>('standard');

/** Tailwind rem scale (1rem = 16px), not linear steps — matches the app's own spacing scale. */
const SPACING_PRESETS: Record<Spacing, { padding: number; gap: number }> = {
    compact: { padding: 16, gap: 12 }, // p-4 / gap-3
    standard: { padding: 32, gap: 24 }, // p-8 / gap-6
    spacious: { padding: 64, gap: 48 }, // p-16 / gap-12
};

const LOGO_ASPECT = { width: 400, height: 155 };
const CLAIM_ASPECT = { width: 230, height: 105 };
const TARGET_HEIGHT = 96;
/** Relative to the logo's ink height, matched to how the two read side by side / stacked. */
const CLAIM_SCALE_HORIZONTAL = 0.8;
const CLAIM_SCALE_VERTICAL = 0.7;

const logoSrc = computed(() => theme.value === 'dark' ? '/img/AV-EFI-Logo-dark.svg' : '/img/AV-EFI-Logo.svg');
const claimSrc = computed(() =>
    `/img/avefi_claim_${language.value}${theme.value === 'dark' ? '_dark' : ''}.svg`
);
const backgroundColor = computed(() => theme.value === 'dark' ? '#1d232a' : '#ffffff');

interface BBox { x: number; y: number; width: number; height: number }

interface SvgAsset {
    inner: string;
    /** Tight ink bounding box in the source viewBox's own units — the claim canvas has baked-in
     * breathing room (from its original shape-padding) that the logo canvas doesn't, so alignment/
     * scaling must go off this instead of the raw viewBox to line up visually. */
    bbox: BBox;
}

const assetCache = new Map<string, SvgAsset>();
const loadError = ref('');

const extractSvgInner = (markup: string): string => {
    const doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
    const root = doc.documentElement;
    if (root.nodeName !== 'svg') {
        throw new Error('Invalid SVG markup');
    }
    root.querySelectorAll('*').forEach((el) => {
        const name = el.tagName.toLowerCase();
        if (name.startsWith('sodipodi:') || name.startsWith('inkscape:')) {
            el.remove();
        }
    });
    // The claim SVGs carry their own full-canvas background rect (added so they stay legible as
    // standalone downloads on dark themes). The composer paints one unified background itself, so
    // this rect is both redundant here and — being opaque and canvas-sized — would swamp getBBox()
    // into reporting the full padded canvas instead of the actual ink extents.
    root.querySelectorAll('#claim-background').forEach((el) => el.remove());
    return root.innerHTML;
};

const toBBox = (box: DOMRect): BBox => ({ x: box.x, y: box.y, width: box.width, height: box.height });

const measureAsset = (inner: string, viewBox: { width: number; height: number }): Pick<SvgAsset, 'bbox'> => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const tempSvg = document.createElementNS(svgNS, 'svg');
    tempSvg.setAttribute('viewBox', `0 0 ${viewBox.width} ${viewBox.height}`);
    tempSvg.style.position = 'absolute';
    tempSvg.style.width = '0';
    tempSvg.style.height = '0';
    tempSvg.style.overflow = 'hidden';
    const g = document.createElementNS(svgNS, 'g');
    g.innerHTML = inner;
    tempSvg.appendChild(g);
    document.body.appendChild(tempSvg);
    const bbox = toBBox(g.getBBox());
    document.body.removeChild(tempSvg);
    return { bbox };
};

const loadSvgAsset = async (src: string, viewBox: { width: number; height: number }): Promise<SvgAsset> => {
    const cached = assetCache.get(src);
    if (cached) {
        return cached;
    }
    const response = await fetch(src);
    if (!response.ok) {
        throw new Error(`Failed to load ${src}`);
    }
    const inner = extractSvgInner(await response.text());
    const asset: SvgAsset = { inner, ...measureAsset(inner, viewBox) };
    assetCache.set(src, asset);
    return asset;
};

const svgMarkup = (asset: SvgAsset, viewBox: { width: number; height: number }, x: number, y: number, scale: number) =>
    `<svg x="${x}" y="${y}" width="${viewBox.width * scale}" height="${viewBox.height * scale}" viewBox="0 0 ${viewBox.width} ${viewBox.height}">${asset.inner}</svg>`;

/** Positions a nested <svg> so the asset's ink bbox left edge lands at `left` and ink top at `top`, scaled to `inkHeight`. */
const placeByTop = (asset: SvgAsset, viewBox: { width: number; height: number }, left: number, top: number, inkHeight: number) => {
    const scale = inkHeight / asset.bbox.height;
    const x = left - asset.bbox.x * scale;
    const y = top - asset.bbox.y * scale;
    return { inkWidth: asset.bbox.width * scale, markup: svgMarkup(asset, viewBox, x, y, scale) };
};

/** Positions a nested <svg> so the asset's ink bbox vertical center lands at `centerY`, ink left edge at `left`. */
const placeByCenter = (asset: SvgAsset, viewBox: { width: number; height: number }, left: number, centerY: number, inkHeight: number) => {
    const scale = inkHeight / asset.bbox.height;
    const x = left - asset.bbox.x * scale;
    const y = centerY - (asset.bbox.y + asset.bbox.height / 2) * scale;
    return { inkWidth: asset.bbox.width * scale, markup: svgMarkup(asset, viewBox, x, y, scale) };
};

const composedSvg = ref('');

watchEffect(async () => {
    loadError.value = '';
    const currentLogoSrc = logoSrc.value;
    const currentClaimSrc = claimSrc.value;
    const currentLayout = layout.value;
    const currentBackground = backgroundColor.value;
    const { padding: PADDING, gap: GAP } = SPACING_PRESETS[spacing.value];

    try {
        const [logoAsset, claimAsset] = await Promise.all([
            loadSvgAsset(currentLogoSrc, LOGO_ASPECT),
            loadSvgAsset(currentClaimSrc, CLAIM_ASPECT),
        ]);

        let totalWidth: number;
        let totalHeight: number;
        let logoPart: ReturnType<typeof placeByTop>;
        let claimPart: ReturnType<typeof placeByTop>;

        if (currentLayout === 'horizontal') {
            // Whole-block vertical centering — matches how the navbar aligns logo + claim (flex
            // `my-auto`), i.e. both elements' full ink bbox centered on the same line.
            const claimHeight = TARGET_HEIGHT * CLAIM_SCALE_HORIZONTAL;
            const rowHeight = Math.max(TARGET_HEIGHT, claimHeight);
            const centerY = PADDING + rowHeight / 2;

            logoPart = placeByCenter(logoAsset, LOGO_ASPECT, PADDING, centerY, TARGET_HEIGHT);
            claimPart = placeByCenter(claimAsset, CLAIM_ASPECT, PADDING + logoPart.inkWidth + GAP, centerY, claimHeight);
            totalWidth = PADDING * 2 + logoPart.inkWidth + GAP + claimPart.inkWidth;
            totalHeight = PADDING * 2 + rowHeight;
        } else {
            // Stacked: logo and claim share the same left edge (ink-aligned, not centered); claim
            // scaled down slightly relative to the logo so it doesn't visually dominate.
            const claimHeight = TARGET_HEIGHT * CLAIM_SCALE_VERTICAL;
            logoPart = placeByTop(logoAsset, LOGO_ASPECT, PADDING, PADDING, TARGET_HEIGHT);
            claimPart = placeByTop(claimAsset, CLAIM_ASPECT, PADDING, PADDING + TARGET_HEIGHT + GAP, claimHeight);
            totalWidth = PADDING * 2 + Math.max(logoPart.inkWidth, claimPart.inkWidth);
            totalHeight = PADDING * 2 + TARGET_HEIGHT + GAP + claimHeight;
        }

        composedSvg.value = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">`
            + `<rect width="${totalWidth}" height="${totalHeight}" fill="${currentBackground}" />`
            + logoPart.markup
            + claimPart.markup
            + '</svg>';
    } catch (err) {
        composedSvg.value = '';
        loadError.value = t('pressLockupPoc.loadError');
        console.error('[press-lockup-poc] Failed to compose lockup', err);
    }
});

const downloadSvg = () => {
    if (!composedSvg.value) {
        return;
    }
    const blob = new Blob([composedSvg.value], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `avefi-lockup-${language.value}-${theme.value}-${layout.value}.svg`;
    link.click();
    URL.revokeObjectURL(url);
};
</script>
