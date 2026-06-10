import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const carouselCardSource = readFileSync(
  resolve(process.cwd(), 'components/global/CarouselCardComp.vue'),
  'utf8'
);
const issuerCarouselSource = readFileSync(
  resolve(process.cwd(), 'components/global/IssuerCarouselComp.vue'),
  'utf8'
);
const partnersCarouselSource = readFileSync(
  resolve(process.cwd(), 'components/global/PartnersCarouselComp.vue'),
  'utf8'
);

describe('Home carousel accessibility contract guards', () => {
  test.each([
    ['CarouselCardComp', carouselCardSource],
    ['IssuerCarouselComp', issuerCarouselSource],
    ['PartnersCarouselComp', partnersCarouselSource],
  ])('%s keeps carousel semantics and live slide status', (_name, source) => {
    expect(source).toContain('aria-roledescription="carousel"');
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain('aria-roledescription="slide"');
    expect(source).toContain(':aria-label="getSlideAriaLabel');
  });

  test.each([
    ['CarouselCardComp', carouselCardSource],
    ['IssuerCarouselComp', issuerCarouselSource],
    ['PartnersCarouselComp', partnersCarouselSource],
  ])('%s keeps hidden slides out of keyboard and screenreader navigation', (_name, source) => {
    expect(source).toContain(':aria-hidden="isSlideHidden');
    expect(source).toContain(':inert="isSlideHidden');
    expect(source).toContain('function isSlideHidden(index: number): boolean');
  });

  test.each([
    ['IssuerCarouselComp', issuerCarouselSource],
    ['PartnersCarouselComp', partnersCarouselSource],
  ])('%s exposes an autoplay pause/play control', (_name, source) => {
    expect(source).toContain("isAutoplayPaused ? $t('home.carousel.aria.play') : $t('home.carousel.aria.pause')");
    expect(source).toContain('toggleAutoplay');
    expect(source).toContain('autoplayPlugin.value?.stop?.()');
    expect(source).toContain('autoplayPlugin.value?.play?.()');
  });
});
