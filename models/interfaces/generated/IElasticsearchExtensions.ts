/* eslint-disable */
/* AUTO-GENERATED FILE — Elasticsearch extensions for AVEFI interfaces */

import type { WorkVariant, Manifestation, Item } from "../schema/avefi_schema_type_utils";

/**
 * Extended interfaces that include Elasticsearch-specific properties
 * Based on the Elasticsearch mapping provided
 */

export interface ElasticsearchWorkVariant extends WorkVariant {
  _id?: string;
  "@timestamp"?: number;
  handle?: string;
  kip?: string;
  castmembers?: string[];
  directors_or_editors?: string[];
  duration_in_minutes?: number;
  production?: string;
  production_in_year?: {
    gte?: number;
    lte?: number;
  };
  subjects?: string[];
  url?: string;
  years?: string[];
  
  // Nested structures
  manifestations?: ElasticsearchManifestation[];
  parents?: ElasticsearchWorkVariant[];
}

export interface ElasticsearchManifestation extends Manifestation {
  _id?: string;
  "@timestamp"?: number;
  handle?: string;
  kip?: string;
  duration_in_minutes?: number;
  production_in_year?: {
    gte?: number;
    lte?: number;
  };
  url?: string;
  years?: string[];
  
  // Nested structures
  items?: ElasticsearchItem[];
}

export interface ElasticsearchItem extends Item {
  _id?: string;
  "@timestamp"?: number;
  handle?: string;
  kip?: string;
  duration_in_minutes?: number;
  production_in_year?: {
    gte?: number;
    lte?: number;
  };
  url?: string;
  years?: string[];
}

/**
 * Elasticsearch response wrappers
 */
export interface ElasticsearchHit<T> {
  _index: string;
  _type?: string;
  _id: string;
  _score: number;
  _source: T;
}

export interface ElasticsearchResponse<T> {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  hits: {
    total: {
      value: number;
      relation: string;
    };
    max_score: number;
    hits: ElasticsearchHit<T>[];
  };
}
