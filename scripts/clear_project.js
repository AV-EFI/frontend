#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const rimraf = (target) => {
  if (fs.existsSync(target)) {
    console.log(`🧹 Removing ${target}`);
    fs.rmSync(target, { recursive: true, force: true });
  }
};

const isBerry = fs.existsSync(path.join(process.cwd(), ".yarn"));
console.log(`🔎 Detected Yarn mode: ${isBerry ? "Berry (PnP)" : "Classic (node_modules)"}`);

// Always clean these
[".nuxt", ".output", "dist"].forEach(rimraf);

if (isBerry) {
  // Yarn 4 / Berry cleanup
  [
    ".yarn/build-state.yml",
    ".yarn/install-state.gz",
    ".yarn/unplugged",
    ".yarn/cache"
  ].forEach(rimraf);
} else {
  // Yarn 1 cleanup
  rimraf("node_modules");
}

// Kill running Nuxt processes on Windows
try {
  console.log("🛑 Killing Nuxt processes...");
  execSync(`taskkill /IM node.exe /F`, { stdio: "ignore" });
} catch {
  console.log("ℹ️  No Nuxt processes found or could not be terminated.");
}

try {
  console.log("🧼 Cleaning Yarn cache...");
  execSync("yarn cache clean", { stdio: "inherit" });

  console.log("📦 Installing dependencies...");
  execSync("yarn install", { stdio: "inherit" });

  console.log("✅ Project cleaned successfully!");
} catch (e) {
  console.error("❌ Failed:", e.message);
  process.exit(1);
}
