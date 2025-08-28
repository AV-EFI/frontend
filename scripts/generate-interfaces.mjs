// @ts-check
/* eslint-disable */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { globSync } from "glob";
import yaml from "js-yaml";

/** paths */
const TMP_DIR = path.resolve("tmp_schema");
const SCHEMA_REPO = "https://github.com/AV-EFI/av-efi-schema.git";
const SCHEMA_BRANCH = process.env.SCHEMA_BRANCH || "main";
const TARGET_DIR = path.resolve("models/interfaces/schema");
const GENERATED_DIR = path.resolve("models/interfaces/generated");
const OUT_DATA_DIR = path.resolve("assets/data");

/** outputs */
const GLOSSARY_JSON = path.join(OUT_DATA_DIR, "glossary.json");
const FIELD_INDEX_JSON = path.join(OUT_DATA_DIR, "fieldIndex.json");
const SCHEMA_TREE_JSON = path.join(OUT_DATA_DIR, "schemaTree.json");
const ENTITIES_JSON = path.join(OUT_DATA_DIR, "entities.json");

/** docs */
const DOCS_BASE = "https://av-efi.github.io/av-efi-schema/";

/** utils */
function run(cmd) { execSync(cmd, { stdio: "inherit" }); }
const exists = (p) => { try { fs.accessSync(p); return true; } catch { return false; } };
const read = (p) => fs.readFileSync(p, "utf-8");
function writeJson(p, o) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(o, null, 2), "utf-8"); console.log("📝 Wrote", path.relative(process.cwd(), p)); }

/* =========================================================================
   1) Ensure tmp_schema clone (Windows-safe; do NOT delete .git)
   ========================================================================= */
if (!exists(TMP_DIR) || !exists(path.join(TMP_DIR, ".git"))) {
  console.log(`⬇️  Cloning AV-EFI schema repo branch ${SCHEMA_BRANCH} ...`);
  run(`git clone --depth 1 --branch ${SCHEMA_BRANCH} ${SCHEMA_REPO} "${TMP_DIR}"`);
} else {
  console.log(`🔄  Reusing tmp_schema; fetching latest ${SCHEMA_BRANCH} ...`);
  run(`git -C "${TMP_DIR}" reset --hard`);
  run(`git -C "${TMP_DIR}" fetch --all --prune`);
  run(`git -C "${TMP_DIR}" checkout ${SCHEMA_BRANCH}`);
  run(`git -C "${TMP_DIR}" reset --hard origin/${SCHEMA_BRANCH}`);
  run(`git -C "${TMP_DIR}" clean -fdx`);
}

/* =========================================================================
   2) Ensure dirs
   ========================================================================= */
fs.mkdirSync(TARGET_DIR, { recursive: true });
fs.mkdirSync(GENERATED_DIR, { recursive: true });
fs.mkdirSync(OUT_DATA_DIR, { recursive: true });

/* =========================================================================
   3) Copy schema files
   ========================================================================= */
const copyList = [
  // TS
  "project/typescript/avefi_schema.ts",
  "project/typescript/avefi_schema_type_utils.ts",
  "project/typescript/locale_messages.json",
  // YAML (current repo layout)
  "src/avefi_schema/model.yaml",
  "src/avefi_schema/vocab.yaml",
];

