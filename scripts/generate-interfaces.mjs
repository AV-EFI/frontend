import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { globSync } from "glob";

const TMP_DIR = path.resolve("tmp_schema");
const SCHEMA_REPO = "https://github.com/AV-EFI/av-efi-schema.git";
const SCHEMA_BRANCH = process.env.SCHEMA_BRANCH || "main";
const TARGET_DIR = path.resolve("models/interfaces/schema");
const GENERATED_DIR = path.resolve("models/interfaces/generated");

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

// 1. Clean up
if (fs.existsSync(TMP_DIR)) {
  console.log("🧹 Cleaning old tmp_schema...");
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
}

// 2. Clone schema repo
console.log(`⬇️  Cloning AV-EFI schema repo branch ${SCHEMA_BRANCH} ...`);
run(`git clone --depth 1 --branch ${SCHEMA_BRANCH} ${SCHEMA_REPO} "${TMP_DIR}"`);

// 3. Ensure target dirs
fs.mkdirSync(TARGET_DIR, { recursive: true });
fs.mkdirSync(GENERATED_DIR, { recursive: true });

// 4. Copy schema files
const schemaFiles = [
  "project/typescript/avefi_schema.ts",
  "project/typescript/avefi_schema_type_utils.ts",
  "project/typescript/locale_messages.json",
  "model.yaml",
  "vocab.yaml",
];

for (const file of schemaFiles) {
  const src = path.join(TMP_DIR, file.includes("/") ? file : `project/${file}`);
  if (fs.existsSync(src)) {
    const dest = path.join(TARGET_DIR, path.basename(file));
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied ${path.basename(file)}`);
  }
}

// 5. Generate wrapper interfaces
const wrappers = [
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
  compound_record?: {
    _source: IAVefiWorkVariant;
  };`,
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

wrappers.forEach(({ name, schemaType, fields }) => {
  const additionalImports =
    name === "IAVefiWorkVariant"
      ? `import type { IAVefiWorkVariant } from "./IAVefiWorkVariant";\n`
      : "";

  const content = `/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY */
import type { ${schemaType} } from "../schema/avefi_schema_type_utils";
${additionalImports}
export interface ${name} {
  handle: string;${fields}
  has_record: ${schemaType};
}
`;
  fs.writeFileSync(path.join(GENERATED_DIR, `${name}.ts`), content);
  console.log(`📝 Generated ${name}.ts`);
});

// 6. Generate index.ts
const indexContent = wrappers
  .map(({ name }) => `export type { ${name} } from "./${name}";`)
  .join("\n");

fs.writeFileSync(path.join(GENERATED_DIR, "index.ts"), indexContent);
console.log("📝 Generated index.ts");

// 7. Cleanup tmp dir
console.log("🧹 Cleaning up temporary directory...");
fs.rmSync(TMP_DIR, { recursive: true, force: true });

const ALL_TS_FILES = globSync("models/**/*.ts", { nodir: true, cwd: process.cwd(), absolute: true });
console.log(ALL_TS_FILES);
console.log(ALL_TS_FILES.length, "TypeScript files found for ESLint disabling.");

ALL_TS_FILES.forEach((file) => {
  const content = fs.readFileSync(file, "utf-8");

  // Skip if already starts with "/* eslint-disable */"
  if (!content.startsWith("/* eslint-disable */")) {
    const updated = `/* eslint-disable */\n${content}`;
    fs.writeFileSync(file, updated);
    console.log(`🔧 ESLint disabled in: ${file}`);
  }
});


console.log("🚀 Schema files and interfaces updated, ESLint disabled in all models TS files.");
