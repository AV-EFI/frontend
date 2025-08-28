/* eslint-disable */
 
 
 
/* AUTO-GENERATED FILE — Wrapper interfaces for Elasticsearch responses */
 
import type { WorkVariant, Manifestation, Item } from "./avefi_schema_type_utils";

/**
 * Base interface for PID records returned from Elasticsearch
 */
export interface ElasticsearchBaseRecord<T> {
  handle: string; // Persistent identifier
  compound_record: {
    _source: {
      handle: string;
      has_record: T;
      directors_or_editors?: string[];
      production_in_year?: { gte: number; lte: number }[];
      years?: string[];
    };
  };
}

/**
 * Wrapper for WorkVariant documents
 */
export interface ElasticsearchWorkVariant
  extends ElasticsearchBaseRecord<WorkVariant> {}

/**
 * Wrapper for Manifestation documents
 */
export interface ElasticsearchManifestation
  extends ElasticsearchBaseRecord<Manifestation> {}

/**
 * Wrapper for Item documents
 */
export interface ElasticsearchItem
  extends ElasticsearchBaseRecord<Item> {}
