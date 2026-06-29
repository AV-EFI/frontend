import type { IconEntry } from '~/types/iconEntry';
import { asArray, segment } from './entryHelpers';
import { formatDuration } from '~/utils/durationFormatter';

interface ItemBuilderDeps {
    t: (key: string, ...args: unknown[]) => string;
    iconFor: (key: string) => string;
}

export function buildItemEntries(data: unknown, deps: ItemBuilderDeps): IconEntry[] {
  const { t, iconFor } = deps;
  const d = data as Record<string, unknown> | null | undefined;
  const rec = (d?.has_record ?? d) as Record<string, unknown> | undefined;
  const entries: IconEntry[] = [];

  // Status
  const hasAccessStatus = rec?.has_access_status as string | undefined;
  if (hasAccessStatus) {
    entries.push({
      key: 'accessStatus',
      icon: iconFor('accessStatus'),
      text: [segment(t(hasAccessStatus), hasAccessStatus)],
      aria: `${t('has_access_status')}: ${t(hasAccessStatus)}`,
    });
  }

  // Format
  const formats = asArray(rec?.has_format)
    .map(f => (f as Record<string, unknown>)?.type)
    .filter(Boolean) as string[];
  if (formats.length) {
    entries.push({
      key: 'format',
      icon: iconFor('format'),
      text: formats.map(f => segment(t(f), f)),
      aria: `${t('has_format')}: ${formats.map(f => t(f)).join(', ')}`,
    });
  }

  // Materialart (element_type)
  const elementType = rec?.element_type as string | undefined;
  if (elementType) {
    entries.push({
      key: 'elementType',
      icon: iconFor('elementType'),
      text: [segment(t(elementType), elementType)],
      aria: `${t('item_element_type')}: ${t(elementType)}`,
    });
  }

  // Sprache
  const langsArr = asArray(rec?.in_language).map(l => {
    const lang = l as Record<string, unknown>;
    const code = lang?.code as string || (typeof l === 'string' ? l : '');
    const usage = lang?.usage;
    const codeLabel = code ? t(code) : '';
    const usageLabel = Array.isArray(usage) && usage.length
      ? ` (${(usage as string[]).map(u => t(u)).join(', ')})`
      : (usage ? ` (${t(usage as string)})` : '');
    return { code, label: (codeLabel + usageLabel).trim() };
  }).filter(l => l.label);
  if (langsArr.length) {
    entries.push({
      key: 'lang',
      icon: iconFor('lang'),
      text: langsArr.map(lang => segment(lang.label, lang.code)),
      aria: `${t('in_language')}: ${langsArr.map(l => l.label).join(', ')}`,
    });
  }

  // Ton
  const sound = rec?.has_sound_type as string | undefined;
  if (sound) {
    entries.push({
      key: 'sound',
      icon: sound.toLowerCase().includes('silent') ? 'tabler-volume-off' : iconFor('sound'),
      text: [segment(t(sound), sound)],
      aria: `${t('has_sound_type')}: ${t(sound)}`,
    });
  }

  // Farbe
  const colour = rec?.has_colour_type as string | undefined;
  if (colour) {
    entries.push({
      key: 'colour',
      icon: iconFor('colour'),
      text: [segment(t(colour), colour)],
      aria: `${t('has_colour_type')}: ${t(colour)}`,
    });
  }

  // Abspieldauer
  const rawDuration = (rec?.has_duration as Record<string, unknown> | undefined)?.has_value as string | undefined;
  if (rawDuration) {
    const dur = formatDuration(rawDuration);
    entries.push({ key: 'duration', icon: iconFor('duration'), text: [segment(dur, rawDuration)], aria: `${t('duration')}: ${dur}` });
  }

  // Länge/Größe
  const extentRec = rec?.has_extent as Record<string, unknown> | undefined;
  const extentVal = extentRec?.has_value as string | undefined;
  const extentUnit = extentRec?.has_unit as string | undefined;
  if (extentVal) {
    const label = `${extentVal}${extentUnit ? ` ${t(extentUnit)}` : ''}`.trim();
    entries.push({ key: 'extent', icon: iconFor('extent'), text: [segment(label, extentVal)], aria: `${t('avefi:Extent')}: ${label}` });
  }

  // BPS (frame rate)
  const fps = rec?.has_frame_rate as string | number | undefined;
  if (fps != null) {
    entries.push({
      key: 'fps',
      icon: iconFor('fps'),
      text: [segment(String(fps))],
      aria: `${t('has_frame_rate')}: ${fps}`,
    });
  }

  return entries;
}
