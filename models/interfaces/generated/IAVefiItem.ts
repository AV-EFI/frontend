/* eslint-disable */
/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
import type { Item } from "../schema/avefi_schema_type_utils";

export interface IAVefiItem {
  handle: string;
  kip?: string;
  production_in_year?: { gte?: number; lte?: number };
  years?: string[];
  "@timestamp"?: number;
  has_record: Item;
}
