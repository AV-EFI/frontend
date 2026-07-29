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

  test('keeps large custom fonts out of the mobile critical path', () => {
    expect(appSource).not.toContain("rel: 'preload', href: '/fonts/Inter.ttf'");
    expect(appSource).not.toContain("rel: 'preload', href: '/fonts/BreeSerif-Regular.ttf'");
    expect(nuxtConfigSource).not.toContain("href: '/fonts/Inter.ttf'");
    expect(nuxtConfigSource).not.toContain("href: '/fonts/BreeSerif-Regular.ttf'");
    expect(mainScssSource).toContain('@media (min-width: 768px)');
    expect(mainScssSource).toContain("src: url('/fonts/Inter.ttf') format('truetype');");
    expect(mainScssSource).toContain('font-family: system-ui, -apple-system');
  });
});
