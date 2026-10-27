type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/** Returns the complete record, without the search-engine envelope around it. */
export function unwrapRecord(entry: unknown): unknown {
  const envelope = entry as { compound_record?: { _source?: unknown }; _source?: unknown } | null;
  return envelope?.compound_record?._source ?? envelope?._source ?? entry;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** One column per value, named by its path, e.g. `manifestations.0.items.0.handle`. */
export function flattenRecord(value: unknown, path = '', target: Record<string, string> = {}): Record<string, string> {
  if (Array.isArray(value) && value.length > 0) {
    value.forEach((entry, index) => flattenRecord(entry, path ? `${path}.${index}` : String(index), target));
  } else if (isPlainObject(value) && Object.keys(value).length > 0) {
    for (const [key, entry] of Object.entries(value)) {
      flattenRecord(entry, path ? `${path}.${key}` : key, target);
    }
  } else {
    target[path] = value === null || value === undefined || Array.isArray(value) || isPlainObject(value) ? '' : String(value);
  }
  return target;
}

export function recordsToCsvRows(records: unknown[]): { headers: string[]; rows: Record<string, string>[] } {
  const flattened = records.map((record) => flattenRecord(record));
  const headers = [...new Set(flattened.flatMap((row) => Object.keys(row)))];
  const rows = flattened.map((row) => Object.fromEntries(headers.map((header) => [header, row[header] ?? ''])));
  return { headers, rows };
}

function xmlName(key: string): string {
  const name = key.replace(/[^A-Za-z0-9_.-]/g, '_');
  return /^[A-Za-z_]/.test(name) ? name : `_${name}`;
}

function xmlText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function xmlElement(name: string, value: JsonValue | undefined, indent: string): string {
  const tag = xmlName(name);
  if (Array.isArray(value)) {
    return value.map((entry) => xmlElement(name, entry, indent)).join('');
  }
  if (isPlainObject(value)) {
    const children = Object.entries(value).map(([key, entry]) => xmlElement(key, entry as JsonValue, `${indent}  `)).join('');
    return `${indent}<${tag}>\n${children}${indent}</${tag}>\n`;
  }
  return `${indent}<${tag}>${xmlText(value === null || value === undefined ? '' : String(value))}</${tag}>\n`;
}

export function recordsToXml(records: unknown[]): string {
  const body = records.map((record) => xmlElement('record', record as JsonValue, '  ')).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<records>\n${body}</records>`;
}
