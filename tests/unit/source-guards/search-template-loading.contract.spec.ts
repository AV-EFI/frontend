import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'components/search/InstantSearchTemplateAVefi.vue'),
  'utf8',
);

describe('InstantSearchTemplate loading contract guards', () => {
  test('IST-LOAD-001 keeps reusable skeleton loader for loading state', () => {
    expect(source).toContain('<MicroSkeletonLoader');
    expect(source).toContain('const hasHitsSlotReady = ref(false);');
    expect(source).toContain('function registerHitsSlot(_items: any[])');
    expect(source).toContain('if (!Array.isArray(_items)) {');
    expect(source).toContain(':aria-busy="!hasHitsSlotReady"');
    expect(source).toContain('v-if="!hasHitsSlotReady"');
    expect(source).toContain('v-if="registerHitsSlot(items)"');
    expect(source).toContain('v-else-if="Array.isArray(items) && items.length > 0"');
    expect(source).toContain(':key="buildHitsRenderKey(items)"');
    expect(source).toContain('function buildHitsRenderKey(items: any[])');
    expect(source).toContain('<ais-hits class="">');
  });

  test('IST-LOAD-002 keeps data-load-state wrapper for stats/nbHits', () => {
    expect(source).toContain('const showStatsSkeleton = computed(() =>');
    expect(source).toContain('const statsRawResult = computed<any>(() =>');
    expect(source).toContain('const statsNbHits = computed<number>(() =>');
    expect(source).toContain('v-if="showStatsSkeleton"');
    expect(source).toContain('getDisplayedWorksCount(statsRawResult, statsNbHits)');
    expect(source).toContain(":key=\"`prestats-${statKey}`\"");
    expect(source).toContain('if (!statsRawResult.value) return true;');
    expect(source).toContain('statsRawResult?.nbManifestations');
    expect(source).toContain('statsRawResult?.nbItems');
    expect(source).toContain('v-if="isFiniteNumber(statsRawResult?.nbManifestations)"');
    expect(source).toContain('v-if="isFiniteNumber(statsRawResult?.nbItems)"');
    expect(source).toContain("v-for=\"statKey in ['works', 'manifestations', 'items']\"");
  });
});
