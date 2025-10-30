/* eslint-disable */
/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
import type { Manifestation } from "../schema/avefi_schema_type_utils";

export interface IAVefiManifestation {
  handle: string;
  kip?: string;
  production_in_year?: { gte?: number; lte?: number };
  years?: string[];
  "@timestamp"?: number;
  has_record: Manifestation;
}