for (const rel of copyList) {
  const srcCandidates = [
    path.join(TMP_DIR, rel),
    path.join(TMP_DIR, rel.replace(/^src\/avefi_schema\//, "")), // fallback for older layout
  ];
  const src = srcCandidates.find(exists);
  if (!src) { console.warn("⚠️  Missing in repo:", rel); continue; }
  const dest = path.join(TARGET_DIR, path.basename(rel));
  fs.copyFileSync(src, dest);
  console.log(`✅ Copied ${path.basename(rel)}`);
}

/* =========================================================================
   4) Generate wrapper interfaces
   ========================================================================= */
const WRAPPERS = [
  {
    name: "IAVefiWorkVariant",
    schemaType: "WorkVariant",
    fields: `
  directors_or_editors?: string[];
  castmembers?: string[];
  kip?: string;
  production?: string;
  production_in_year?: { gte?: number; lte?: number };
  subjects?: string[];
  years?: string[];
  "@timestamp"?: number;

  /** Nested parts that reference other work variants */
  parts?: IAVefiWorkVariant[];
  work_variants?: IAVefiWorkVariant[];

  /** Compound record (nested _source from Elasticsearch) */
  compound_record?: { _source: IAVefiWorkVariant };`,
  },
  {
    name: "IAVefiManifestation",
    schemaType: "Manifestation",
    fields: `
  kip?: string;
  production_in_year?: { gte?: number; lte?: number };
  years?: string[];
  "@timestamp"?: number;`,
  },
  {
    name: "IAVefiItem",
    schemaType: "Item",
    fields: `
  kip?: string;
  production_in_year?: { gte?: number; lte?: number };
  years?: string[];
  "@timestamp"?: number;`,
  },
];

for (const { name, schemaType, fields } of WRAPPERS) {
  const extra = name === "IAVefiWorkVariant" ? `import type { IAVefiWorkVariant } from "./IAVefiWorkVariant";\n` : "";
  const content = `/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
import type { ${schemaType} } from "../schema/avefi_schema_type_utils";
${extra}
export interface ${name} {
  handle: string;${fields}
  has_record: ${schemaType};
}
`;
  fs.writeFileSync(path.join(GENERATED_DIR, `${name}.ts`), content);
  console.log(`📝 Generated ${name}.ts`);
}

fs.writeFileSync(
  path.join(GENERATED_DIR, "index.ts"),
  WRAPPERS.map(w => `export type { ${w.name} } from "./${w.name}";`).join("\n")
);
console.log("📝 Generated index.ts");

/* =========================================================================
   5) Disable ESLint headers in models ts
   ========================================================================= */
const ALL_TS = globSync("models/**/*.ts", { nodir: true, cwd: process.cwd(), absolute: true });
console.log(ALL_TS.length, "TypeScript files found for ESLint disabling.");
for (const f of ALL_TS) {
  const c = read(f);
  if (!c.startsWith("/* eslint-disable */")) fs.writeFileSync(f, `/* eslint-disable */\n${c}`);
}

/* =========================================================================
   6) Build glossary.json + preliminary fieldIndex.json from TS
   ========================================================================= */
const enumBlockRe = /export\s+enum\s+(\w+)\s*{([\s\S]*?)}/gm;
const enumMemberRe = /(?:\/\*\*([\s\S]*?)\*\/\s*)?(\w+)\s*(?:=\s*["']?([^"'\s,}]+)["']?)?\s*,?/g;

const interfaceBlockRe = /export\s+interface\s+(\w+)[^{]*{([\s\S]*?)}/gm;
const interfacePropRe = /(?:\/\*\*([\s\S]*?)\*\/\s*)?([a-zA-Z_]\w*)\??\s*:\s*([^;]+);/g;

const cleanJsDoc = (raw) => {
  if (!raw) return { desc: "", def: "" };
  const lines = raw.replace(/\r?\n/g, "\n").split("\n").map(l => l.replace(/^\s*\*\s?/, "").trim()).filter(Boolean);
  return { desc: lines[0] ?? "", def: lines.length > 1 ? lines.slice(1).join(" ") : "" };
};
const enumCategory = (e) =>
  e.replace(/ActivityTypeEnum$/, "Activity Type").replace(/TypeEnum$/, " Type").replace(/Enum$/, "");
const bucketFromIface = (n) =>
  /^(I)?AVefi?WorkVariant$/i.test(n) || /^Work(Variant)?$/i.test(n) ? "WorkVariant"
  : /^(I)?AVefi?Manifestation$/i.test(n) || /^Manifestation$/i.test(n) ? "Manifestation"
  : /^(I)?AVefi?Item$/i.test(n) || /^Item$/i.test(n) ? "Item"
  : n;

function buildGlossaryAndIndexFromTS() {
  const schemaDir = TARGET_DIR;
  const generatedDir = GENERATED_DIR;
  const localePath = path.join(schemaDir, "locale_messages.json");
  const localeJson = exists(localePath) ? JSON.parse(read(localePath)) : {};
  const tr = (k) => (localeJson?.de?.[k] ?? null);

  /** @type {Array<{term:string,label:string,description:string,definition:string,enumSource:string,category:string,isTranslated:boolean}>} */
  const entries = [];
  const seen = new Set();

  /** @type {Record<string,{level:'WorkVariant'|'Manifestation'|'Item',path:string}>} */
  const fieldIndex = {};

  const addEntry = (e) => { const k = `${e.term}|${e.enumSource}`; if (seen.has(k)) return; seen.add(k); entries.push(e); };

  const schemaFilesLocal = ["avefi_schema.ts", "avefi_schema_type_utils.ts"];
  const generatedFilesLocal = ["IAVefiWorkVariant.ts", "IAVefiManifestation.ts", "IAVefiItem.ts"];

  // enums + interfaces from schema TS
  for (const file of schemaFilesLocal) {
    const fp = path.join(schemaDir, file);
    if (!exists(fp)) continue;
    const content = read(fp);

    // enums
    let em; while ((em = enumBlockRe.exec(content))) {
      const enumName = em[1], body = em[2], category = enumCategory(enumName);
      let mm; while ((mm = enumMemberRe.exec(body))) {
        const raw = mm[1], key = mm[2]; if (!key) continue;
        const { desc, def } = cleanJsDoc(raw); const t = tr(key);
        entries.push({ term: key, label: t || key, description: desc, definition: def, enumSource: enumName, category, isTranslated: !!t });
      }
    }

    // interfaces
    let im; while ((im = interfaceBlockRe.exec(content))) {
      const ifaceName = im[1], body = im[2];
      const bucket = bucketFromIface(ifaceName);
      let pm; while ((pm = interfacePropRe.exec(body))) {
        const raw = pm[1], prop = pm[2]; const { desc, def } = cleanJsDoc(raw); const t = tr(prop);
        if (bucket === "WorkVariant" || bucket === "Manifestation" || bucket === "Item") {
          const dotted = `${bucket}.${prop}`;
          addEntry({ term: prop, label: t || prop, description: desc, definition: def, enumSource: dotted, category: bucket, isTranslated: !!t });
          if (!fieldIndex[prop]) fieldIndex[prop] = { level: /** @type any */(bucket), path: dotted };
        }
      }
    }
  }

  // generated coverage
  for (const file of generatedFilesLocal) {
    const fp = path.join(generatedDir, file);
    if (!exists(fp)) continue;
    const content = read(fp);
    let im; while ((im = interfaceBlockRe.exec(content))) {
      const ifaceName = im[1], body = im[2];
      const bucket = bucketFromIface(ifaceName);
      let pm; while ((pm = interfacePropRe.exec(body))) {
        const raw = pm[1], prop = pm[2]; const { desc, def } = cleanJsDoc(raw);
        if (bucket === "WorkVariant" || bucket === "Manifestation" || bucket === "Item") {
          const dotted = `${bucket}.${prop}`;
          addEntry({ term: prop, label: prop, description: desc, definition: def, enumSource: dotted, category: bucket, isTranslated: false });
          if (!fieldIndex[prop]) fieldIndex[prop] = { level: /** @type any */(bucket), path: dotted };
        }
      }
    }
  }

  writeJson(GLOSSARY_JSON, entries);
  writeJson(FIELD_INDEX_JSON, fieldIndex);
  console.log(`📦 glossary(ts): ${entries.length} entries`);
  console.log(`📦 fieldIndex(ts): ${Object.keys(fieldIndex).length} fields`);
}
buildGlossaryAndIndexFromTS();

/* =========================================================================
   7) Parse model.yaml + vocab.yaml → strict W-M-I schemaTree + entities
   ========================================================================= */
const modelPath = path.join(TARGET_DIR, "model.yaml");
const vocabPath = path.join(TARGET_DIR, "vocab.yaml");

if (!exists(modelPath)) {
  console.warn("⚠️ model.yaml not found — skipping structure generation.");
} else {
  /** @type any */ const model = yaml.load(read(modelPath));
  /** @type any */ const vocab = exists(vocabPath) ? yaml.load(read(vocabPath)) : null;

  const classes = model?.classes || {};
  const slots = model?.slots || {};
  const enums = vocab?.enums || model?.enums || {};
  const localePath = path.join(TARGET_DIR, "locale_messages.json");
  const localeJson = exists(localePath) ? JSON.parse(read(localePath)) : {};
  const tr = (k) => (localeJson?.de?.[k] ?? null);
  const safeDesc = (x) => (typeof x === "string" ? x.trim() : "");
  const isEnum = (r) => !!enums[r];

  // ---------- inheritance helpers ----------
  const PARENT = {};
  for (const [cname, cdef] of Object.entries(classes)) {
    if (cdef && typeof cdef === "object" && cdef.is_a) PARENT[cname] = cdef.is_a;
  }
  function lineage(clsName) {
    const arr = [];
    let cur = clsName;
    while (cur) { arr.unshift(cur); cur = PARENT[cur]; }
    return arr;
  }
  function getClassSlotsDeep(clsName) {
    const byName = {};
    for (const c of lineage(clsName)) {
      const cls = classes[c] || {};
      const names = new Set([...(cls.slots || []), ...Object.keys(cls.slot_usage || {})]);
      for (const sName of names) {
        byName[sName] = { name: sName, ...(slots[sName] || {}), ...(cls.slot_usage?.[sName] || {}) };
      }
    }
    return Object.values(byName);
  }

  // ---------- node helper ----------
  const node = (name, full, label, terms = [], children = []) => ({ name, full, label, terms, children });

  // ---------- collect slot names ----------
  const hasClass = (n) => !!classes[n];
  const WV = hasClass("WorkVariant") ? "WorkVariant" : (hasClass("Work") ? "Work" : null);
  const hasM = hasClass("Manifestation");
  const hasI = hasClass("Item");
  const hasMOI = hasClass("ManifestationOrItem");

  // WorkVariant deep slots
  const wvSlots = WV ? getClassSlotsDeep(WV).map(s => s.name) : [];

  // Shared slots (appear once under ManifestationOrItem)
  const moiSlots = hasMOI ? getClassSlotsDeep("ManifestationOrItem").map(s => s.name) : [];
  const moiSet = new Set(moiSlots);

  // Manifestation deep slots MINUS shared
  const mSlots = hasM ? getClassSlotsDeep("Manifestation").map(s => s.name).filter(n => !moiSet.has(n)) : [];

  // Item deep slots MINUS shared
  const iSlots = hasI ? getClassSlotsDeep("Item").map(s => s.name).filter(n => !moiSet.has(n)) : [];

  // Sort for stable UI
  wvSlots.sort(); moiSlots.sort(); mSlots.sort(); iSlots.sort();

  // ---------- build strict W-M-I tree ----------
  const root = node("MovingImageRecord", "MovingImageRecord", tr("MovingImageRecord") || "MovingImageRecord", []);
  const wvRoot = node("WorkVariant", "MovingImageRecord.WorkVariant", tr(WV || "WorkVariant") || (WV || "WorkVariant"), []);
  root.children = [wvRoot];

  if (WV && wvSlots.length) {
    wvRoot.children.push(
      node("WorkVariant",
           "MovingImageRecord.WorkVariant.WorkVariant",
           tr(WV) || WV,
           wvSlots)
    );
  }

  if (hasMOI && moiSlots.length) {
    wvRoot.children.push(
      node("ManifestationOrItem",
           "MovingImageRecord.WorkVariant.ManifestationOrItem",
           tr("ManifestationOrItem") || "ManifestationOrItem",
           moiSlots)
    );
    wvRoot.children.push(
      node("ManifestationOrItemEnums",
           "MovingImageRecord.WorkVariant.ManifestationOrItemEnums",
           "ManifestationOrItemEnums",
           [])
    );
  }

  if (hasM) {
    const mCont = node("manifestations[]", "MovingImageRecord.WorkVariant.manifestations[]", "manifestations[]", []);
    const mNode = node("Manifestation",
                       "MovingImageRecord.WorkVariant.manifestations[].Manifestation",
                       tr("Manifestation") || "Manifestation",
                       mSlots);
    mCont.children.push(mNode);
    mCont.children.push(
      node("ManifestationEnums",
           "MovingImageRecord.WorkVariant.manifestations[].ManifestationEnums",
           "ManifestationEnums",
           [])
    );

    if (hasI) {
      const iCont = node("items[]", "MovingImageRecord.WorkVariant.manifestations[].items[]", "items[]", []);
      const iNode = node("Item",
                         "MovingImageRecord.WorkVariant.manifestations[].items[].Item",
                         tr("Item") || "Item",
                         iSlots);
      iCont.children.push(iNode);
      iCont.children.push(
        node("ItemEnums",
             "MovingImageRecord.WorkVariant.manifestations[].items[].ItemEnums",
             "ItemEnums",
             [])
      );
      mCont.children.push(iCont);
    }

    wvRoot.children.push(mCont);
  }

  wvRoot.children.push(
    node("WorkVariantEnums",
         "MovingImageRecord.WorkVariant.WorkVariantEnums",
         "WorkVariantEnums",
         [])
  );

  // ---------- write the tree ----------
  writeJson(SCHEMA_TREE_JSON, [root]);

  // ---------- normalize + enrich fieldIndex using the tree ----------
  const mergedIndex = exists(FIELD_INDEX_JSON) ? JSON.parse(read(FIELD_INDEX_JSON)) : {};
  for (const [k, v] of Object.entries(mergedIndex)) {
    if (v.level === "Work") v.level = "WorkVariant";
    if (typeof v.path === "string" && v.path.startsWith("Work.")) {
      v.path = v.path.replace(/^Work\./, "WorkVariant.");
    }
  }

  // Map term -> explorerPath by walking tree leaves with terms (skip *Enums; first hit wins)
  const explorerMap = {};
  (function walk(list){
    for (const n of list) {
      const isEnumsGroup = /Enums$/.test(n.name);
      if (n.terms?.length && !isEnumsGroup) {
        for (const t of n.terms) {
          if (!explorerMap[t]) explorerMap[t] = n.full + "." + t;
        }
      }
      if (n.children?.length) walk(n.children);
    }
  })([root]);

  function inferLevelFromExplorerPath(p) {
    if (p.includes(".items[]")) return "Item";
    if (p.includes(".manifestations[]")) return "Manifestation";
    return "WorkVariant";
  }

  for (const [term, expPathRaw] of Object.entries(explorerMap)) {
    const expPath = String(expPathRaw);
    if (expPath.includes(".Enums.")) continue;

    const inferred = inferLevelFromExplorerPath(expPath);

    if (!mergedIndex[term]) {
      mergedIndex[term] = {
        level: inferred,
        path: `${inferred}.${term}`,
      };
    } else {
      if (mergedIndex[term].level !== inferred) mergedIndex[term].level = inferred;
      if (!mergedIndex[term].path || !/^(WorkVariant|Manifestation|Item)\./.test(String(mergedIndex[term].path))) {
        mergedIndex[term].path = `${inferred}.${term}`;
      }
    }
    mergedIndex[term].explorerPath = expPath;
  }
  writeJson(FIELD_INDEX_JSON, mergedIndex);

  /* -----------------------------------------------------------------------
     ENTITIES: every class, slot, enum, enum member (+ docsUrl)
     ----------------------------------------------------------------------- */
  const entities = [];

  const classToExplorerPath = (name) => {
    if (name === "WorkVariant" || name === "Work") return "MovingImageRecord.WorkVariant";
    if (name === "Manifestation") return "MovingImageRecord.WorkVariant.manifestations[]";
    if (name === "Item") return "MovingImageRecord.WorkVariant.manifestations[].items[]";
    if (/^[A-Za-z]+Activity$/.test(name)) return `MovingImageRecord.WorkVariant.Activity.${name}`;
    if (/^[A-Za-z]+Event$/.test(name)) return `MovingImageRecord.WorkVariant.Event.${name}`;
    return `MovingImageRecord.WorkVariant.${name}`;
  };

  // classes + deep slots
  for (const [clsName, clsDef] of Object.entries(classes)) {
    const cPath = classToExplorerPath(clsName);
    entities.push({
      id: `class:${clsName}`,
      kind: "class",
      name: clsName,
      label: tr(clsName) || clsName,
      description: safeDesc(clsDef?.description),
      explorerPath: cPath,
      docsUrl: `${DOCS_BASE}${clsName}/`,
    });

    for (const s of getClassSlotsDeep(clsName)) {
      entities.push({
        id: `slot:${clsName}.${s.name}`,
        kind: "slot",
        name: s.name,
        label: tr(s.name) || s.name,
        description: safeDesc(s.description),
        explorerPath: `${cPath}.${s.name}`,
        owner: clsName,
        range: s.range || "",
        docsUrl: `${DOCS_BASE}${s.name}/`,
      });
    }
  }

  // enums + members (groups visible, no terms in the tree)
  for (const [enumName, enumDef] of Object.entries(enums || {})) {
    let ePath = `MovingImageRecord.WorkVariant.${enumName}`;
    const mAct = enumName.match(/^([A-Za-z]+)ActivityTypeEnum$/);
    const mEvt = enumName.match(/^([A-Za-z]+)EventTypeEnum$/);
    if (mAct) ePath = `MovingImageRecord.WorkVariant.Activity.${mAct[1]}Activity.${mAct[1]}ActivityEnums`;
    if (mEvt) ePath = `MovingImageRecord.WorkVariant.Event.${mEvt[1]}Event.${mEvt[1]}EventEnums`;

    entities.push({
      id: `enum:${enumName}`,
      kind: "enum",
      name: enumName,
      label: tr(enumName) || enumName,
      description: safeDesc(enumDef?.description),
      explorerPath: ePath,
      docsUrl: `${DOCS_BASE}${enumName}/`,
    });

    const members = Object.keys(enumDef?.permissible_values || {});
    for (const m of members) {
      const mDef = enumDef.permissible_values[m];
      entities.push({
        id: `enumMember:${enumName}.${m}`,
        kind: "enumMember",
        name: m,
        label: tr(m) || m,
        description: safeDesc(mDef?.description || mDef?.meaning || ""),
        explorerPath: ePath,
        owner: enumName,
        docsUrl: `${DOCS_BASE}${enumName}/#permissible-values`,
      });
    }
  }

  entities.sort((a,b) => (a.explorerPath + "|" + a.kind + "|" + a.label)
    .localeCompare(b.explorerPath + "|" + b.kind + "|" + b.label));
  writeJson(ENTITIES_JSON, entities);
}

/* =========================================================================
   done
   ========================================================================= */
console.log("🚀 Schema updated, wrappers generated, ESLint headers added, glossary & structure built (with docs).");
