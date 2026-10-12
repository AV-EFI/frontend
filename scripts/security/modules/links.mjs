import { finding, lineOf, readText, trackedFiles } from '../lib/context.mjs';

const SAFE_HREF = /safeHref\(|localePath\(|^\s*['"`]?(?:\/|#|mailto:|https?:\/\/)/;

function tagAround(text, index) {
  const start = text.lastIndexOf('<', index);
  const end = text.indexOf('>', index);
  return text.slice(start, end + 1);
}

export default {
  id: 'links',
  title: 'Links, Popups und iframes',
  owasp: ['A05', 'A02'],
  devGuide: 'Implementation › Secure Libraries',
  async run() {
    const findings = [];
    const files = trackedFiles({ extensions: ['.vue', '.ts'], exclude: ['docs/', 'tests/', 'scripts/', 'models/'] });
    let dynamicHrefs = 0;

    for (const file of files) {
      const text = readText(file);

      for (const match of text.matchAll(/(?<![\w-])target="_blank"/g)) {
        if (!/\brel=|:rel=/.test(tagAround(text, match.index))) {
          findings.push(finding(`links:no-rel:${file}:${lineOf(text, match.index)}`, 'low', `target="_blank" ohne rel in ${file}`, { detail: `Zeile ${lineOf(text, match.index)}` }));
        }
      }
      for (const match of text.matchAll(/window\.open\(([^)]*)\)/g)) {
        if (!/noopener/.test(match[1])) {
          findings.push(finding(`links:window-open:${file}:${lineOf(text, match.index)}`, 'low', `window.open ohne noopener in ${file}`, { detail: `Zeile ${lineOf(text, match.index)}` }));
        }
      }
      for (const match of text.matchAll(/<iframe\b/g)) {
        if (!/\bsandbox\b/.test(tagAround(text, match.index))) {
          findings.push(finding(`links:iframe-sandbox:${file}:${lineOf(text, match.index)}`, 'medium', `iframe ohne sandbox in ${file}`, { detail: `Zeile ${lineOf(text, match.index)}` }));
        }
      }
      for (const match of text.matchAll(/(?<![\w-]):href\s*=\s*"([^"]*)"/g)) {
        if (SAFE_HREF.test(match[1])) continue;
        dynamicHrefs += 1;
        findings.push(
          finding(`links:dynamic-href:${file}:${match[1].replace(/\s+/g, ' ').trim().slice(0, 60)}`, 'medium', `Gebundenes href ohne safeHref in ${file}`, {
            detail: `Zeile ${lineOf(text, match.index)}: ${match[1].trim().slice(0, 80)}`,
            hint: 'Stammt der Wert aus Backend- oder Fremddaten? Dann mit safeHref (utils/safeUrl.ts) filtern',
          }),
        );
      }
    }
    return { findings, notes: [`${dynamicHrefs} gebundene href-Ausdrücke ohne Schutz erkannt`] };
  },
};
