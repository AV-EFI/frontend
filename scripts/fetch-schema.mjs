import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const TMP_DIR = path.resolve("tmp_schema");
const SCHEMA_REPO = "https://github.com/AV-EFI/av-efi-schema.git";
const SCHEMA_BRANCH = "main";
const TARGET_DIR = path.resolve("models/interfaces/schema");

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

// ✅ Robust cleanup with retry
if (fs.existsSync(TMP_DIR)) {
  console.log("🧹 Cleaning old tmp_schema...");
  try {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  } catch (err) {
    console.warn("⚠️ Initial cleanup failed, retrying...");
    console.error(err);
    run(`rmdir /S /Q "${TMP_DIR}"`); // Windows fallback
  }
}

console.log(`⬇️  Cloning AV-EFI schema repo branch ${SCHEMA_BRANCH} ...`);
run(`git clone --branch ${SCHEMA_BRANCH} --depth 1 ${SCHEMA_REPO} "${TMP_DIR}"`);

// Copy the required files
const filesToCopy = [
  "project/typescript/avefi_schema.ts",
  "project/typescript/avefi_schema_type_utils.ts",
  "project/typescript/locale_messages.json"
];

if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR, { recursive: true });

filesToCopy.forEach((file) => {
  const src = path.join(TMP_DIR, file);
  const dest = path.join(TARGET_DIR, path.basename(file));
  fs.copyFileSync(src, dest);
  console.log(`✅ Copied ${path.basename(file)}`);
});

console.log("📦 Schema files updated successfully.");
