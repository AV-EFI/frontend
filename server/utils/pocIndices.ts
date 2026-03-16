interface PocRuntimeConfig {
    public?: {
        ELASTIC_INDEX_DETAIL?: string;
        ELASTIC_INDEX?: string;
    };
}

export function getPocIndexCandidates(runtimeConfig: PocRuntimeConfig): string[] {
  const candidates = [
    runtimeConfig.public?.ELASTIC_INDEX_DETAIL,
    runtimeConfig.public?.ELASTIC_INDEX,
  ];

  return Array.from(new Set(
    candidates
      .map((value) => (typeof value === 'string' ? value.trim() : ''))
      .filter((value): value is string => value.length > 0 && !value.includes('/')),
  ));
}
