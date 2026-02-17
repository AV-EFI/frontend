// composables/useDiamondFilmPatternTabler.ts
import { iconToSVG, replaceIDs } from '@iconify/utils';
import { filmDiamondIcons, filmDiamondIconNames } from '~/data/film-diamond-icons';

export type Parity = 'even' | 'odd'
export type SpreadMode = 'uniform' | 'checkerboard' | 'even' | 'odd' | 'custom'

export interface IconSpreadConfig {
  mode: SpreadMode
  rowParity?: Parity
  colParity?: Parity
  rowStep?: number
  colStep?: number
  rowOffset?: number
  colOffset?: number
  jitterIndex?: number
}

export interface DiamondFilmPatternOptions {
  width: number
  height: number
  padding: number
  gridStep: number

  foreground: string
  background: string

  strokeWidth: number
  gridOpacity: number
  nodeRadius: number

  showNodes: boolean

  iconSize: number

  iconCols: number
  iconRows: number

  iconSpread: IconSpreadConfig

  seed: number

  tablerIcons: string[]

  iconBgPadding: number
  iconBgOpacity: number
  iconBgShape: 'circle' | 'roundedRect'
  iconBgRadius?: number
}

function mulberry32(seed: number) {
    let a = seed >>> 0;
    return function rand() {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function pick<T>(arr: T[], r: () => number) {
    return arr[Math.floor(r() * arr.length)];
}

function clampInt(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, Math.round(v)));
}

function inParity(n: number, parity: Parity) {
    return parity === 'even' ? n % 2 === 0 : Math.abs(n % 2) === 1;
}

function resolveSpread(cfg: IconSpreadConfig) {
    const base = {
        rowParity: 'even' as Parity,
        colParity: 'even' as Parity,
        rowStep: 1,
        colStep: 1,
        rowOffset: 0,
        colOffset: 0,
        jitterIndex: 0.2,
    };

    switch (cfg.mode) {
    case 'uniform':
        return {
            ...base,
            rowParity: cfg.rowParity ?? 'even',
            colParity: cfg.colParity ?? 'even',
            jitterIndex: cfg.jitterIndex ?? 0.2,
        };
    case 'checkerboard':
        return {
            ...base,
            rowParity: cfg.rowParity ?? 'even',
            colParity: cfg.colParity ?? 'odd',
            jitterIndex: cfg.jitterIndex ?? 0.2,
        };
    case 'even':
        return { ...base, rowParity: 'even', colParity: 'even', jitterIndex: cfg.jitterIndex ?? 0 };
    case 'odd':
        return { ...base, rowParity: 'odd', colParity: 'odd', jitterIndex: cfg.jitterIndex ?? 0 };
    case 'custom':
    default:
        return {
            rowParity: cfg.rowParity ?? 'even',
            colParity: cfg.colParity ?? 'even',
            rowStep: Math.max(1, Math.round(cfg.rowStep ?? 1)),
            colStep: Math.max(1, Math.round(cfg.colStep ?? 1)),
            rowOffset: Math.max(0, Math.round(cfg.rowOffset ?? 0)),
            colOffset: Math.max(0, Math.round(cfg.colOffset ?? 0)),
            jitterIndex: cfg.jitterIndex ?? 0.2,
        };
    }
}

function applyStepAndOffset(arr: number[], step: number, offset: number) {
    const start = Math.min(arr.length, Math.max(0, offset));
    const out: number[] = [];
    for (let k = start; k < arr.length; k += step) out.push(arr[k]);
    return out;
}

