/* eslint-disable */
/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
import type { IAVefiWorkVariant } from "./IAVefiWorkVariant";

export interface ElasticMSearchResponse {
  results: Array<{
    nbHits: number;
    hitsPerPage: number;
    page: number;
    nbPages: number;
    processingTimeMS: number;
    query: string;
    hits: IAVefiWorkVariant[];
    facets?: Record<string, Record<string, number>>;
    facets_stats?: Record<string, any>;
  }>;
}

export interface ElasticGetByIdResponse {
  handle: string;
  compound_record: {
    _index: string;
    _id: string;
    _score: number;
    _source: IAVefiWorkVariant;
  };
}
