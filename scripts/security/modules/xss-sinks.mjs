import { finding, lineOf, readText, trackedFiles } from '../lib/context.mjs';

const SANITIZERS = /\b(?:sanitizeHighlightHtml|markMatches|escapeHtml)\(/;
const TRANSLATION_CALL = /^\$?t\(\s*[^,)]+\)/;

const SCRIPT_SINKS = [
  { key: 'innerHTML', regex: /\.(?:inner|outer)HTML\s*=(?!=)/g, label: 'innerHTML/outerHTML-Zuweisung' },
  { key: 'insertAdjacentHTML', regex: /\binsertAdjacentHTML\s*\(/g, label: 'insertAdjacentHTML' },
  { key: 'document.write', regex: /\bdocument\.write(?:ln)?\s*\(/g, label: 'document.write' },
  { key: 'eval', regex: /(?<![\w.])eval\s*\(/g, label: 'eval' },
  { key: 'new-function', regex: /\bnew Function\s*\(/g, label: 'new Function' },
];

/** True when the expression calls a function of the same file whose body uses a sanitizer. */
function callsLocalSanitizingWrapper(text, expression) {
  const name = expression.match(/^(\w+)\(/)?.[1];
  if (!name) return false;
  const declaration = text.match(new RegExp(`function ${name}\\s*\\(([\\s\\S]{0,400})`));
  return Boolean(declaration && SANITIZERS.test(declaration[1]));
}

function normalise(expression) {
  return expression.replace(/\s+/g, ' ').trim().slice(0, 80);
}

export default {
  id: 'xss-sinks',
  title: 'XSS-Senken (v-html und DOM-Schreibzugriffe)',
  owasp: ['A05'],
  devGuide: 'Implementation › Secure Libraries',
  async run() {
    const findings = [];
    const vueFiles = trackedFiles({ extensions: ['.vue'], exclude: ['docs/', 'tests/'] });
    let vHtmlCount = 0;

    for (const file of vueFiles) {
      const text = readText(file);
      for (const match of text.matchAll(/v-html\s*=\s*(["'])([\s\S]*?)\1/g)) {
        vHtmlCount += 1;
        const expression = match[2].trim();
        const safe =
          SANITIZERS.test(expression) ||
          callsLocalSanitizingWrapper(text, expression) ||
          (TRANSLATION_CALL.test(expression) && !expression.includes('{'));
        if (safe) continue;
        findings.push(
          finding(`xss-sinks:v-html:${file}:${normalise(expression)}`, 'high', `v-html ohne Escaping in ${file}`, {
            detail: `Zeile ${lineOf(text, match.index)}: ${normalise(expression)}`,
            hint: 'Mit sanitizeHighlightHtml/markMatches/escapeHtml (utils/safeHtml.ts) absichern oder in baseline.json mit Begründung eintragen',
          }),
        );
      }
    }

    const sources = trackedFiles({ extensions: ['.vue', '.ts', '.js', '.mjs'], exclude: ['docs/', 'tests/', 'scripts/', 'models/', 'node_modules/'] });
    for (const file of sources) {
      const text = readText(file);
      for (const { key, regex, label } of SCRIPT_SINKS) {
        regex.lastIndex = 0;
        for (const match of text.matchAll(regex)) {
          findings.push(
            finding(`xss-sinks:${key}:${file}`, 'medium', `${label} in ${file}`, { detail: `Zeile ${lineOf(text, match.index)}` }),
          );
        }
      }
    }
    return { findings, notes: [`${vHtmlCount} v-html-Stellen in ${vueFiles.length} Vue-Dateien`] };
  },
};
