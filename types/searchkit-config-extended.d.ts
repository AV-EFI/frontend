import type { SearchkitConfig as BaseSearchkitConfig } from "searchkit";

export interface SearchkitConfigExtended extends BaseSearchkitConfig {
  nbManifestations?: number;
  nbItems?: number;
}
