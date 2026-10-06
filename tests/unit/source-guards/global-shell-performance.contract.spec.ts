import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const appSource = readFileSync(resolve(process.cwd(), 'app.vue'), 'utf8');
const layoutSource = readFileSync(resolve(process.cwd(), 'layouts/default.vue'), 'utf8');
const nuxtConfigSource = readFileSync(resolve(process.cwd(), 'nuxt.config.ts'), 'utf8');
const mainScssSource = readFileSync(resolve(process.cwd(), 'assets/scss/main.scss'), 'utf8');

describe('Global shell performance contract guards', () => {
  test('keeps global drawers async and mounted only on demand', () => {
    expect(layoutSource).toContain('defineAsyncComponent(() => import');
    expect(layoutSource).toContain('comparisonDrawerReady');
    expect(layoutSource).toContain('contactDrawerReady');
    expect(layoutSource).toContain('prepareContactDrawer');
    expect(layoutSource).toContain('__avefiReplayedContactEvent');
  });

  test('keeps cookie control out of the initial critical path', () => {
    expect(appSource).toContain('const COOKIE_CONTROL_MOUNT_DELAY_MS = 5000');
    expect(appSource).not.toContain('<LazyGlobalAuthProvider />');
  });

  test('serves Bree Serif and Inter on all viewports without preloading the large font files', () => {
    expect(appSource).not.toContain("rel: 'preload', href: '/fonts/Inter.ttf'");
    expect(appSource).not.toContain("rel: 'preload', href: '/fonts/BreeSerif-Regular.ttf'");
    expect(nuxtConfigSource).not.toContain("href: '/fonts/Inter.ttf'");
    expect(nuxtConfigSource).not.toContain("href: '/fonts/BreeSerif-Regular.ttf'");
    expect(mainScssSource).toContain("src: url('/fonts/Inter-latin.woff2') format('woff2');");
    expect(mainScssSource).toContain("src: url('/fonts/BreeSerif-Regular-latin.woff2') format('woff2');");
    expect(mainScssSource).toContain("font-family: 'Inter', system-ui, -apple-system");
    expect(mainScssSource).toContain("font-family: 'BreeSerif', Georgia");
    expect(mainScssSource).not.toContain('font-family: Georgia, "Times New Roman", serif;');
  });

  test('keeps level stripes clipped inside rounded section borders', () => {
    expect(mainScssSource).toContain('.level-stripe {');
    expect(mainScssSource).toContain('overflow: hidden;');
    expect(mainScssSource).toContain('bottom: 1px;');
    expect(mainScssSource).toContain('left: 1px;');
    expect(mainScssSource).toContain('top: 1px;');
    expect(mainScssSource).toContain('border-radius: 0;');
  });
});
