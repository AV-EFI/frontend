import type { IconEntry } from '~/types/iconEntry';
import { asArray, segment } from './entryHelpers';

interface ManifestationBuilderDeps {
    t: (key: string, ...args: unknown[]) => string;
    iconFor: (key: string) => string;
}

export function buildManifestationEntries(data: unknown, deps: ManifestationBuilderDeps): IconEntry[] {
  const { t, iconFor } = deps;
  const d = data as Record<string, unknown> | null | undefined;
  const entries: IconEntry[] = [];

  const evs = asArray((d?.has_record as Record<string, unknown> | undefined)?.has_event);

  // Manifestationstyp (event type/category)
  const evTypes = evs
    .map(e => (e as Record<string, unknown>)?.type || (e as Record<string, unknown>)?.category)
    .filter(Boolean) as string[];
  if (evTypes.length) {
    entries.push({
      key: 'eventType',
      icon: iconFor('eventType'),
      text: evTypes.map(tp => segment(t(tp), tp)),
      aria: `Manifestationstyp: ${evTypes.map(e => t(e)).join(', ')}`,
    });
  }

  // Jahresangabe
  const evYears = evs
    .map(e => (e as Record<string, unknown>)?.has_date || (e as Record<string, unknown>)?.date)
    .filter(Boolean) as string[];
  if (evYears.length) {
    entries.push({
      key: 'mfYear',
      icon: iconFor('mfYear'),
      text: evYears.map(y => segment(String(y))),
      aria: `Jahresangabe (Manifestationstyp): ${evYears.join(', ')}`,
    });
  }

  // Ortsangabe
  const evPlaces = evs
    .flatMap(e => asArray((e as Record<string, unknown>)?.located_in))
    .map(loc => (loc as Record<string, unknown>)?.has_name)
    .filter(Boolean) as string[];
  if (evPlaces.length) {
    entries.push({
      key: 'mfPlace',
      icon: iconFor('mfPlace'),
      text: evPlaces.map(p => segment(p)),
      aria: `Ortsangabe (Manifestationsereignis): ${evPlaces.join(', ')}`,
    });
  }

  return entries;
}
