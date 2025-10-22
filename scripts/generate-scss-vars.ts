import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { lightThemeColors, darkThemeColors } from '../tailwind.colors';

// Node.js provides __filename and __dirname automatically in CommonJS

const scssVars = [];
const cssLight = [];
const cssDark = [];

const nestedLightColors = {};
const nestedDarkColors = {};
const writtenVars = new Set();

function isNumericKey(key) {
  return /^[0-9]+$/.test(key);
}

function addVar(name, value, targetCss) {
  if (!writtenVars.has(name)) {
    scssVars.push(`$${name}: ${value};`);
    writtenVars.add(name);
  }
  targetCss.push(`  --${name}: ${value};`);
}

function processTheme(themeColors, nestedTarget, cssTarget) {
  for (const [group, value] of Object.entries(themeColors)) {
    if (typeof value === 'object') {
      const isScale = Object.keys(value).some(k => isNumericKey(k) || k === 'DEFAULT');
      if (isScale) {
        nestedTarget[group] = {};
        for (const [key, val] of Object.entries(value)) {
          const name = key === 'DEFAULT' ? group : `${group}-${key}`;
          addVar(name, val, cssTarget);
          nestedTarget[group][key === 'DEFAULT' ? 'DEFAULT' : key] = val;
        }
      } else {
        for (const [key, val] of Object.entries(value)) {
          const flatKey = group === 'custom' ? key : `${group}-${key}`;
          addVar(flatKey, val, cssTarget);
          nestedTarget[flatKey] = val;
        }
      }
    } else {
      const flatKey = group;
      addVar(flatKey, value, cssTarget);
      nestedTarget[flatKey] = value;
    }
  }
}

// Process themes
processTheme(lightThemeColors, nestedLightColors, cssLight);
processTheme(darkThemeColors, nestedDarkColors, cssDark);

// Force inclusion of required custom tokens
const requiredTokens = [
  'favourites-list', 'favourites-list-hover', 'favourites-list-content',
  'compare-list', 'compare-list-hover', 'compare-list-content',
  'work', 'manifestation', 'item', 'work-variant'
];

requiredTokens.forEach(token => {
  if (!nestedLightColors[token] && lightThemeColors.custom?.[token]) {
    nestedLightColors[token] = lightThemeColors.custom[token];
  }
  if (!nestedDarkColors[token] && darkThemeColors.custom?.[token]) {
    nestedDarkColors[token] = darkThemeColors.custom[token];
  }
});

// Write SCSS
const scssOut = path.resolve(__dirname, '../assets/scss/_colors.generated.scss');
fs.writeFileSync(
  scssOut,
  `${scssVars.join('\n')}\n\n:root {\n${cssLight.join('\n')}\n}\n\nhtml[data-theme="avefi_dark"] {\n${cssDark.join('\n')}\n}\n`
);

// Write Tailwind colors
const tailwindColorsOut = path.resolve(__dirname, '../tailwind.colors.generated.ts');
fs.writeFileSync(
  tailwindColorsOut,
  `// Auto-generated Tailwind color config
  export const lightThemeColors = ${JSON.stringify(nestedLightColors, null, 2)};
  export const darkThemeColors = ${JSON.stringify(nestedDarkColors, null, 2)};
`
);

console.log(`✅ Generated SCSS: ${scssOut}`);
console.log(`   • ${scssVars.length} unique SCSS variables`);
console.log(`   • ${cssLight.length} light CSS variables`);
console.log(`   • ${cssDark.length} dark CSS variables`);
console.log(`✅ Generated Tailwind colors: ${tailwindColorsOut}`);
