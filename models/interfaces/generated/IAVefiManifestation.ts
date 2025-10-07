/* eslint-disable */
/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
import type { Manifestation } from "../schema/avefi_schema_type_utils";
import type { IAVefiItem } from "./IAVefiItem";

export interface IAVefiManifestation {
  _id: string;
  handle: string;
  kip?: string;
  production_in_year?: { gte?: number; lte?: number };
  years?: string[];
  "@timestamp"?: number;
  duration_in_minutes?: number;
  url?: string;

  /** Nested items from Elasticsearch response */
  items?: IAVefiItem[];

  has_record: Manifestation;
}
