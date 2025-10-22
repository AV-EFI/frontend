"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var tailwind_colors_1 = require("../tailwind.colors");
// Node.js provides __filename and __dirname automatically in CommonJS
var scssVars = [];
var cssLight = [];
var cssDark = [];
var nestedLightColors = {};
var nestedDarkColors = {};
var writtenVars = new Set();
function isNumericKey(key) {
    return /^[0-9]+$/.test(key);
}
function addVar(name, value, targetCss) {
    if (!writtenVars.has(name)) {
        scssVars.push("$".concat(name, ": ").concat(value, ";"));
        writtenVars.add(name);
    }
    targetCss.push("  --".concat(name, ": ").concat(value, ";"));
}
function processTheme(themeColors, nestedTarget, cssTarget) {
    for (var _i = 0, _a = Object.entries(themeColors); _i < _a.length; _i++) {
        var _b = _a[_i], group = _b[0], value = _b[1];
        if (typeof value === 'object') {
            var isScale = Object.keys(value).some(function (k) { return isNumericKey(k) || k === 'DEFAULT'; });
            if (isScale) {
                nestedTarget[group] = {};
                for (var _c = 0, _d = Object.entries(value); _c < _d.length; _c++) {
                    var _e = _d[_c], key = _e[0], val = _e[1];
                    var name_1 = key === 'DEFAULT' ? group : "".concat(group, "-").concat(key);
                    addVar(name_1, val, cssTarget);
                    nestedTarget[group][key === 'DEFAULT' ? 'DEFAULT' : key] = val;
                }
            }
            else {
                for (var _f = 0, _g = Object.entries(value); _f < _g.length; _f++) {
                    var _h = _g[_f], key = _h[0], val = _h[1];
                    var flatKey = group === 'custom' ? key : "".concat(group, "-").concat(key);
                    addVar(flatKey, val, cssTarget);
                    nestedTarget[flatKey] = val;
                }
            }
        }
        else {
            var flatKey = group;
            addVar(flatKey, value, cssTarget);
            nestedTarget[flatKey] = value;
        }
    }
}
// Process themes
processTheme(tailwind_colors_1.lightThemeColors, nestedLightColors, cssLight);
processTheme(tailwind_colors_1.darkThemeColors, nestedDarkColors, cssDark);
// Force inclusion of required custom tokens
var requiredTokens = [
    'favourites-list', 'favourites-list-hover', 'favourites-list-content',
    'compare-list', 'compare-list-hover', 'compare-list-content',
    'work', 'manifestation', 'item', 'work-variant'
];
requiredTokens.forEach(function (token) {
    var _a, _b;
    if (!nestedLightColors[token] && ((_a = tailwind_colors_1.lightThemeColors.custom) === null || _a === void 0 ? void 0 : _a[token])) {
        nestedLightColors[token] = tailwind_colors_1.lightThemeColors.custom[token];
    }
    if (!nestedDarkColors[token] && ((_b = tailwind_colors_1.darkThemeColors.custom) === null || _b === void 0 ? void 0 : _b[token])) {
        nestedDarkColors[token] = tailwind_colors_1.darkThemeColors.custom[token];
    }
});
// Write SCSS
var scssOut = path.resolve(__dirname, '../assets/scss/_colors.generated.scss');
fs.writeFileSync(scssOut, "".concat(scssVars.join('\n'), "\n\n:root {\n").concat(cssLight.join('\n'), "\n}\n\nhtml[data-theme=\"avefi_dark\"] {\n").concat(cssDark.join('\n'), "\n}\n"));
// Write Tailwind colors
var tailwindColorsOut = path.resolve(__dirname, '../tailwind.colors.generated.ts');
fs.writeFileSync(tailwindColorsOut, "// Auto-generated Tailwind color config\n  export const lightThemeColors = ".concat(JSON.stringify(nestedLightColors, null, 2), ";\n  export const darkThemeColors = ").concat(JSON.stringify(nestedDarkColors, null, 2), ";\n"));
console.log("\u2705 Generated SCSS: ".concat(scssOut));
console.log("   \u2022 ".concat(scssVars.length, " unique SCSS variables"));
console.log("   \u2022 ".concat(cssLight.length, " light CSS variables"));
console.log("   \u2022 ".concat(cssDark.length, " dark CSS variables"));
console.log("\u2705 Generated Tailwind colors: ".concat(tailwindColorsOut));
