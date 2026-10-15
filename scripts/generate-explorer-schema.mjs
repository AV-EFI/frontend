// @ts-check
/**
 * Builds assets/data/explorerSchema.json for the AVefi Explorer.
 *
 * Reads the LinkML model that generate-interfaces.mjs copies into
 * models/interfaces/schema/model.yaml and resolves inheritance, so the explorer
 * never needs a hand-kept copy of the schema. Read only: nothing is written to
 * the schema repository.
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const MODEL_YAML = path.resolve("models/interfaces/schema/model.yaml");
const OUT_JSON = path.resolve("assets/data/explorerSchema.json");

/** @param {any} entry @param {string} lang */
const alias = (entry, lang) =>
  (entry?.structured_aliases ?? []).find((/** @type {any} */ a) => a.in_language === lang)?.literal_form ?? null;

/** @param {any} def */
function rangeOf(def) {
  if (def?.range) return String(def.range);
  if (Array.isArray(def?.any_of)) return def.any_of.map((/** @type {any} */ r) => r.range).filter(Boolean).join(" | ");
  return null;
}

/** @param {string | undefined} text */
const clean = (text) => (text ?? "").replace(/\s+/g, " ").trim();

const model = /** @type {any} */ (yaml.load(fs.readFileSync(MODEL_YAML, "utf-8")));
const classes = /** @type {Record<string, any>} */ (model.classes);
const slotDefs = /** @type {Record<string, any>} */ (model.slots);

/** Classes from the root down to `id`, so subclasses override their parents. */
function lineage(/** @type {string} */ id) {
  /** @type {string[]} */
  const chain = [];
  for (let current = id; current; current = classes[current]?.is_a) {
    if (!classes[current]) throw new Error(`Unknown class ${current} in the inheritance chain of ${id}`);
    chain.unshift(current);
  }
  return chain;
}

function resolveClass(/** @type {string} */ id) {
  const chain = lineage(id);
  /** @type {Map<string, any>} */
  const slots = new Map();
  for (const classId of chain) {
    const cls = classes[classId];
    const own = [
      ...(cls.slots ?? []).map((/** @type {string} */ name) => [name, slotDefs[name], false]),
      ...Object.entries(cls.attributes ?? {}).map(([name, def]) => [name, def, true]),
    ];
    for (const [name, def] of own) {
      if (!def) throw new Error(`Slot ${name} of ${classId} has no definition`);
      slots.set(name, { name, from: classId, base: def, usage: {} });
    }
    for (const [name, usage] of Object.entries(cls.slot_usage ?? {})) {
      const entry = slots.get(name);
      if (entry) entry.usage = { ...entry.usage, ...usage };
    }
  }
  const resolved = [...slots.values()]
    .map(({ name, from, base, usage }) => {
      const merged = { ...base, ...usage };
      return {
        name,
        from,
        range: rangeOf(merged),
        required: merged.required === true,
        multivalued: merged.multivalued === true,
        rank: merged.rank ?? 1000,
        labelDe: alias(base, "de"),
        labelEn: alias(base, "en"),
        description: clean(merged.description),
      };
    })
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name))
    .map(({ rank, ...slot }) => slot);

  const cls = classes[id];
  return {
    id,
    isA: cls.is_a ?? null,
    abstract: cls.abstract === true,
    labelDe: alias(cls, "de"),
    labelEn: alias(cls, "en"),
    description: clean(cls.description),
    slots: resolved,
  };
}

const out = {
  source: "AV-EFI/av-efi-schema, src/avefi_schema/model.yaml",
  modelDigest: crypto.createHash("sha256").update(fs.readFileSync(MODEL_YAML)).digest("hex").slice(0, 12),
  classes: Object.fromEntries(Object.keys(classes).map((id) => [id, resolveClass(id)])),
};

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2) + "\n", "utf-8");
console.log(`Wrote ${path.relative(process.cwd(), OUT_JSON)} (${Object.keys(out.classes).length} classes)`);
