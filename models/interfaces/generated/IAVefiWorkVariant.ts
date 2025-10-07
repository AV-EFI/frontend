/* eslint-disable */
/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
import type { WorkVariant } from "../schema/avefi_schema_type_utils";
import type { IAVefiManifestation } from "./IAVefiManifestation";

export interface IAVefiWorkVariant {
  _id: string;
  handle: string;
  directors_or_editors?: string[];
  castmembers?: string[];
  kip?: string;
  production?: string;
  production_in_year?: { gte?: number; lte?: number };
  subjects?: string[];
  years?: string[];
  url?: string;
  "@timestamp"?: number;

  /** Nested manifestations from Elasticsearch response */
  manifestations?: IAVefiManifestation[];

  /** Nested parts that reference other work variants */
  parts?: IAVefiWorkVariant[];
  work_variants?: IAVefiWorkVariant[];

  /** Compound record (nested _source from Elasticsearch) */
  compound_record?: { _source: IAVefiWorkVariant };
  has_record: WorkVariant;
}
