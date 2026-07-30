import metropolisFilmRelatedMaterialsMockup from '~/assets/data/metropolis-mockup.json';
import legacyFilmRelatedMaterialsMockup from '~/assets/data/filmrelated_materials_mockup_06052026.json';

export type FilmRelatedNamedResource = {
    has_name?: string;
};

export type FilmRelatedAuthorityResource = {
    category?: string;
    id?: string;
};

export type FilmRelatedLocation = {
    category?: string;
    has_name?: string;
    same_as?: FilmRelatedAuthorityResource[];
};

export type FilmRelatedEvent = {
    category?: string;
    has_date?: string;
    located_in?: FilmRelatedLocation[];
};

export type FilmRelatedDimension = {
    has_type?: string;
    has_unit?: string;
    has_value?: string;
    has_note?: string;
};

export type FilmRelatedMaterialRecord = {
    category?: string;
    type?: string;
    described_by?: {
        has_issuer_id?: string;
        has_issuer_name?: string;
        has_source_key?: string[];
    };
    has_primary_title?: {
        has_name?: string;
    };
    has_inventory_number?: FilmRelatedAuthorityResource[];
    is_part_of?: FilmRelatedAuthorityResource[];
    is_related_to_work?: FilmRelatedAuthorityResource[];
    has_object_category?: string[];
    has_event?: FilmRelatedEvent[];
    has_subject?: FilmRelatedNamedResource[];
    has_material?: string[];
    has_technique?: string[];
    has_note?: string[];
    has_dimensions?: FilmRelatedDimension[];
    has_resource_representation?: FilmRelatedAuthorityResource[];
};

export type FilmRelatedMaterialWrapper = {
    '@timestamp'?: string;
    handle: string;
    url?: string;
    has_record?: FilmRelatedMaterialRecord;
};

export type FilmRelatedWorkHit = {
    _source?: {
        handle?: string;
        related_material?: FilmRelatedMaterialWrapper[];
    };
};

export type DisplayFilmRelatedMaterial = FilmRelatedMaterialRecord & {
    '@timestamp'?: string;
    handle: string;
    url?: string;
};

const filmRelatedWorks = [
  ...(metropolisFilmRelatedMaterialsMockup as unknown as FilmRelatedWorkHit[]),
  ...(legacyFilmRelatedMaterialsMockup as unknown as FilmRelatedWorkHit[]),
];

function normalizeHandle(handle: string): string {
  return handle.trim().toLowerCase();
}

function findFilmRelatedWorks(workVariantId: string): FilmRelatedWorkHit[] {
  const normalizedWorkVariantId = normalizeHandle(workVariantId);
  if (!normalizedWorkVariantId) return [];

  return filmRelatedWorks.filter((item) =>
    normalizeHandle(item._source?.handle || '') === normalizedWorkVariantId
  );
}

export function getFilmRelatedMaterialsForWork(workVariantId: string): DisplayFilmRelatedMaterial[] {
  const materialsByHandle = new Map<string, DisplayFilmRelatedMaterial>();

  for (const work of findFilmRelatedWorks(workVariantId)) {
    for (const material of work._source?.related_material || []) {
      if (!material.handle) continue;
      materialsByHandle.set(normalizeHandle(material.handle), {
        ...material.has_record,
        '@timestamp': material['@timestamp'],
        handle: material.handle,
        url: material.url
      });
    }
  }

  return Array.from(materialsByHandle.values());
}

export function getFilmRelatedMaterialCountForWork(workVariantId: string): number {
  return getFilmRelatedMaterialsForWork(workVariantId).length;
}

export function hasFilmRelatedMaterialsForWork(workVariantId: string): boolean {
  return getFilmRelatedMaterialCountForWork(workVariantId) > 0;
}
