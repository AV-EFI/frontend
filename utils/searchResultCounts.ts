type SearchResultLike = {
  nbWorks?: unknown;
};

export function getDisplayedWorksCount(result: SearchResultLike | null | undefined, nbHits = 0): number {
  return typeof result?.nbWorks === 'number' ? result.nbWorks : nbHits;
}