function pickEvenlyFromIndices(arr: number[], count: number, rand: () => number, jitterIndex: number) {
    if (arr.length === 0) return [];
    if (count >= arr.length) return [...arr];

    const picked: number[] = [];
    for (let k = 0; k < count; k++) {
        const t = (k + 0.5) / count;
        const base = t * (arr.length - 1);
        const jitter = (rand() - 0.5) * (jitterIndex * 2);
        const idx = clampInt(base + jitter, 0, arr.length - 1);
        picked.push(arr[idx]);
    }

    const uniq = Array.from(new Set(picked)).sort((a, b) => a - b);

    while (uniq.length < count) {
        const t = (uniq.length + 0.5) / count;
        const idx = clampInt(t * (arr.length - 1), 0, arr.length - 1);
        const v = arr[idx];
        if (!uniq.includes(v)) uniq.push(v);
        else break;
    }

    return uniq.sort((a, b) => a - b).slice(0, count);
}

/**
 * IMPORTANT:
 * We remove per-path stroke/stroke-width/fill so our wrapper controls color + width.
 * Otherwise Tabler's stroke="currentColor" and stroke-width="2" will override.
 */
function sanitizeIconBody(body: string) {
    return body
    // remove explicit stroke and stroke-width so wrapper wins
        .replace(/\sstroke="[^"]*"/g, '')
        .replace(/\sstroke-width="[^"]*"/g, '')
    // remove explicit fill (Tabler uses fill="none"; we enforce fill="none" in wrapper anyway)
        .replace(/\sfill="[^"]*"/g, '');
}

/**
 * Get Tabler icon SVG body in native units (usually 24x24),
 * plus intrinsic dimensions so we can scale + center on crossings.
 */
function getTablerIconBodyAndDims(name: string): { body: string; w: number; h: number } {
    const icon = filmDiamondIcons[name];

    if (!icon) {
        console.warn('[DiamondPattern] Missing film icon:', name);
        return { body: `<circle cx="12" cy="12" r="7" />`, w: 24, h: 24 };
    }

    const w = typeof icon.width === 'number' ? icon.width : 24;
    const h = typeof icon.height === 'number' ? icon.height : 24;

    const svg = iconToSVG(icon, { width: w, height: h });
    const rawBody = replaceIDs(svg.body, () => `i${Math.random().toString(16).slice(2)}`);
    const body = sanitizeIconBody(rawBody);

    return { body, w, h };
}

function svgDiamondGrid(opts: DiamondFilmPatternOptions) {
    const { width, height, padding, gridStep, foreground, strokeWidth, gridOpacity } = opts;

    const minC1 = -height - padding;
    const maxC1 = width + padding;
    const minC2 = -padding;
    const maxC2 = width + height + padding;

    const lines: string[] = [];

    const segForC1 = (c: number) => {
        const pts: Array<[number, number]> = [];
        pts.push([0, -c]);
        pts.push([width, width - c]);
        pts.push([c, 0]);
        pts.push([c + height, height]);

        const inb = pts.filter(([x, y]) => x >= -padding && x <= width + padding && y >= -padding && y <= height + padding);
        if (inb.length < 2) return null;

        let best: { a: [number, number]; b: [number, number]; d: number } | null = null;
        for (let i = 0; i < inb.length; i++) {
            for (let j = i + 1; j < inb.length; j++) {
                const dx = inb[i][0] - inb[j][0];
                const dy = inb[i][1] - inb[j][1];
                const d = dx * dx + dy * dy;
                if (!best || d > best.d) best = { a: inb[i], b: inb[j], d };
            }
        }
        return best;
    };

    const segForC2 = (c: number) => {
        const pts: Array<[number, number]> = [];
        pts.push([0, c]);
        pts.push([width, c - width]);
        pts.push([c, 0]);
        pts.push([c - height, height]);

        const inb = pts.filter(([x, y]) => x >= -padding && x <= width + padding && y >= -padding && y <= height + padding);
        if (inb.length < 2) return null;

        let best: { a: [number, number]; b: [number, number]; d: number } | null = null;
        for (let i = 0; i < inb.length; i++) {
            for (let j = i + 1; j < inb.length; j++) {
                const dx = inb[i][0] - inb[j][0];
                const dy = inb[i][1] - inb[j][1];
                const d = dx * dx + dy * dy;
                if (!best || d > best.d) best = { a: inb[i], b: inb[j], d };
            }
        }
        return best;
    };

    for (let c = minC1; c <= maxC1; c += gridStep) {
        const seg = segForC1(c);
        if (!seg) continue;
        lines.push(`<line x1="${seg.a[0].toFixed(2)}" y1="${seg.a[1].toFixed(2)}" x2="${seg.b[0].toFixed(2)}" y2="${seg.b[1].toFixed(2)}" />`);
    }

    for (let c = minC2; c <= maxC2; c += gridStep) {
        const seg = segForC2(c);
        if (!seg) continue;
        lines.push(`<line x1="${seg.a[0].toFixed(2)}" y1="${seg.a[1].toFixed(2)}" x2="${seg.b[0].toFixed(2)}" y2="${seg.b[1].toFixed(2)}" />`);
    }

    return `
  <g opacity="${gridOpacity}">
    <g fill="none" stroke="${foreground}" stroke-width="${strokeWidth}" stroke-linecap="round">
      ${lines.join('\n')}
    </g>
  </g>`;
}

