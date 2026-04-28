import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type MappingNode = {
  type?: string;
  properties?: Record<string, MappingNode>;
};

let cachedRootProperties: Record<string, MappingNode> | null = null;

function getRootProperties(): Record<string, MappingNode> {
  if (cachedRootProperties) return cachedRootProperties;

  const mappingPath = join(
    process.cwd(),
    'models',
    'interfaces',
    'elasticsearch',
    'mapping_21.11155-denormalised-work-testbed.json',
  );
  const raw = readFileSync(mappingPath, 'utf8');
  const json = JSON.parse(raw) as Record<string, { mappings?: { properties?: Record<string, MappingNode> } }>;
  const firstIndex = Object.keys(json)[0];
  const properties = json[firstIndex]?.mappings?.properties;
  if (!properties) {
    throw new Error('Could not load elastic mapping root properties');
  }
  cachedRootProperties = properties;
  return properties;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNumberLike(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value);
}

function validateRangeObject(value: unknown, path: string, errors: string[]): void {
  if (!isPlainObject(value)) {
    errors.push(`${path}: expected range object`);
    return;
  }
  const allowed = new Set(['gt', 'gte', 'lt', 'lte']);
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      errors.push(`${path}.${key}: unknown range key`);
      continue;
    }
    const v = value[key];
    if (!(typeof v === 'string' || isNumberLike(v))) {
      errors.push(`${path}.${key}: expected string or number`);
    }
  }
}

function validateScalarByType(value: unknown, type: string, path: string, errors: string[]): void {
  if (value === null || value === undefined) return;

  switch (type) {
  case 'text':
  case 'keyword':
  case 'date':
  case 'ip':
    if (!(typeof value === 'string' || isNumberLike(value))) {
      errors.push(`${path}: expected string/number for ${type}`);
    }
    break;
  case 'boolean':
    if (typeof value !== 'boolean') errors.push(`${path}: expected boolean`);
    break;
  case 'byte':
  case 'short':
  case 'integer':
  case 'long':
  case 'unsigned_long':
  case 'half_float':
  case 'float':
  case 'double':
  case 'scaled_float':
    if (!isNumberLike(value)) errors.push(`${path}: expected number for ${type}`);
    break;
  case 'integer_range':
  case 'long_range':
  case 'float_range':
  case 'double_range':
  case 'date_range':
    validateRangeObject(value, path, errors);
    break;
  default:
    break;
  }
}

function validateNodeValue(value: unknown, node: MappingNode, path: string, errors: string[]): void {
  if (value === null || value === undefined) return;

  const hasNestedObject = !!node.properties && Object.keys(node.properties).length > 0;
  if (hasNestedObject) {
    if (Array.isArray(value)) {
      value.forEach((item, idx) => validateObject(item, node.properties!, `${path}[${idx}]`, errors));
      return;
    }
    validateObject(value, node.properties!, path, errors);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, idx) => validateScalarByType(item, node.type || 'unknown', `${path}[${idx}]`, errors));
    return;
  }

  validateScalarByType(value, node.type || 'unknown', path, errors);
}

function validateObject(
  value: unknown,
  properties: Record<string, MappingNode>,
  path: string,
  errors: string[],
  allowMetaKeys = false,
): void {
  if (!isPlainObject(value)) {
    errors.push(`${path}: expected object`);
    return;
  }

  for (const key of Object.keys(value)) {
    if (allowMetaKeys && (key.startsWith('_') || key === 'objectID')) {
      continue;
    }
    const node = properties[key];
    if (!node) {
      errors.push(`${path}.${key}: unknown property`);
      continue;
    }
    validateNodeValue(value[key], node, `${path}.${key}`, errors);
  }
}

export function validateWorkVariantSourceStrict(source: unknown): string[] {
  const errors: string[] = [];
  validateObject(source, getRootProperties(), 'source', errors, false);
  return errors;
}

export function validateWorkVariantSourceFromSearchHit(hit: unknown): string[] {
  const errors: string[] = [];
  validateObject(hit, getRootProperties(), 'hit', errors, true);
  return errors;
}
