import { describe, expect, test } from 'vitest';
import { getDisplayedWorksCount } from '~/utils/searchResultCounts';

describe('getDisplayedWorksCount', () => {
  test('uses nbWorks when backend provides it', () => {
    expect(getDisplayedWorksCount({ nbWorks: 12876 }, 10000)).toBe(12876);
  });

  test('falls back to nbHits when nbWorks is missing', () => {
    expect(getDisplayedWorksCount({}, 10000)).toBe(10000);
    expect(getDisplayedWorksCount(undefined, 10000)).toBe(10000);
  });
});