function svgGridNodes(opts: DiamondFilmPatternOptions) {
    const { width, height, padding, gridStep, foreground, nodeRadius, gridOpacity } = opts;

    const iMin = Math.floor(((-height - padding) / gridStep));
    const iMax = Math.ceil(((width + padding) / gridStep));
    const jMin = Math.floor(((-padding) / gridStep));
    const jMax = Math.ceil(((width + height + padding) / gridStep));

    const circles: string[] = [];
    for (let i = iMin; i <= iMax; i++) {
        for (let j = jMin; j <= jMax; j++) {
            const x = ((i + j) * gridStep) / 2;
            const y = ((j - i) * gridStep) / 2;
            if (x < 0 || x > width || y < 0 || y > height) continue;
            circles.push(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${nodeRadius}" fill="${foreground}" opacity="${gridOpacity}" />`);
        }
    }

    return `<g class="nodes">${circles.join('\n')}</g>`;
}

function svgIconsOnLattice(opts: DiamondFilmPatternOptions) {
    const {
        width,
        height,
        padding,
        gridStep,
        foreground,
        background,
        strokeWidth,
        iconSize,
        seed,
        tablerIcons: iconNames,
        iconBgPadding,
        iconBgOpacity,
        iconBgShape,
        iconBgRadius,
        iconRows,
        iconCols,
        iconSpread,
    } = opts;

    const rand = mulberry32(seed);
    const spread = resolveSpread(iconSpread);

    const iMin = Math.floor(((-height - padding) / gridStep));
    const iMax = Math.ceil(((width + padding) / gridStep));
    const jMin = Math.floor(((-padding) / gridStep));
    const jMax = Math.ceil(((width + height + padding) / gridStep));

    const iAll: number[] = [];
    for (let i = iMin; i <= iMax; i++) if (inParity(i, spread.rowParity)) iAll.push(i);

    const jAll: number[] = [];
    for (let j = jMin; j <= jMax; j++) if (inParity(j, spread.colParity)) jAll.push(j);

    const iAllowed = applyStepAndOffset(iAll, spread.rowStep, spread.rowOffset);
    const jAllowed = applyStepAndOffset(jAll, spread.colStep, spread.colOffset);

    const rowsWanted = clampInt(iconRows, 1, Math.max(1, iAllowed.length));
    const colsWanted = clampInt(iconCols, 1, Math.max(1, jAllowed.length));

    const iPicked = pickEvenlyFromIndices(iAllowed, rowsWanted, rand, spread.jitterIndex);
    const jPicked = pickEvenlyFromIndices(jAllowed, colsWanted, rand, spread.jitterIndex);

    const underlays: string[] = [];
    const icons: string[] = [];

    for (const i of iPicked) {
        for (const j of jPicked) {
            const x = ((i + j) * gridStep) / 2;
            const y = ((j - i) * gridStep) / 2;
            if (x < 0 || x > width || y < 0 || y > height) continue;

            const rBg = iconBgRadius ?? iconSize / 2 + iconBgPadding;
            if (iconBgShape === 'circle') {
                underlays.push(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${rBg.toFixed(2)}" fill="${background}" opacity="${iconBgOpacity}" />`);
            } else {
                const s = 2 * rBg;
                underlays.push(
                    `<rect x="${(x - rBg).toFixed(2)}" y="${(y - rBg).toFixed(2)}" width="${s.toFixed(
                        2
                    )}" height="${s.toFixed(2)}" rx="${(rBg * 0.35).toFixed(2)}" fill="${background}" opacity="${iconBgOpacity}" />`
                );
            }

            const iconName = pick(iconNames, rand);
            const { body, w, h } = getTablerIconBodyAndDims(iconName);
            const s = iconSize / w;

            // KEY CHANGE:
            // - set color on wrapper
            // - stroke="currentColor" so it uses that wrapper color
            // - wrapper stroke-width controls thickness
            icons.push(`
        <g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(6)}) translate(${(-w / 2).toFixed(2)} ${(-h / 2).toFixed(2)})"
           color="${foreground}">
          <g fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
            ${body}
          </g>
        </g>
      `);
        }
    }

    return `
    <g class="icon-underlays">${underlays.join('\n')}</g>
    <g class="icons">${icons.join('\n')}</g>
  `;
}

export function useDiamondFilmPatternTabler() {
    const defaultOptions: DiamondFilmPatternOptions = {
        width: 2400,
        height: 1600,
        padding: 120,
        gridStep: 90,

        foreground: '#4d768d',
        background: '#ffffff',

        strokeWidth: 1.4,
        gridOpacity: 0.35,
        nodeRadius: 1.6,

        showNodes: false,

        iconSize: 62,

        iconCols: 12,
        iconRows: 12,

        iconSpread: { mode: 'uniform' },

        seed: 1337,

        tablerIcons: [...filmDiamondIconNames],

        iconBgPadding: 10,
        iconBgOpacity: 1,
        iconBgShape: 'circle',
    };

    function buildSvg(options: DiamondFilmPatternOptions) {
        const o = options;
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${o.width}" height="${o.height}" viewBox="0 0 ${o.width} ${o.height}">
  <rect width="100%" height="100%" fill="${o.background}"/>
  ${svgDiamondGrid(o)}
  ${o.showNodes ? svgGridNodes(o) : ''}
  ${svgIconsOnLattice(o)}
</svg>`;
    }

    function downloadText(filename: string, content: string, mime = 'text/plain') {
        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    function downloadSvg(svg: string, filename = 'pattern.svg') {
        downloadText(filename, svg, 'image/svg+xml;charset=utf-8');
    }

    async function exportPng(svg: string, filename = 'pattern.png', scale = 2, background = '#ffffff') {
        const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.decoding = 'async';
        img.crossOrigin = 'anonymous';

        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('Failed to load SVG into Image() for PNG export.'));
            img.src = url;
        });

        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            URL.revokeObjectURL(url);
            throw new Error('Canvas 2D context not available.');
        }

        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);

        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    function exportPdfViaPrint(svg: string, title = 'pattern') {
        const w = window.open('', '_blank', 'noopener,noreferrer');
        if (!w) throw new Error('Popup blocked: cannot open print window.');

        w.document.open();
        w.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    @page { margin: 0; }
    html, body { margin: 0; padding: 0; background: white; }
    svg { display: block; width: 100vw; height: 100vh; }
  </style>
</head>
<body>
${svg}
<script>
  window.onload = () => {
    window.focus();
    window.print();
  };
</script>
</body>
</html>`);
        w.document.close();
    }

    return {
        defaultOptions,
        buildSvg,
        downloadSvg,
        exportPng,
        exportPdfViaPrint,
    };
}
