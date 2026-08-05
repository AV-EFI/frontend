import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { lightThemeColors, darkThemeColors } from '../tailwind.colors';

// Node.js provides __filename and __dirname automatically in CommonJS

type ThemeColorLeaf = string;
type ThemeColorScale = Record<string, ThemeColorLeaf>;
type ThemeColorValue = ThemeColorLeaf | ThemeColorScale;
type ThemeColors = Record<string, ThemeColorValue> & {
  custom?: Record<string, ThemeColorLeaf>;
};
type GeneratedColors = Record<string, ThemeColorLeaf | ThemeColorScale>;

const scssVars: string[] = [];
const cssLight: string[] = [];
const cssDark: string[] = [];

const nestedLightColors: GeneratedColors = {};
const nestedDarkColors: GeneratedColors = {};
const writtenVars = new Set<string>();
const lightColors = lightThemeColors as ThemeColors;
const darkColors = darkThemeColors as ThemeColors;

function isNumericKey(key: string) {
  return /^[0-9]+$/.test(key);
}

function addVar(name: string, value: unknown, targetCss: string[]) {
  const cssValue = String(value);

  if (!writtenVars.has(name)) {
    scssVars.push(`$${name}: ${cssValue};`);
    writtenVars.add(name);
  }
  targetCss.push(`  --${name}: ${cssValue};`);
}

function processTheme(themeColors: ThemeColors, nestedTarget: GeneratedColors, cssTarget: string[]) {
  for (const [group, value] of Object.entries(themeColors)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const isScale = Object.keys(value).some(k => isNumericKey(k) || k === 'DEFAULT');
      if (isScale) {
        const nestedGroup: ThemeColorScale = {};
        nestedTarget[group] = nestedGroup;
        for (const [key, val] of Object.entries(value)) {
          const name = key === 'DEFAULT' ? group : `${group}-${key}`;
          addVar(name, val, cssTarget);
          nestedGroup[key === 'DEFAULT' ? 'DEFAULT' : key] = String(val);
        }
      } else {
        for (const [key, val] of Object.entries(value)) {
          const flatKey = group === 'custom' ? key : `${group}-${key}`;
          addVar(flatKey, val, cssTarget);
          nestedTarget[flatKey] = String(val);
        }
      }
    } else {
      const flatKey = group;
      addVar(flatKey, value, cssTarget);
      nestedTarget[flatKey] = String(value);
    }
  }
}

// Process themes
processTheme(lightColors, nestedLightColors, cssLight);
processTheme(darkColors, nestedDarkColors, cssDark);

// Force inclusion of required custom tokens
const requiredTokens = [
  'favourites-list', 'favourites-list-hover', 'favourites-list-content',
  'compare-list', 'compare-list-hover', 'compare-list-content',
  'work', 'manifestation', 'item', 'work-variant'
];

requiredTokens.forEach(token => {
  if (!nestedLightColors[token] && lightColors.custom?.[token]) {
    nestedLightColors[token] = lightColors.custom[token];
  }
  if (!nestedDarkColors[token] && darkColors.custom?.[token]) {
    nestedDarkColors[token] = darkColors.custom[token];
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
