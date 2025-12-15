// Utility to check contrast ratio between two colors (foreground, background)
// Uses WCAG 2.1 formula
// Usage: import and call checkContrast(fg, bg)
// fg, bg: CSS color strings (hex, rgb, etc.)
// Returns: { ratio: number, passesAA: boolean, passesAAA: boolean }

import tinycolor from 'tinycolor2';

export function getLuminance(color: string): number {
    const tc = tinycolor(color).toRgb();
    const rgb = [tc.r, tc.g, tc.b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

export function contrastRatio(fg: string, bg: string): number {
    const L1 = getLuminance(fg);
    const L2 = getLuminance(bg);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

export function checkContrast(fg: string, bg: string) {
    const ratio = contrastRatio(fg, bg);
    return {
        ratio,
        passesAA: ratio >= 4.5,
        passesAAA: ratio >= 7,
    };
}